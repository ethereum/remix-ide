'use strict'
var $ = require('jquery')
var yo = require('yo-yo')
var helper = require('../../lib/helper.js')
var txExecution = require('../execution/txExecution')
var txFormat = require('../execution/txFormat')
var txHelper = require('../execution/txHelper')
var modalDialogCustom = require('../ui/modal-dialog-custom')
var executionContext = require('../../execution-context')
var Recorder = require('../../recorder')
const copy = require('clipboard-copy')

// -------------- styling ----------------------
var csjs = require('csjs-inject')
var remix = require('ethereum-remix')
var styleGuide = remix.ui.styleGuide
var styles = styleGuide()

var css = csjs`
  .runTabView {
    padding: 2%;
    display: flex;
    flex-direction: column;
  }
  .settings {
    ${styles.rightPanel.runTab.box_RunTab}
    margin-bottom: 2%;
    padding: 10px 15px 15px 15px;
  }
  .crow {
    margin-top: .5em;
    display: flex;
  }
  .col1 {
    width: 30%;
    float: left;
    align-self: center;
  }
  .col1_1 {
    font-size: 12px;
    width: 25%;
    min-width: 75px;
    float: left;
    align-self: center;
  }
  .col2 {
    ${styles.rightPanel.runTab.input_RunTab}
  }
  .select {
    ${styles.rightPanel.runTab.dropdown_RunTab}
    font-weight: normal;
    min-width: 150px;
  }
  .copyaddress {
    margin-left: 0.5em;
    margin-top: 0.7em;
    cursor: pointer;
    color: ${styles.rightPanel.runTab.icon_Color_Instance_CopyToClipboard};
  }
  .copyaddress:hover {
    color: ${styles.rightPanel.runTab.icon_HoverColor_Instance_CopyToClipboard};
  }
  .instanceContainer {
    ${styles.rightPanel.runTab.box_Instance}
    display: flex;
    flex-direction: column;
    margin-top: 2%;
    border: none;
    text-align: center;
  }
  .pendingTxsContainer  {
    ${styles.rightPanel.runTab.box_Instance}
    display: flex;
    flex-direction: column;
    margin-top: 2%;
    border: none;
    text-align: center;
  }
  .container {
    ${styles.rightPanel.runTab.box_RunTab}
    margin-top: 2%;
  }
  .contractNames {
    ${styles.rightPanel.runTab.dropdown_RunTab}
  }
  .subcontainer {
    display: flex;
    flex-direction: row;
    align-items: baseline;
  }

  .button {
    display: flex;
    align-items: center;
    margin-top: 2%;
  }
  .transaction {
    ${styles.rightPanel.runTab.button_transaction}
  }
  .atAddress {
    ${styles.rightPanel.runTab.button_atAddress}
  }
  .create {
    ${styles.rightPanel.runTab.button_Create}
  }
  .input {
    ${styles.rightPanel.runTab.input_RunTab}
  }
  .noInstancesText {
    ${styles.rightPanel.runTab.box_Instance}
    font-style: italic;
  }
  .pendingTxsText {
    ${styles.rightPanel.runTab.box_Instance}
    font-style: italic;
  }
  .item {
    margin-right: 1em;
    display: flex;
    align-items: center;
  }
  .transact {
    color: ${styles.colors.lightRed};
    margin-right: .3em;
  }
  .payable {
    color: ${styles.colors.red};
    margin-right: .3em;
  }
  .call {
    color: ${styles.colors.lightBlue};
    margin-right: .3em;
  }
  .pendingContainer {
    display: flex;
    align-items: baseline;
  }
  .pending {
    height: 25px;
    text-align: center;
    padding-left: 10px;
    border-radius: 3px;
    margin-left: 5px;
  }
  .icon {
    font-size: 12px;
    color: ${styles.colors.orange};
    margin-left: 10%;
  }
  .errorIcon {
    color: ${styles.colors.red};;
    margin-left: 15px;
  }
  .errorIcon {
    color: ${styles.colors.red};;
    margin-left: 15px;
  }
  .failDesc {
    color: ${styles.colors.red};;
    padding-left: 10px;
    display: inline;
  }
`

module.exports = runTab

var noInstancesText = yo`<div class="${css.noInstancesText}">0 contract Instances</div>`

