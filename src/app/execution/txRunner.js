'use strict'
var yo = require('yo-yo')
var EthJSTX = require('ethereumjs-tx')
var EthJSBlock = require('ethereumjs-block')
var ethJSUtil = require('ethereumjs-util')
var BN = ethJSUtil.BN
var executionContext = require('../../execution-context')
var modalDialog = require('../ui/modaldialog')

function TxRunner (vmaccounts, api) {
  this._api = api
  this.blockNumber = 0
  this.runAsync = true
  if (executionContext.isVM()) {
    this.blockNumber = 1150000 // The VM is running in Homestead mode, which started at this block.
    this.runAsync = false // We have to run like this cause the VM Event Manager does not support running multiple txs at the same time.
  }
  this.pendingTxs = {}
  this.vmaccounts = vmaccounts
  this.queusTxs = []
}

TxRunner.prototype.rawRun = function (args, confirmationCb, gasEstimationForceSend, promptCb, cb) {
  run(this, args, Date.now(), confirmationCb, gasEstimationForceSend, promptCb, cb)
}

function executeTx (tx, gasPrice, api, promptCb, callback) {
  if (gasPrice) tx.gasPrice = executionContext.web3().toHex(gasPrice)
  if (api.personalMode()) {
    promptCb(
      (value) => {
        sendTransaction(executionContext.web3().personal.sendTransaction, tx, value, callback)
      },
      () => {
        return callback('Canceled by user.')
      }
    )
  } else {
    sendTransaction(executionContext.web3().eth.sendTransaction, tx, null, callback)
  }
}

TxRunner.prototype.execute = function (args, confirmationCb, gasEstimationForceSend, promptCb, callback) {
  var self = this

  var data = args.data
  if (data.slice(0, 2) !== '0x') {
    data = '0x' + data
  }

  if (!executionContext.isVM()) {
    self.runInNode(args.from, args.to, data, args.value, args.gasLimit, args.useCall, confirmationCb, gasEstimationForceSend, promptCb, callback)
  } else {
    try {
      self.runInVm(args.from, args.to, data, args.value, args.gasLimit, args.useCall, callback)
    } catch (e) {
      callback(e, null)
    }
  }
}

TxRunner.prototype.runInVm = function (from, to, data, value, gasLimit, useCall, callback) {
  const self = this
  var account = self.vmaccounts[from]
  if (!account) {
    return callback('Invalid account selected')
  }
  var tx = new EthJSTX({
    nonce: new BN(account.nonce++),
    gasPrice: new BN(1),
    gasLimit: new BN(gasLimit, 10),
    to: to,
    value: new BN(value, 10),
    data: new Buffer(data.slice(2), 'hex')
  })
  tx.sign(account.privateKey)

  const coinbases = [ '0x0e9281e9c6a0808672eaba6bd1220e144c9bb07a', '0x8945a1288dc78a6d8952a92c77aee6730b414778', '0x94d76e24f818426ae84aa404140e8d5f60e10e7e' ]
  const difficulties = [ new BN('69762765929000', 10), new BN('70762765929000', 10), new BN('71762765929000', 10) ]
  var block = new EthJSBlock({
    header: {
      timestamp: new Date().getTime() / 1000 | 0,
      number: self.blockNumber,
      coinbase: coinbases[self.blockNumber % coinbases.length],
      difficulty: difficulties[self.blockNumber % difficulties.length],
      gasLimit: new BN(gasLimit, 10).imuln(2)
    },
    transactions: [],
    uncleHeaders: []
  })
  if (!useCall) {
    ++self.blockNumber
  } else {
    executionContext.vm().stateManager.checkpoint()
  }

  executionContext.vm().runTx({block: block, tx: tx, skipBalance: true, skipNonce: true}, function (err, result) {
    if (useCall) {
      executionContext.vm().stateManager.revert(function () {})
    }
    err = err ? err.message : err
    result.status = '0x' + result.vm.exception.toString(16)
    callback(err, {
      result: result,
      transactionHash: ethJSUtil.bufferToHex(new Buffer(tx.hash()))
    })
  })
}

