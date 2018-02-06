/* global */
'use strict'

var $ = require('jquery')
var ethJSUtil = require('ethereumjs-util')
var BN = ethJSUtil.BN
var remixLib = require('remix-lib')
var EventManager = remixLib.EventManager
var crypto = require('crypto')
var TxRunner = require('./app/execution/txRunner')
var yo = require('yo-yo')
var txFormat = require('./app/execution/txFormat')
var txHelper = require('./app/execution/txHelper')
var txExecution = require('./app/execution/txExecution')
var helper = require('./lib/helper')
var executionContext = require('./execution-context')
var copyToClipboard = require('./app/ui/copy-to-clipboard')

// -------------- styling ----------------------
var csjs = require('csjs-inject')
var styleGuide = remixLib.ui.themeChooser
var styles = styleGuide.chooser()

var css = csjs`
  .instanceTitleContainer {
    display: flex;
    align-items: center;
  }
  .title {
    ${styles.rightPanel.runTab.titlebox_RunTab}
    display: flex;
    justify-content: end;
    align-items: center;
    font-size: 11px;
    height: 30px;
    width: 97%;
    overflow: hidden;
    word-break: break-word;
    line-height: initial;
    overflow: visible;
  }
  .titleLine {
    display: flex;
    align-items: baseline;
  }
  .titleText {
    margin-right: 1em;
    word-break: break-word;
    min-width: 230px;
  }

  .title .copy {
    color: ${styles.rightPanel.runTab.icon_AltColor_Instance_CopyToClipboard};
  }
  .instance {
    ${styles.rightPanel.runTab.box_Instance};
    margin-bottom: 10px;
    padding: 10px 15px 15px 15px;
  }
  .instance .title:before {
    content: "\\25BE";
    margin-right: 5%;
  }
  .instance.hidesub .title:before {
    content: "\\25B8";
    margin-right: 5%;
  }
  .instance.hidesub > * {
      display: none;
  }
  .instance.hidesub .title {
      display: flex;
  }
  .instance.hidesub .udappClose {
      display: flex;
  }

  // here down
  // .contractActions.methList:before {
  //   content: "\\25BE";
  //   margin-right: 5%;
  // }
  // .contractActions.methList.hidesub:before {
  //   content: "\\25B8";
  //   margin-right: 5%;
  // }

  .methCaret {
    margin-right: 5%;
    cursor: pointer;
    font-size: 12px;
  }

  .group:after {
    content: "";
    display: table;
    clear: both;
  }
  // .instance.hidesub .title:before {
  //   content: "\\25B8";
  //   margin-right: 5%;
  // }
  // .instance.hidesub > * {
  //     display: none;
  // }
  // .instance.hidesub .title {
  //     display: flex;
  // }
  // .instance.hidesub .udappClose {
  //     display: flex;
  // }
  // here up
  .buttonsContainer {
    margin-top: 2%;
    display: flex;
    overflow: hidden;
  }
  .contractActions {
    // display: flex;
  }
  .instanceButton {}
  .closeIcon {
    font-size: 12px;
    cursor: pointer;
  }
  .udappClose {
    display: flex;
    justify-content: flex-end;
  }
  .contractProperty {
    overflow: auto;
    margin-top: 0.4em;
  }
  .contractProperty.hasArgs input {
    width: 75%;
    padding: .36em;
    border-radius: 5px;
  }
  .contractProperty button {
    ${styles.rightPanel.runTab.button_Create}
    min-width: 100px;
    width: 100px;
    font-size: 10px;
    margin:0;
    word-break: inherit;
  }
  .contractProperty button:disabled {
    cursor: not-allowed;
    background-color: white;
    border-color: lightgray;
  }
  .contractProperty.constant button {
    ${styles.rightPanel.runTab.button_Constant}
    min-width: 100px;
    width: 100px;
    font-size: 10px;
    margin:0;
    word-break: inherit;
    outline: none;
    width: inherit;
  }
  .contractProperty input {
    display: none;
  }
  .contractProperty > .value {
    box-sizing: border-box;
    float: left;
    align-self: center;
    color: ${styles.appProperties.mainText_Color};
    margin-left: 4px;
  }
  .contractActionsContainer {
    display: flex;
    width: 98%;
  }
  .contractActionsContainerMulti {
    display:none;
  }
  .contractActionsContainerMultiInner {
    border: 1px solid lightgray;
    padding: 5px 5px 5px 10px;
  }
  .multiHeader {
    text-align: left;
    font-size: 10px;
    margin-bottom: 5px;
    font-weight: bold;
    cursor: pointer;
  }
  .multiArg {
    margin-bottom: 8px;
  }

  .multiArg label {
      float: left;
      margin-right: 6px;
      font-size: 10px;
      width: 20%;
  }
  .multiArg button {
    border-radius: 3px;
    float: right;
    margin-right: 5%;
  }
  .hasArgs .multiArg input {
    border-left: 1px solid #dddddd;
  }
  .hasArgs input {
    display: block;
    border: 1px solid #dddddd;
    padding: .36em;
    border-left: none;
    padding: 8px 8px 8px 10px;
    font-size: 10px;
    height: 25px;
  }
  .hasArgs button {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-right: 0;
  }
`

