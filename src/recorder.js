var async = require('async')
var remixLib = require('remix-lib')
var EventManager = remixLib.EventManager
var ethutil = require('ethereumjs-util')
var executionContext = require('./execution-context')
var format = remixLib.execution.txFormat
var txHelper = remixLib.execution.txHelper
var modal = require('./app/ui/modal-dialog-custom')
var modalCustom = require('./app/ui/modal-dialog-custom')
var yo = require('yo-yo')
var modalDialog = require('./app/ui/modaldialog')
var typeConversion = remixLib.execution.typeConversion
var confirmDialog = require('./app/execution/confirmDialog')

/**
  * Record transaction as long as the user create them.
  *
  *
  */
class Recorder {
  constructor (opts = {}) {
    var self = this
    self._api = opts.api
    self.event = new EventManager()
    self.data = { _listen: true, _replay: false, journal: [], _createdContracts: {}, _createdContractsReverse: {}, _usedAccounts: {}, _abis: {}, _contractABIReferences: {}, _linkReferences: {} }
    opts.events.executioncontext.register('contextChanged', () => {
      self.clearAll()
    })
    opts.events.runtab.register('clearInstance', () => {
      self.clearAll()
    })

    opts.events.udapp.register('initiatingTransaction', (timestamp, tx, payLoad) => {
      if (tx.useCall) return
      var { from, to, value } = tx

      // convert to and from to tokens
      if (this.data._listen) {
        var record = { value, parameters: payLoad.funArgs }
        if (!to) {
          var selectedContract = self._api.getContract(payLoad.contractName)
          if (selectedContract) {
            var abi = selectedContract.object.abi
            var sha3 = ethutil.bufferToHex(ethutil.sha3(abi))
            record.abi = sha3
            record.contractName = payLoad.contractName
            record.bytecode = payLoad.contractBytecode
            record.linkReferences = selectedContract.object.evm.bytecode.linkReferences
            if (record.linkReferences && Object.keys(record.linkReferences).length) {
              for (var file in record.linkReferences) {
                for (var lib in record.linkReferences[file]) {
                  self.data._linkReferences[lib] = '<address>'
                }
              }
            }
            self.data._abis[sha3] = abi

            this.data._contractABIReferences[timestamp] = sha3
          }
        } else {
          var creationTimestamp = this.data._createdContracts[to]
          record.to = `created{${creationTimestamp}}`
          record.abi = this.data._contractABIReferences[creationTimestamp]
        }

        record.name = payLoad.funAbi.name
        record.type = payLoad.funAbi.type

        self._api.getAccounts((error, accounts) => {
          if (error) return console.log(error)
          record.from = `account{${accounts.indexOf(from)}}`
          self.data._usedAccounts[record.from] = from
          self.append(timestamp, record)
        })
      }
    })

    opts.events.udapp.register('transactionExecuted', (error, from, to, data, call, txResult, timestamp) => {
      if (error) return console.log(error)
      if (call) return

      var address = executionContext.isVM() ? txResult.result.createdAddress : txResult.result.contractAddress
      if (!address) return // not a contract creation
      address = addressToString(address)
      // save back created addresses for the convertion from tokens to real adresses
      this.data._createdContracts[address] = timestamp
      this.data._createdContractsReverse[timestamp] = address
    })
  }

  /**
    * stop/start saving txs. If not listenning, is basically in replay mode
    *
    * @param {Bool} listen
    */
  setListen (listen) {
    this.data._listen = listen
    this.data._replay = !listen
  }

  extractTimestamp (value) {
    var stamp = /created{(.*)}/g.exec(value)
    if (stamp) {
      return stamp[1]
    }
    return null
  }

  /**
    * convert back from/to from tokens to real addresses
    *
    * @param {Object} record
    * @param {Object} accounts
    * @param {Object} options
    *
    */
  resolveAddress (record, accounts, options) {
    if (record.to) {
      var stamp = this.extractTimestamp(record.to)
      if (stamp) {
        record.to = this.data._createdContractsReverse[stamp]
      }
    }
    record.from = accounts[record.from]
    // @TODO: writing browser test
    return record
  }

  /**
    * save the given @arg record
    *
    * @param {Number/String} timestamp
    * @param {Object} record
    *
    */
  append (timestamp, record) {
    var self = this
    self.data.journal.push({ timestamp, record })
  }

  /**
    * basically return the records + associate values (like abis / accounts)
    *
    */
  getAll () {
    var self = this
    var records = [].concat(self.data.journal)
    return {
      accounts: self.data._usedAccounts,
      linkReferences: self.data._linkReferences,
      transactions: records.sort((A, B) => {
        var stampA = A.timestamp
        var stampB = B.timestamp
        return stampA - stampB
      }),
      abis: self.data._abis
    }
  }