TxRunner.prototype.runInNode = function (from, to, data, value, gasLimit, useCall, confirmCb, gasEstimationForceSend, promptCb, callback) {
  const self = this
  var tx = { from: from, to: to, data: data, value: value }

  if (useCall) {
    tx.gas = gasLimit
    return executionContext.web3().eth.call(tx, function (error, result) {
      callback(error, {
        result: result,
        transactionHash: result.transactionHash
      })
    })
  }
  executionContext.web3().eth.estimateGas(tx, function (err, gasEstimation) {
    gasEstimationForceSend(err, () => {
      // callback is called whenever no error
      tx.gas = !gasEstimation ? gasLimit : gasEstimation

      if (self._api.config.getUnpersistedProperty('doNotShowTransactionConfirmationAgain')) {
        return executeTx(tx, null, self._api, promptCb, callback)
      }

      self._api.detectNetwork((err, network) => {
        if (err) {
          console.log(err)
          return
        }

        confirmCb(network, tx, tx.gas, (gasPrice) => {
          return executeTx(tx, gasPrice, self._api, promptCb, callback)
        }, (error) => {
          callback(error)
        })
      })
    }, () => {
      var blockGasLimit = executionContext.currentblockGasLimit()
      // NOTE: estimateGas very likely will return a large limit if execution of the code failed
      //       we want to be able to run the code in order to debug and find the cause for the failure
      if (err) return callback(err)

      var warnEstimation = ' An important gas estimation might also be the sign of a problem in the contract code. Please check loops and be sure you did not sent value to a non payable function (that\'s also the reason of strong gas estimation). '
      warnEstimation += ' ' + err

      if (gasEstimation > gasLimit) {
        return callback('Gas required exceeds limit: ' + gasLimit + '. ' + warnEstimation)
      }
      if (gasEstimation > blockGasLimit) {
        return callback('Gas required exceeds block gas limit: ' + gasLimit + '. ' + warnEstimation)
      }
    })
  })
}

const TX_RETRY_TIMEOUT = 500
const TX_ALERT_TIMEOUT = 10000

function tryTillResponse (txhash, done, attempts = 0) {
  // Show pending modal after 10 seconds
  if (attempts * TX_RETRY_TIMEOUT === TX_ALERT_TIMEOUT) {
    modalDialog('Transaction pending', yo`<div>${txhash} is still pending...</div>`, null, { hide: true })
  }

  executionContext.web3().eth.getTransactionReceipt(txhash, function (err, result) {
    if (err || !result) {
      // Try again with a bit of delay if error or if result still null
      setTimeout(() => { tryTillResponse(txhash, done, attempts + 1) }, TX_RETRY_TIMEOUT)
    } else {
      done(err, {
        result: result,
        transactionHash: result.transactionHash
      })
    }
  })
}

function sendTransaction (sendTx, tx, pass, callback) {
  var cb = function (err, resp) {
    if (err) {
      return callback(err, resp)
    }
    tryTillResponse(resp, callback)
  }
  var args = pass !== null ? [tx, pass, cb] : [tx, cb]
  try {
    sendTx.apply({}, args)
  } catch (e) {
    return callback(`Send transaction failed: ${e.message} . if you use an injected provider, please check it is properly unlocked. `)
  }
}

function run (self, tx, stamp, confirmationCb, gasEstimationForceSend, promptCb, callback) {
  if (!self.runAsync && Object.keys(self.pendingTxs).length) {
    self.queusTxs.push({ tx, stamp, callback })
  } else {
    self.pendingTxs[stamp] = tx
    self.execute(tx, confirmationCb, gasEstimationForceSend, promptCb, (error, result) => {
      delete self.pendingTxs[stamp]
      callback(error, result)
      if (self.queusTxs.length) {
        var next = self.queusTxs.pop()
        run(self, next.tx, next.stamp, next.callback)
      }
    })
  }
}

module.exports = TxRunner