function runTab (container, appAPI, appEvents, opts) {
  var self = {
    _view: {},
    addInstance: addInstance
  }
  var udapp = appAPI.udapp()

  var instanceContainer = yo`<div class="${css.instanceContainer}"></div>`

  var pendingTxsText = yo`<div class="${css.pendingTxsText}"></div>`
  var pendingTxsContainer = yo`
    <div class="${css.pendingTxsContainer}">
      <div class=${css.buttons}>${makeRecorder(self, appAPI, appEvents)}</div>
      ${pendingTxsText}
    </div>
  `

  var el = yo`
  <div class="${css.runTabView}" id="runTabView">
    ${settings(self, appAPI, appEvents)}
    ${contractDropdown(self, appAPI, appEvents, instanceContainer)}
    ${pendingTxsContainer}
    ${instanceContainer}
  </div>
  `
  container.appendChild(el)

  function addInstance (result) {
    // {
    //   "result": {
    //     "gasUsed": "5318",
    //     "vm": { "exception": 1, "selfdestruct": {} },
    //     "bloom": { "bitvector": { "type": "Buffer", "data": [0, /* ... */ 0, 0] } },
    //     "amountSpent": "5318"
    //   },
    //   "transactionHash": "0x84f68f96944a47b27af4b4ed1986637aa1bc05fd7a6f5cb1d6a53f68058276d8"
    // }
    console.log(result)
    var contractNames = document.querySelector(`.${css.contractNames.classNames[0]}`)
    var contract = appAPI.getContracts()[contractNames.children[contractNames.selectedIndex].innerHTML]
    var address = self._view.atAddressButtonInput.value
    var instance = udapp.renderInstance(contract, address, self._view.selectContractNames.value)
    instanceContainer.appendChild(instance)
  }

  // PENDING transactions
  function updatePendingTxs (container, appAPI) {
    var pendingCount = Object.keys(udapp.pendingTransactions()).length
    pendingTxsText.innerText = pendingCount + ' pending transactions'
  }

  // DROPDOWN
  var selectExEnv = el.querySelector('#selectExEnvOptions')
  selectExEnv.addEventListener('change', function (event) {
    executionContext.executionContextChange(selectExEnv.options[selectExEnv.selectedIndex].value, null, () => {
      // set the final context. Cause it is possible that this is not the one we've originaly selected
      selectExEnv.value = executionContext.getProvider()
      fillAccountsList(appAPI, el)
    })

    instanceContainer.innerHTML = '' // clear the instances list
    noInstancesText.style.display = 'block'
    instanceContainer.appendChild(noInstancesText)
  })
  selectExEnv.value = executionContext.getProvider()
  fillAccountsList(appAPI, el)
  setInterval(() => {
    updateAccountBalances(container, appAPI)
    updatePendingTxs(container, appAPI)
  }, 500)
}

function fillAccountsList (appAPI, container) {
  var $txOrigin = $(container.querySelector('#txorigin'))
  $txOrigin.empty()
  appAPI.udapp().getAccounts((err, accounts) => {
    if (err) { console.log(err) }
    if (accounts && accounts[0]) {
      for (var a in accounts) { $txOrigin.append($('<option />').val(accounts[a]).text(accounts[a])) }
      $txOrigin.val(accounts[0])
    } else {
      $txOrigin.val('unknown')
    }
  })
}

function updateAccountBalances (container, appAPI) {
  var accounts = $(container.querySelector('#txorigin')).children('option')
  accounts.each(function (index, value) {
    (function (acc) {
      appAPI.getBalance(accounts[acc].value, function (err, res) {
        if (!err) {
          accounts[acc].innerText = helper.shortenAddress(accounts[acc].value, res)
        }
      })
    })(index)
  })
}