/*
  trigger debugRequested
*/
function UniversalDApp (opts = {}) {
  this.event = new EventManager()
  var self = this

  self._api = opts.api
  self.removable = opts.opt.removable
  self.removable_instances = opts.opt.removable_instances
  self.el = yo`<div class=${css.udapp}></div>`
  self.personalMode = opts.opt.personalMode || false
  self.contracts
  self.transactionContextAPI
  executionContext.event.register('contextChanged', this, function (context) {
    self.reset(self.contracts)
  })
  self.txRunner = new TxRunner({}, {
    personalMode: this.personalMode,
    config: self._api.config,
    detectNetwork: self._api.detectNetwork
  })
}

UniversalDApp.prototype.reset = function (contracts, transactionContextAPI) {
  this.el.innerHTML = ''
  this.contracts = contracts
  if (transactionContextAPI) {
    this.transactionContextAPI = transactionContextAPI
  }
  this.accounts = {}
  if (executionContext.isVM()) {
    this._addAccount('3cd7232cd6f3fc66a57a6bedc1a8ed6c228fff0a327e169c2bcc5e869ed49511', '0x56BC75E2D63100000')
    this._addAccount('2ac6c190b09897cd8987869cc7b918cfea07ee82038d492abce033c75c1b1d0c', '0x56BC75E2D63100000')
    this._addAccount('dae9801649ba2d95a21e688b56f77905e5667c44ce868ec83f82e838712a2c7a', '0x56BC75E2D63100000')
    this._addAccount('d74aa6d18aa79a05f3473dd030a97d3305737cbc8337d940344345c1f6b72eea', '0x56BC75E2D63100000')
    this._addAccount('71975fbf7fe448e004ac7ae54cad0a383c3906055a65468714156a07385e96ce', '0x56BC75E2D63100000')
    executionContext.vm().stateManager.cache.flush(function () {})
  }
  this.txRunner = new TxRunner(this.accounts, {
    personalMode: this.personalMode,
    config: this._api.config,
    detectNetwork: this._api.detectNetwork
  })
}

