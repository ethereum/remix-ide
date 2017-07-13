/* global prompt alert */
'use strict'

var $ = require('jquery')
var ethJSUtil = require('ethereumjs-util')
var ethJSABI = require('ethereumjs-abi')
var BN = ethJSUtil.BN
var EventManager = require('ethereum-remix').lib.EventManager
var crypto = require('crypto')
var async = require('async')
var TxRunner = require('./app/txRunner')
var yo = require('yo-yo')
var txFormat = require('./app/execution/txFormat')
var txHelper = require('./app/execution/txHelper')
var txExecution = require('./app/execution/txExecution')
var helper = require('./lib/helper')

// copy to copyToClipboard
const copy = require('clipboard-copy')

// -------------- styling ----------------------
var csjs = require('csjs-inject')
var styleGuide = require('./app/style-guide')
var styles = styleGuide()

var css = csjs`
  .title extends ${styles.dropdown} {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 32px;
    font-size: 11px;
    width: 100%;
    min-width: 265px;
    font-weight: bold;
    background-color: ${styles.colors.blue};
  }
  .titleText {
    margin-right: 1em;
    word-break: break-all;
  }
  .instance extends ${styles.displayBox} {
    margin-top: 3%;
    padding: 10px 15px 6px 15px
  }
  .instance .title:before {
    content: "\\25BE";
    margin-right: 10px;
  }
  .instance.hidesub .title:before {
    content: "\\25B8";
    margin-right: .5em;
    margin-left: .5em;
  }
  .instance.hidesub {
      margin: 0;
  }
  .instance.hidesub > *:not(.title) {
      display: none;
  }
  .copy  {
    font-size: 14px;
    margin-right: 3%;
    cursor: pointer;
    opacity: .7;
  }
  .copy:hover{
    opacity: .5;
  }
  .buttonsContainer {
    margin-top: 2%;
    display: flex;
  }
  .instanceButton {}
`

/*
  trigger debugRequested
*/
function UniversalDApp (executionContext, options) {
  this.event = new EventManager()
  var self = this

  self.options = options || {}
  self.el = yo`<div class="udapp"></div>`
  self.personalMode = self.options.personalMode || false
  self.contracts
  self.transactionContextAPI
  var defaultRenderOutputModifier = function (name, content) { return content }
  self.renderOutputModifier = defaultRenderOutputModifier
  self.web3 = executionContext.web3()
  self.vm = executionContext.vm()
  self.executionContext = executionContext
  self.executionContext.event.register('contextChanged', this, function (context) {
    self.reset(self.contracts)
  })
  self.txRunner = new TxRunner(executionContext, {}, {
    queueTxs: true,
    personalMode: this.personalMode
  })
}

UniversalDApp.prototype.reset = function (contracts, transactionContextAPI, renderer) {
  this.el.innerHTML = ''
  this.contracts = contracts
  this.transactionContextAPI = transactionContextAPI
  this.renderOutputModifier = renderer
  this.accounts = {}
  if (this.executionContext.isVM()) {
    this._addAccount('3cd7232cd6f3fc66a57a6bedc1a8ed6c228fff0a327e169c2bcc5e869ed49511')
    this._addAccount('2ac6c190b09897cd8987869cc7b918cfea07ee82038d492abce033c75c1b1d0c')
    this._addAccount('dae9801649ba2d95a21e688b56f77905e5667c44ce868ec83f82e838712a2c7a')
    this._addAccount('d74aa6d18aa79a05f3473dd030a97d3305737cbc8337d940344345c1f6b72eea')
    this._addAccount('71975fbf7fe448e004ac7ae54cad0a383c3906055a65468714156a07385e96ce')
  }
  this.txRunner = new TxRunner(this.executionContext, this.accounts, {
    queueTxs: true,
    personalMode: this.personalMode
  })
}

UniversalDApp.prototype.newAccount = function (password, cb) {
  if (!this.executionContext.isVM()) {
    if (!this.personalMode) {
      return cb('Not running in personal mode')
    }
    this.web3.personal.newAccount(password, cb)
  } else {
    var privateKey
    do {
      privateKey = crypto.randomBytes(32)
    } while (!ethJSUtil.isValidPrivate(privateKey))
    this._addAccount(privateKey)
    cb(null, '0x' + ethJSUtil.privateToAddress(privateKey))
  }
}

UniversalDApp.prototype._addAccount = function (privateKey, balance) {
  var self = this

  if (!self.executionContext.isVM()) {
    throw new Error('_addAccount() cannot be called in non-VM mode')
  }

  if (self.accounts) {
    privateKey = new Buffer(privateKey, 'hex')
    var address = ethJSUtil.privateToAddress(privateKey)

    // FIXME: we don't care about the callback, but we should still make this proper
    self.vm.stateManager.putAccountBalance(address, balance || 'f00000000000000001', function cb () {
      self.vm.stateManager.cache.flush(function () {})
    })
    self.accounts['0x' + address.toString('hex')] = { privateKey: privateKey, nonce: 0 }
  }
}