/* ------------------------------------------------
    RECORDER
------------------------------------------------ */
function makeRecorder (self, appAPI, appEvents) {
  var udapp = appAPI.udapp()
  var recorder = new Recorder({
    events: {
      udapp: appEvents.udapp,
      executioncontext: executionContext.event
    },
    api: {
      getAccounts (cb) { udapp.getAccounts(cb) }
    }
  })
  var css2 = csjs`
    .container {
      margin: 10px;
      display: flex;
      justify-content: space-evenly;
      width: 100%;
    }
    .recorder {
      ${styles.button}
      width: 135px;
    }
    .runTxs {
      ${styles.button}
      margin-left: 10px;
      width: 135px;
    }
  `
  var recordButton = yo`<button class=${css.transaction}>save transactions</button>`
  var runButton = yo`<button class=${css.transaction}>run transactions</button>`
  var el = yo`
    <div class=${css2.container}>
     ${recordButton}
     ${runButton}
    </div>
  `
  recordButton.onclick = () => {
    var txJSON = JSON.stringify(recorder.getAll(), null, 2)
    modalDialogCustom.prompt(null, 'save ran transactions to file (e.g. `scenario.json`)', 'scenario.json', input => {
      var newName = appAPI.filesProviders['browser'].type + '/' + helper.createNonClashingName(input, appAPI.filesProviders['browser'], '.json')
      if (!appAPI.filesProviders['browser'].set(newName, txJSON)) {
        modalDialogCustom.alert('Failed to create file ' + newName)
      } else {
        appAPI.switchFile(newName)
      }
    })
  }
  runButton.onclick = () => {
    modalDialogCustom.prompt(null, 'load from file (e.g. `scenarios/transactions1.json`)', '', filepath => {
      var filename = appAPI.filesProviders['browser'].type + '/' + filepath
      var json = appAPI.filesProviders['browser'].get(filename)
      if (!json) return modalDialogCustom.alert('Could not find file with transactions, please try again')
      try {
        var txArray = JSON.parse(json)
      } catch (e) {
        modalDialogCustom.alert('Invalid JSON, please try again')
      }
      if (txArray.length) {
        txArray.forEach(tx => {
          udapp.getAccounts((err, accounts = []) => {
            if (err) console.error(err)
            tx.record = recorder.resolveAddress(tx.record, accounts)
            udapp.rerunTx(tx.record, CALLBACK)
          })
        })
      }
    })
  }
  function CALLBACK (err, result) {
    if (err) console.error(err)
    else {
      // at each callback call, if the transaction succeed and if this is a creation transaction, we should call
      self.addInstance(result)
    }
  }
  return el
}
/* ------------------------------------------------
    section CONTRACT DROPDOWN and BUTTONS
------------------------------------------------ */

function contractDropdown (self, appAPI, appEvents, instanceContainer) {
  instanceContainer.appendChild(noInstancesText)
  var compFails = yo`<i title="Contract compilation failed. Please check the compile tab for more information." class="fa fa-thumbs-down ${css.errorIcon}" ></i>`
  appEvents.compiler.register('compilationFinished', function (success, data, source) {
    getContractNames(success, data)
    if (success) {
      compFails.style.display = 'none'
    } else {
      compFails.style.display = 'block'
    }
  })

  var atAddressButtonInput = yo`<input class="${css.input} ataddressinput" placeholder="Enter contract's address - i.e. 0x60606..." title="atAddress" />`
  var createButtonInput = yo`<input class="${css.input}" placeholder="" title="create" />`
  var selectContractNames = yo`<select class="${css.contractNames}" disabled></select>`
  self._view.atAddressButtonInput = atAddressButtonInput
  self._view.selectContractNames = selectContractNames
  var el = yo`
    <div class="${css.container}">
      <div class="${css.subcontainer}">
        ${selectContractNames} ${compFails}
      </div>
      <div class="${css.buttons}">
        <div class="${css.button}">
          <div class="${css.atAddress}" onclick=${function () { loadFromAddress(appAPI) }}>At Address</div>
          ${atAddressButtonInput}
        </div>
        <div class="${css.button}">
          <div class="${css.create}" onclick=${function () { createInstance() }} >Create</div>
          ${createButtonInput}
        </div>
      </div>
    </div>
  `

  function setInputParamsPlaceHolder () {
    createButtonInput.value = ''
    if (appAPI.getContracts() && selectContractNames.selectedIndex >= 0 && selectContractNames.children.length > 0) {
      var contract = appAPI.getContracts()[selectContractNames.children[selectContractNames.selectedIndex].innerHTML]
      var ctrabi = txHelper.getConstructorInterface(contract.interface)
      if (ctrabi.inputs.length) {
        createButtonInput.setAttribute('placeholder', txHelper.inputParametersDeclarationToString(ctrabi.inputs))
        createButtonInput.removeAttribute('disabled')
        return
      }
    }
    createButtonInput.setAttribute('placeholder', '')
    createButtonInput.setAttribute('disabled', true)
  }

  selectContractNames.addEventListener('change', setInputParamsPlaceHolder)

  // ADD BUTTONS AT ADDRESS AND CREATE
  function createInstance () {
    var contractNames = document.querySelector(`.${css.contractNames.classNames[0]}`)
    var contracts = appAPI.getContracts()
    var contractName = contractNames.children[contractNames.selectedIndex].innerHTML
    var contract = appAPI.getContracts()[contractName]

    if (contract.bytecode.length === 0) {
      modalDialogCustom.alert('This contract does not implement all functions and thus cannot be created.')
      return
    }

    var constructor = txHelper.getConstructorInterface(contract.interface)
    var args = createButtonInput.value
    txFormat.buildData(contract, contracts, true, constructor, args, appAPI.udapp(), (error, data) => {
      if (!error) {
        appAPI.logMessage(`creation of ${contractName} pending...`)
        txExecution.createContract(data, appAPI.udapp(), (error, txResult) => {
          if (!error) {
            var isVM = executionContext.isVM()
            if (isVM) {
              var vmError = txExecution.checkVMError(txResult)
              if (vmError.error) {
                appAPI.logMessage(vmError.message)
                return
              }
            }
            noInstancesText.style.display = 'none'
            var address = isVM ? txResult.result.createdAddress : txResult.result.contractAddress
            instanceContainer.appendChild(appAPI.udapp().renderInstance(contract, address, selectContractNames.value))
          } else {
            appAPI.logMessage(`creation of ${contractName} errored: ` + error)
          }
        })
      } else {
        appAPI.logMessage(`creation of ${contractName} errored: ` + error)
      }
    }, (msg) => {
      appAPI.logMessage(msg)
    })
  }

  function loadFromAddress (appAPI) {
    noInstancesText.style.display = 'none'
    var contractNames = document.querySelector(`.${css.contractNames.classNames[0]}`)
    var contract = appAPI.getContracts()[contractNames.children[contractNames.selectedIndex].innerHTML]
    var address = atAddressButtonInput.value
    instanceContainer.appendChild(appAPI.udapp().renderInstance(contract, address, selectContractNames.value))
  }

  // GET NAMES OF ALL THE CONTRACTS
  function getContractNames (success, data) {
    var contractNames = document.querySelector(`.${css.contractNames.classNames[0]}`)
    contractNames.innerHTML = ''
    if (success) {
      selectContractNames.removeAttribute('disabled')
      for (var name in data.contracts) {
        contractNames.appendChild(yo`<option>${name}</option>`)
      }
    } else {
      selectContractNames.setAttribute('disabled', true)
    }
    setInputParamsPlaceHolder()
  }

  return el
}