  /**
    * delete the seen transactions
    *
    */
  clearAll () {
    var self = this
    self.data._listen = true
    self.data._replay = false
    self.data.journal = []
    self.data._createdContracts = {}
    self.data._createdContractsReverse = {}
    self.data._usedAccounts = {}
    self.data._abis = {}
    self.data._contractABIReferences = {}
    self.data._linkReferences = {}
  }

  /**
    * run the list of records
    *
    * @param {Object} accounts
    * @param {Object} options
    * @param {Object} abis
    * @param {Function} newContractFn
    *
    */
  run (records, accounts, options, abis, linkReferences, newContractFn) {
    var self = this
    self.setListen(false)
    self._api.logMessage(`Running ${records.length} transaction(s) ...`)
    async.eachOfSeries(records, function (tx, index, cb) {
      var record = self.resolveAddress(tx.record, accounts, options)
      var abi = abis[tx.record.abi]
      if (!abi) {
        modal.alert('cannot find ABI for ' + tx.record.abi + '.  Execution stopped at ' + index)
        return
      }
      /* Resolve Library */
      if (record.linkReferences && Object.keys(record.linkReferences).length) {
        for (var k in linkReferences) {
          var link = linkReferences[k]
          var timestamp = self.extractTimestamp(link)
          if (timestamp && self.data._createdContractsReverse[timestamp]) {
            link = self.data._createdContractsReverse[timestamp]
          }
          tx.record.bytecode = format.linkLibraryStandardFromlinkReferences(k, link.replace('0x', ''), tx.record.bytecode, tx.record.linkReferences)
        }
      }
      /* Encode params */
      var fnABI
      if (tx.record.type === 'constructor') {
        fnABI = txHelper.getConstructorInterface(abi)
      } else {
        fnABI = txHelper.getFunction(abi, record.name)
      }
      if (!fnABI) {
        modal.alert('cannot resolve abi of ' + JSON.stringify(record, null, '\t') + '. Execution stopped at ' + index)
        cb('cannot resolve abi')
        return
      }
      if (tx.record.parameters) {
        /* check if we have some params to resolve */
        try {
          tx.record.parameters.forEach((value, index) => {
            var isString = true
            if (typeof value !== 'string') {
              isString = false
              value = JSON.stringify(value)
            }
            for (var timestamp in self.data._createdContractsReverse) {
              value = value.replace(new RegExp('created\\{' + timestamp + '\\}', 'g'), self.data._createdContractsReverse[timestamp])
            }
            if (!isString) value = JSON.parse(value)
            tx.record.parameters[index] = value
          })
        } catch (e) {
          modal.alert('cannot resolve input parameters ' + JSON.stringify(tx.record.parameters) + '. Execution stopped at ' + index)
          return
        }
      }
      var data = format.encodeData(fnABI, tx.record.parameters, tx.record.bytecode)
      if (data.error) {
        modal.alert(data.error + '. Record:' + JSON.stringify(record, null, '\t') + '. Execution stopped at ' + index)
        cb(data.error)
        return
      } else {
        self._api.logMessage(`(${index}) ${JSON.stringify(record, null, '\t')}`)
        self._api.logMessage(`(${index}) data: ${data.data}`)
        record.data = { dataHex: data.data, funArgs: tx.record.parameters, funAbi: fnABI, contractBytecode: tx.record.bytecode, contractName: tx.record.contractName }
      }
      runTx(self._api.udapp(), record, function (err, txResult) {
        if (err) {
          console.error(err)
          self._api.logMessage(err + '. Execution failed at ' + index)
        } else {
          var address = executionContext.isVM() ? txResult.result.createdAddress : txResult.result.contractAddress
          if (address) {
            address = addressToString(address)
            // save back created addresses for the convertion from tokens to real adresses
            self.data._createdContracts[address] = tx.timestamp
            self.data._createdContractsReverse[tx.timestamp] = address
            newContractFn(abi, address, record.contractName)
          }
        }
        cb(err)
      })
    }, () => { self.setListen(true); self.clearAll() })
  }
}