UniversalDApp.prototype.getAccounts = function (cb) {
  var self = this

  if (!self.executionContext.isVM()) {
    // Weirdness of web3: listAccounts() is sync, `getListAccounts()` is async
    // See: https://github.com/ethereum/web3.js/issues/442
    if (self.personalMode) {
      self.web3.personal.getListAccounts(cb)
    } else {
      self.web3.eth.getAccounts(cb)
    }
  } else {
    if (!self.accounts) {
      return cb('No accounts?')
    }

    cb(null, Object.keys(self.accounts))
  }
}

UniversalDApp.prototype.getBalance = function (address, cb) {
  var self = this

  address = ethJSUtil.stripHexPrefix(address)

  if (!self.executionContext.isVM()) {
    self.web3.eth.getBalance(address, function (err, res) {
      if (err) {
        cb(err)
      } else {
        cb(null, res.toString(10))
      }
    })
  } else {
    if (!self.accounts) {
      return cb('No accounts?')
    }

    self.vm.stateManager.getAccountBalance(new Buffer(address, 'hex'), function (err, res) {
      if (err) {
        cb('Account not found')
      } else {
        cb(null, new BN(res).toString(10))
      }
    })
  }
}

// TODO this function was named before "appendChild".
// this will render an instance: contract name, contract address, and all the public functions
// basically this has to be called for the "atAddress" (line 393) and when a contract creation succeed
// this returns a DOM element
UniversalDApp.prototype.renderInstance = function (contract, address) {
  // var contractName = Object.keys(JSON.parse(contract.metadata).settings.compilationTarget)[0]
  var contractName = 'contractName'
  function remove () { $instance.remove() }
  var $instance = $(`<div class="instance ${css.instance}"/>`)
  if (this.options.removable_instances) {
    var close = yo`<div class="udapp-close" onclick=${remove}></div>`
    $instance.get(0).appendChild(close)
  }
  var context = this.executionContext.isVM() ? 'memory' : 'blockchain'

  address = (address.slice(0, 2) === '0x' ? '' : '0x') + address.toString('hex')
  var shortAddress = helper.shortenAddress(address)
  var title = yo`
      <div class="${css.title}" onclick=${toggleClass}>
        <div class="${css.titleText}"> ${contractName} at ${shortAddress} (${context}) </div>
        <i class="fa fa-clipboard ${css.copy}" aria-hidden="true" onclick=${copyToClipboard} title='Copy to clipboard'></i>
      </div>
    `
  function toggleClass () {
    $instance.toggleClass(`${css.hidesub}`)
  }

  function copyToClipboard (event) {
    event.stopPropagation()
    copy(address)
  }

  var $events = $('<div class="events"/>')

  var parseLogs = function (err, response) {
    if (err) {
      return
    }

    var $event = $('<div class="event" />')

    var close = yo`<div class="udapp-close" onclick=${remove}></div>`
    function remove () { $event.remove() }

    $event.append($('<span class="name"/>').text(response.event))
      .append($('<span class="args" />').text(JSON.stringify(response.args, null, 2)))
    $event.get(0).appendChild(close)
    $events.append($event)
  }

  if (this.executionContext.isVM()) {
    // FIXME: support indexed events
    var eventABI = {}
    var abi = txHelper.sortAbiFunction(contract)
    $.each(abi, function (i, funABI) {
      if (funABI.type !== 'event') {
        return
      }

      var hash = ethJSABI.eventID(funABI.name, funABI.inputs.map(function (item) { return item.type }))
      eventABI[hash.toString('hex')] = { event: funABI.name, inputs: funABI.inputs }
    })

    this.vm.on('afterTx', function (response) {
      for (var i in response.vm.logs) {
        // [address, topics, mem]
        var log = response.vm.logs[i]
        var event
        var decoded

        try {
          var abi = eventABI[log[1][0].toString('hex')]
          event = abi.event
          var types = abi.inputs.map(function (item) {
            return item.type
          })
          decoded = ethJSABI.rawDecode(types, log[2])
          decoded = ethJSABI.stringify(types, decoded)
        } catch (e) {
          decoded = '0x' + log[2].toString('hex')
        }

        parseLogs(null, { event: event, args: decoded })
      }
    })
  } else {
    var eventFilter = this.web3.eth.contract(abi).at(address).allEvents()
    eventFilter.watch(parseLogs)
  }
  $instance.get(0).appendChild(title)

  // Add the fallback function
  var fallback = txHelper.getFallbackInterface(abi)
  if (fallback) {
    $instance.append(this.getCallButton({
      abi: fallback,
      address: address,
      contractAbi: abi
    }))
  }

  $.each(abi, function (i, funABI) {
    if (funABI.type !== 'function') {
      return
    }
    // @todo getData cannot be used with overloaded functions
    $instance.append(this.getCallButton({
      funABI: funABI,
      address: address,
      contractAbi: abi
    }))
  })

  $instance.append($events)
  return $instance.get(0)
}