/* ------------------------------------------------
    section SETTINGS: Environment, Account, Gas, Value
------------------------------------------------ */
function settings (self, appAPI, appEvents) {
  // COPY ADDRESS
  function copyAddress () {
    copy(document.querySelector('#runTabView #txorigin').value)
  }

  // SETTINGS HTML
  var el = yo`
    <div class="${css.settings}">
      <div class="${css.crow}">
        <div id="selectExEnv" class="${css.col1_1}">
          Environment
        </div>
        <select id="selectExEnvOptions" class="${css.select}">
          <option id="vm-mode"
            title="Execution environment does not connect to any node, everything is local and in memory only."
            value="vm"
            checked name="executionContext">
            JavaScript VM
          </option>
          <option id="injected-mode"
            title="Execution environment has been provided by Mist or similar provider."
            value="injected"
            checked name="executionContext">
            Injected Web3
          </option>
          <option id="web3-mode"
            title="Execution environment connects to node at localhost (or via IPC if available), transactions will be sent to the network and can cause loss of money or worse!
            If this page is served via https and you access your node via http, it might not work. In this case, try cloning the repository and serving it via http."
            value="web3"
            name="executionContext">
            Web3 Provider
          </option>
        </select>
      </div>
      <div class="${css.crow}">
        <div class="${css.col1_1}">Account</div>
        <select name="txorigin" class="${css.select}" id="txorigin"></select>
        <i title="Copy Address" class="copytxorigin fa fa-clipboard ${css.copyaddress}" onclick=${copyAddress} aria-hidden="true"></i>
      </div>
      <div class="${css.crow}">
        <div class="${css.col1_1}">Gas limit</div>
        <input type="number" class="${css.col2}" id="gasLimit" value="3000000">
      </div>
      <div class="${css.crow} hide">
      <div class="${css.col1_1}">Gas Price</div>
        <input type="number" class="${css.col2}" id="gasPrice" value="0">
      </div>
      <div class="${css.crow}">
      <div class="${css.col1_1}">Value</div>
        <input type="text" class="${css.col2}" id="value" value="0" title="(e.g. .7 ether ...)">
      </div>
    </div>
  `

  // EVENTS
  appEvents.udapp.register('transactionExecuted', (error, from, to, data, lookupOnly, txResult) => {
    if (error) return
    if (!lookupOnly) el.querySelector('#value').value = '0'
  })

  return el
}