UniversalDApp.prototype.newAccount = function (password, cb) {
  if (!executionContext.isVM()) {
    if (!this.personalMode) {
      return cb('Not running in personal mode')
    }
    executionContext.web3().personal.newAccount(password, cb)
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

  if (!executionContext.isVM()) {
    throw new Error('_addAccount() cannot be called in non-VM mode')
  }

  if (self.accounts) {
    privateKey = new Buffer(privateKey, 'hex')
    var address = ethJSUtil.privateToAddress(privateKey)

    // FIXME: we don't care about the callback, but we should still make this proper
    executionContext.vm().stateManager.putAccountBalance(address, balance || '0xf00000000000000001', function cb () {})
    self.accounts['0x' + address.toString('hex')] = { privateKey: privateKey, nonce: 0 }
  }
}

UniversalDApp.prototype.getAccounts = function (cb) {
  var self = this

  if (!executionContext.isVM()) {
    // Weirdness of web3: listAccounts() is sync, `getListAccounts()` is async
    // See: https://github.com/ethereum/web3.js/issues/442
    if (self.personalMode) {
      executionContext.web3().personal.getListAccounts(cb)
    } else {
      executionContext.web3().eth.getAccounts(cb)
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

  if (!executionContext.isVM()) {
    executionContext.web3().eth.getBalance(address, function (err, res) {
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

    executionContext.vm().stateManager.getAccountBalance(new Buffer(address, 'hex'), function (err, res) {
      if (err) {
        cb('Account not found')
      } else {
        cb(null, new BN(res).toString(10))
      }
    })
  }
}

UniversalDApp.prototype.renderInstance = function (contract, address, contractName) {
  var abi = txHelper.sortAbiFunction(contract.abi)
  return this.renderInstanceFromABI(abi, address, contractName)
}

// TODO this function was named before "appendChild".
// this will render an instance: contract name, contract address, and all the public functions
// basically this has to be called for the "atAddress" (line 393) and when a contract creation succeed
// this returns a DOM element
UniversalDApp.prototype.renderInstanceFromABI = function (contractABI, address, contractName) {
  var self = this

  function remove () { instance.remove() }

  address = (address.slice(0, 2) === '0x' ? '' : '0x') + address.toString('hex')
  var instance = yo`<div class="instance ${css.instance}" id="instance${address}"></div>`
  var context = executionContext.isVM() ? 'memory' : 'blockchain'

  var shortAddress = helper.shortenAddress(address)
  var title = yo`<div class="${css.title}" onclick=${toggleClass}>
    <div class="${css.titleText}"> ${contractName} at ${shortAddress} (${context}) </div>
    ${copyToClipboard(() => address)}
  </div>`

  if (self.removable_instances) {
    var close = yo`<div class="${css.udappClose}" onclick=${remove}><i class="${css.closeIcon} fa fa-close" aria-hidden="true"></i></div>`
    instance.append(close)
  }

  function toggleClass () {
    $(instance).toggleClass(`${css.hidesub}`)
  }

  instance.appendChild(title)

  // Add the fallback function
  var fallback = txHelper.getFallbackInterface(contractABI)
  if (fallback) {
    instance.appendChild(this.getCallButton({
      funABI: fallback,
      address: address,
      contractAbi: contractABI,
      contractName: contractName
    }))
  }

  $.each(contractABI, (i, funABI) => {
    if (funABI.type !== 'function') {
      return
    }
    // @todo getData cannot be used with overloaded functions
    instance.appendChild(this.getCallButton({
      funABI: funABI,
      address: address,
      contractAbi: contractABI,
      contractName: contractName
    }))
  })

  return instance
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
    inputs = txHelper.inputParametersDeclarationToString(args.funABI.inputs)
    console.log(args.funABI.inputs)
  }
  var inputField = yo`<input></input>`
  inputField.setAttribute('placeholder', inputs)
  inputField.setAttribute('title', inputs)

  var outputOverride = yo`<div class=${css.value}></div>`

  var title
  if (args.funABI.name) {
    title = args.funABI.name
  } else {
    title = '(fallback)'
  }

  var button = yo`<button onclick=${clickButton} class="${css.instanceButton}"></button>`
  button.classList.add(css.call)
  button.setAttribute('title', title)
  button.innerHTML = title
  function clickButton () {
    call(true)
  }
  function clickMultiButton () {
    call(true)
  }

  function call (isUserAction) {
    var logMsg
    if (isUserAction) {
      if (!args.funABI.constant) {
        logMsg = `transact to ${args.contractName}.${(args.funABI.name) ? args.funABI.name : '(fallback)'}`
      } else {
        logMsg = `call to ${args.contractName}.${(args.funABI.name) ? args.funABI.name : '(fallback)'}`
      }
    }
    txFormat.buildData(args.contractName, args.contractAbi, self.contracts, false, args.funABI, inputField.value, self, (error, data) => {
      if (!error) {
        if (isUserAction) {
          if (!args.funABI.constant) {
            self._api.logMessage(`${logMsg} pending ... `)
          } else {
            self._api.logMessage(`${logMsg}`)
          }
        }
        txExecution.callFunction(args.address, data, args.funABI, self, (error, txResult) => {
          if (!error) {
            var isVM = executionContext.isVM()
            if (isVM) {
              var vmError = txExecution.checkVMError(txResult)
              if (vmError.error) {
                self._api.logMessage(`${logMsg} errored: ${vmError.message} `)
                return
              }
            }
            if (lookupOnly) {
              var decoded = txFormat.decodeResponseToTreeView(executionContext.isVM() ? txResult.result.vm.return : ethJSUtil.toBuffer(txResult.result), args.funABI)
              outputOverride.innerHTML = ''
              outputOverride.appendChild(decoded)
            }
          } else {
            self._api.logMessage(`${logMsg} errored: ${error} `)
          }
        })
      } else {
        self._api.logMessage(`${logMsg} errored: ${error} `)
      }
    }, (msg) => {
      self._api.logMessage(msg)
    })
  }

  var contractProperty = yo`<div class="${css.contractProperty} ${css.buttonsContainer}"></div>`
  var contractActions = yo`<div class="${css.contractActions}" ></div>`
  var contractActionsContainer = yo`<div class="${css.contractActionsContainer}" ></div>`

  function switchMethodViewOn () {
    this.parentNode.style.display = 'none'
    this.parentNode.nextSibling.style.display = 'block'
  }
  function switchMethodViewOff () {
    this.parentNode.parentNode.style.display = 'none'
    this.parentNode.parentNode.previousSibling.style.display = 'flex'
  }

  function createMultiFields () {
    if (args.funABI.inputs) {
      return yo`<div>
        ${args.funABI.inputs.map(function (inp) {
          // return yo`<div>the name: ${inp.name}</div>`
          return yo`<div class="${css.multiArg}"><label for="${inp.name}"> ${inp.name}: </label><input placeholder="${inp.type}" id="${inp.name}" title="${inp.name}"></div>`
        })}
      </div>`
    }
  }

  contractProperty.appendChild(contractActions)

  if (inputs.length) {
    var contractActionsContainerMulti = yo`<div class="${css.contractActionsContainerMulti}" ></div>`
    var contractActionsContainerMultiInner = yo`<div class="${css.contractActionsContainerMultiInner}" ></div>`
    var contractActionsMultiInnerTitle = yo`<div onclick=${switchMethodViewOff} class="${css.multiHeader}"><i class='fa fa-caret-down ${css.methCaret}'></i> ${title}</div>`
    var buttonMulti = yo`<button onclick=${clickMultiButton} class="${css.instanceButton}"></button>`
    buttonMulti.classList.add(css.call)
    buttonMulti.setAttribute('title', title)
    buttonMulti.innerHTML = title

    // attach containing div
    contractActions.appendChild(contractActionsContainer)
    contractActionsContainer.appendChild(button)
    contractActionsContainer.appendChild(inputField)

    contractActions.appendChild(contractActionsContainerMulti)
    contractActionsContainerMulti.appendChild(contractActionsContainerMultiInner)
    contractActionsContainerMultiInner.appendChild(contractActionsMultiInnerTitle)

    var contractMethodFields = createMultiFields()

    contractActionsContainerMultiInner.appendChild(contractMethodFields)

    var contractMethodFieldsSubmit = yo`<div class="${css.group} ${css.multiArg}" ></div>`
    contractActionsContainerMultiInner.appendChild(contractMethodFieldsSubmit)
    contractMethodFieldsSubmit.appendChild(buttonMulti)

    var caretBite = yo`<i class="fa fa-caret-right ${css.methCaret}" onclick=${switchMethodViewOn}></i>`
    contractActionsContainer.insertBefore(caretBite, contractActionsContainer.childNodes[0])
  } else {
    // no containing div
    contractActions.appendChild(button)
  }
  if (lookupOnly) {
    contractProperty.appendChild(outputOverride)
  }

  if (lookupOnly) {
    contractProperty.classList.add(css.constant)
    button.setAttribute('title', (title + ' - call'))
  }

  if (args.funABI.inputs && args.funABI.inputs.length > 0) {
    contractProperty.classList.add(css.hasArgs)
    // add stuff here to bulk up the div
  }

  if (args.funABI.payable === true) {
    contractProperty.classList.add(css.payable)
    button.setAttribute('title', (title + ' - transact (payable)'))
  }

  if (!lookupOnly && args.funABI.payable === false) {
    button.setAttribute('title', (title + ' - transact (not payable)'))
  }

  return contractProperty
}

UniversalDApp.prototype.pendingTransactions = function () {
  return this.txRunner.pendingTxs
}

function execute (pipeline, env, callback) {
  function next (err, env) {
    if (err) return callback(err)
    var step = pipeline.shift()
    if (step) step(env, next)
    else callback(null, env.result)
  }
  next(null, env)
}

UniversalDApp.prototype.runTx = function (args, cb) {
  var self = this
  var tx = { to: args.to, data: args.data.dataHex, useCall: args.useCall, from: args.from, value: args.value }
  var payLoad = { funAbi: args.data.funAbi, funArgs: args.data.funArgs, contractBytecode: args.data.contractBytecode, contractName: args.data.contractName } // contains decoded parameters
  var pipeline = [queryGasLimit]
  if (!args.value) {
    pipeline.push(queryValue)
  }
  if (!args.from) {
    pipeline.push(queryAddress)
  }
  pipeline.push(runTransaction)
  var env = { self, tx, payLoad }
  execute(pipeline, env, cb)
}

function queryGasLimit (env, next) {
  var { self, tx } = env
  tx.gasLimit = 3000000
  if (self.transactionContextAPI.getGasLimit) {
    self.transactionContextAPI.getGasLimit(function (err, ret) {
      if (err) return next(err)
      tx.gasLimit = ret
      next(null, env)
    })
  } else next(null, env)
}

function queryValue (env, next) {
  var { self, tx } = env
  tx.value = 0
  if (tx.useCall) return next(null, env)
  if (self.transactionContextAPI.getValue) {
    self.transactionContextAPI.getValue(function (err, ret) {
      if (err) return next(err)
      tx.value = ret
      next(null, env)
    })
  } else next(null, env)
}

function queryAddress (env, next) {
  var { self, tx } = env
  if (self.transactionContextAPI.getAddress) {
    self.transactionContextAPI.getAddress(function (err, ret) {
      if (err) return next(err)
      tx.from = ret
      next(null, env)
    })
  } else {
    self.getAccounts(function (err, ret) {
      if (err) return next(err)
      if (ret.length === 0) return next('No accounts available')
      if (executionContext.isVM() && !self.accounts[ret[0]]) {
        return next('Invalid account selected')
      }
      tx.from = ret[0]
      next(null, env)
    })
  }
}

function runTransaction (env, next) {
  var { self, tx, payLoad } = env
  var timestamp = Date.now()
  self.event.trigger('initiatingTransaction', [timestamp, tx, payLoad])
  self.txRunner.rawRun(tx, function (error, result) {
    if (!tx.useCall) {
      self.event.trigger('transactionExecuted', [error, tx.from, tx.to, tx.data, false, result, timestamp, payLoad])
    } else {
      self.event.trigger('callExecuted', [error, tx.from, tx.to, tx.data, true, result, timestamp, payLoad])
    }
    if (error) {
      if (typeof (error) !== 'string') {
        if (error.message) error = error.message
        else {
          try { error = 'error: ' + JSON.stringify(error) } catch (e) {}
        }
      }
    }
    env.result = result
    next(error, env)
  })
}

module.exports = UniversalDApp