// TODO this is used by renderInstance when a new instance is displayed.
// this returns a DOM element.
UniversalDApp.prototype.getCallButton = function (args) {
  var self = this
  // args.funABI, args.address [fun only]
  // args.contractName [constr only]
  var lookupOnly = args.funABI.constant

  var inputs = ''
  if (args.funABI.inputs) {
    $.each(args.funABI.inputs, function (i, inp) {
      if (inputs !== '') {
        inputs += ', '
      }
      inputs += inp.type + ' ' + inp.name
    })
  }
  var inputField = $('<input/>').attr('placeholder', inputs).attr('title', inputs)
  var $outputOverride = $('<div class="value" />')

  var title
  if (args.funABI.name) {
    title = args.funABI.name
  } else {
    title = '(fallback)'
  }

  var button = $(`<button class="${css.instanceButton}"/>`)
    .addClass('call')
    .attr('title', title)
    .text(title)
    .click(() => {
      var funArgs
      try {
        funArgs = $.parseJSON('[' + inputField.val() + ']')
      } catch (e) {
        alert('Error encoding arguments: ' + e)
        return
      }
      txFormat.buildData(args.contractAbi, self.contracts, false, args.funABI, funArgs, self, self.executionContext, (error, data) => {
        if (!error) {
          txExecution.callFunction(args.address, data, args.funABI, self, (error, txResult) => {
            // TODO here should send the result to the dom-console
            console.log('function call', error, txResult)
            alert(error + ' ' + txResult.transactionHash)
          })
        } else {
          alert(error)
        }
      })
    })

  // TODO the auto call to constant function has been removed. needs to readd it later.

  var $contractProperty = $(`<div class="contractProperty ${css.buttonsContainer}"></div>`)
  $contractProperty
    .append(button)
    .append((lookupOnly && !inputs.length) ? $outputOverride : inputField)

  if (lookupOnly) {
    $contractProperty.addClass('constant')
  }

  if (args.abi.inputs && args.abi.inputs.length > 0) {
    $contractProperty.addClass('hasArgs')
  }

  if (args.abi.payable === true) {
    $contractProperty.addClass('payable')
  }

  return $contractProperty
}

// TODO this is used when  the user used the atAddress feature.
UniversalDApp.prototype.clickContractAt = function (self, $output, contract) {
  var address = prompt('What Address is this contract at in the Blockchain? ie: 0xdeadbeaf...')
  var instance = self.renderInstance(contract, address)
  // TODO this is a new 'atAddress' instance (a DOM element), should then be appended somewhere.
}

UniversalDApp.prototype.runTx = function (args, cb) {
  var self = this
  var tx = {
    to: args.to,
    data: args.data,
    useCall: args.useCall
  }
  async.waterfall([
    // query gas limit
    function (callback) {
      tx.gasLimit = 3000000

      if (self.transactionContextAPI.getGasLimit) {
        self.transactionContextAPI.getGasLimit(function (err, ret) {
          if (err) {
            return callback(err)
          }

          tx.gasLimit = ret
          callback()
        })
      } else {
        callback()
      }
    },
    // query value
    function (callback) {
      tx.value = 0
      if (tx.useCall) return callback()
      if (self.transactionContextAPI.getValue) {
        self.transactionContextAPI.getValue(function (err, ret) {
          if (err) {
            return callback(err)
          }

          tx.value = ret
          callback()
        })
      } else {
        callback()
      }
    },
    // query address
    function (callback) {
      if (self.transactionContextAPI.getAddress) {
        self.transactionContextAPI.getAddress(function (err, ret) {
          if (err) {
            return callback(err)
          }

          tx.from = ret

          callback()
        })
      } else {
        self.getAccounts(function (err, ret) {
          if (err) {
            return callback(err)
          }

          if (ret.length === 0) {
            return callback('No accounts available')
          }

          if (self.executionContext.isVM() && !self.accounts[ret[0]]) {
            return callback('Invalid account selected')
          }

          tx.from = ret[0]

          callback()
        })
      }
    },
    // run transaction
    function (callback) {
      self.txRunner.rawRun(tx, function (error, result) { callback(error, result) })
    }
  ], cb)
}

module.exports = UniversalDApp