function runTx (udapp, args, cb) {
  const self = udapp
  async.waterfall([
    function getGasLimit (next) {
      if (self.transactionContextAPI.getGasLimit) {
        return self.transactionContextAPI.getGasLimit(next)
      }
      next(null, 3000000)
    },
    function queryValue (gasLimit, next) {
      if (args.value) {
        return next(null, args.value, gasLimit)
      }
      if (args.useCall || !self.transactionContextAPI.getValue) {
        return next(null, 0, gasLimit)
      }
      self.transactionContextAPI.getValue(function (err, value) {
        next(err, value, gasLimit)
      })
    },
    function getAccount (value, gasLimit, next) {
      if (args.from) {
        return next(null, args.from, value, gasLimit)
      }
      if (self.transactionContextAPI.getAddress) {
        return self.transactionContextAPI.getAddress(function (err, address) {
          next(err, address, value, gasLimit)
        })
      }
      self.getAccounts(function (err, accounts) {
        let address = accounts[0]

        if (err) return next(err)
        if (!address) return next('No accounts available')
        if (executionContext.isVM() && !self.accounts[address]) {
          return next('Invalid account selected')
        }
        next(null, address, value, gasLimit)
      })
    },
    function runTransaction (fromAddress, value, gasLimit, next) {
      var tx = { to: args.to, data: args.data.dataHex, useCall: args.useCall, from: fromAddress, value: value, gasLimit: gasLimit }
      var payLoad = { funAbi: args.data.funAbi, funArgs: args.data.funArgs, contractBytecode: args.data.contractBytecode, contractName: args.data.contractName }
      var timestamp = Date.now()

      self.event.trigger('initiatingTransaction', [timestamp, tx, payLoad])
      self.txRunner.rawRun(tx,

        (network, tx, gasEstimation, continueTxExecution, cancelCb) => {
          if (network.name !== 'Main') {
            return continueTxExecution(null)
          }
          var amount = executionContext.web3().fromWei(typeConversion.toInt(tx.value), 'ether')
          var content = confirmDialog(tx, amount, gasEstimation, self,
            (gasPrice, cb) => {
              let txFeeText, priceStatus
              // TODO: this try catch feels like an anti pattern, can/should be
              // removed, but for now keeping the original logic
              try {
                var fee = executionContext.web3().toBigNumber(tx.gas).mul(executionContext.web3().toBigNumber(executionContext.web3().toWei(gasPrice.toString(10), 'gwei')))
                txFeeText = ' ' + executionContext.web3().fromWei(fee.toString(10), 'ether') + ' Ether'
                priceStatus = true
              } catch (e) {
                txFeeText = ' Please fix this issue before sending any transaction. ' + e.message
                priceStatus = false
              }
              cb(txFeeText, priceStatus)
            },
            (cb) => {
              executionContext.web3().eth.getGasPrice((error, gasPrice) => {
                var warnMessage = ' Please fix this issue before sending any transaction. '
                if (error) {
                  return cb('Unable to retrieve the current network gas price.' + warnMessage + error)
                }
                try {
                  var gasPriceValue = executionContext.web3().fromWei(gasPrice.toString(10), 'gwei')
                  cb(null, gasPriceValue)
                } catch (e) {
                  cb(warnMessage + e.message, null, false)
                }
              })
            }
          )
          modalDialog('Confirm transaction', content,
            { label: 'Confirm',
              fn: () => {
                self._api.config.setUnpersistedProperty('doNotShowTransactionConfirmationAgain', content.querySelector('input#confirmsetting').checked)
                // TODO: check if this is check is still valid given the refactor
                if (!content.gasPriceStatus) {
                  cancelCb('Given gas price is not correct')
                } else {
                  var gasPrice = executionContext.web3().toWei(content.querySelector('#gasprice').value, 'gwei')
                  continueTxExecution(gasPrice)
                }
              }}, {
                label: 'Cancel',
                fn: () => {
                  return cancelCb('Transaction canceled by user.')
                }
              })
        },
        (error, continueTxExecution, cancelCb) => {
          if (error) {
            var msg = typeof error !== 'string' ? error.message : error
            modalDialog('Gas estimation failed', yo`<div>Gas estimation errored with the following message (see below).
            The transaction execution will likely fail. Do you want to force sending? <br>
            ${msg}
            </div>`,
              {
                label: 'Send Transaction',
                fn: () => {
                  continueTxExecution()
                }}, {
                  label: 'Cancel Transaction',
                  fn: () => {
                    cancelCb()
                  }
                })
          } else {
            continueTxExecution()
          }
        },
        function (okCb, cancelCb) {
          modalCustom.promptPassphrase(null, 'Personal mode is enabled. Please provide passphrase of account ' + tx.from, '', okCb, cancelCb)
        },
        function (error, result) {
          let eventName = (tx.useCall ? 'callExecuted' : 'transactionExecuted')
          self.event.trigger(eventName, [error, tx.from, tx.to, tx.data, tx.useCall, result, timestamp, payLoad])

          if (error && (typeof (error) !== 'string')) {
            if (error.message) error = error.message
            else {
              try { error = 'error: ' + JSON.stringify(error) } catch (e) {}
            }
          }
          next(error, result)
        }
      )
    }
  ], cb)
}

function addressToString (address) {
  if (!address) return null
  if (typeof address !== 'string') {
    address = address.toString('hex')
  }
  if (address.indexOf('0x') === -1) {
    address = '0x' + address
  }
  return address
}

module.exports = Recorder
