var yo = require('yo-yo')
const copy = require('clipboard-copy')

// -------------- styling ----------------------
var csjs = require('csjs-inject')
var styleGuide = require('./style-guide')
var styles = styleGuide()

var css = csjs`
  .runTabView {
    padding: 2%;
  }
  .crow {
    margin-top: 1em;
    display: flex;
  }
  .col1 extends ${styles.titleL} {
    width: 30%;
    float: left;
    align-self: center;
  }
  .col1_1 extends ${styles.titleM} {
    width: 30%;
    min-width: 50px;
    margin-left: 1em;
    float: left;
    align-self: center;
  }
  .col2 extends ${styles.textBoxL}{
    width: 70%;
    height: 32px;
    float: left;
  }
  .select extends ${styles.dropdown} {
    width: 70%;
    float: left;
    text-align: center;
    height: 32px;
  }
  .copyaddress {
    color: #C6CFF7;
    margin-right: 0.5em;
    margin-top: 0.7em;
    cursor: pointer;
  }
  .copyaddress:hover {
    opacity: .7;
  }
  .selectAddress extends ${styles.dropdown} {
    width: 81%;
    float: left;
    text-align: center;
    height: 32px;
  }
  .contractNamesDropdown extends ${styles.dropdown} {
    width: 100%;
    height: 32px;
    text-align: center;
  }
  .buttons {
    display: flex;
    cursor: pointer;
    justify-content: center;
  }
  .atAddress extends ${styles.button} {
    margin: 1%;
    width: 35%;
    background-color: ${styles.colors.green};
  }
  .create extends ${styles.button} {
    margin: 1%;
    width: 35%;
    background-color: ${styles.colors.lightRed};
  }
`

module.exports = runTab

function runTab (container, appAPI, appEvents, opts) {
  appEvents.compiler.register('compilationFinished', function (success, DATA, source) {
    getContractNames(success, DATA)
  })
  var el = yo`
  <div class="${css.runTabView}" id="runTabView">
    ${settings(appAPI, appEvents)}
    ${legend()}
    <select class="${css.contractNames} ${css.contractNamesDropdown}"></select>
    <div class="${css.buttons}">
      <div class="${css.atAddress}" onclick=${loadFromAddress(appAPI)}>At Address</div>
      <div class="${css.create}" onclick=${createInstance(appAPI)}>Create</div>
    </div>
  </div>
  `
  container.appendChild(el)
}

/* ------------------------------------------------
    section CONTRACT DROPDOWN and BUTTONS
------------------------------------------------ */

// ADD BUTTONS AT ADDRESS AND CREATE
function createInstance (appAPI) {
  // var contractNames = document.querySelector(`.${css.contractNames}`)
  // var contract = appAPI.getContracts()[contractNames.children[contractNames.selected].innerText]
  // appAPI.createContract(contract, function () { console.log(contract) })
}
function loadFromAddress (appAPI) {
  // var contractNames = document.querySelector(`.${css.contractNames}`)
  // var contract = appAPI.getContracts()[contractNames.children[contractNames.selected].innerText]
  // appAPI.loadContract(contract, function () { console.log(contract) })
}

// GET NAMES OF ALL THE CONTRACTS
function getContractNames (success, data) {
  var contractNames = document.querySelector(`.${css.contractNames}`)
  contractNames.innerHTML = ''
  if (success) {
    for (var name in data.contracts) {
      contractNames.appendChild(yo`<option>${name}</option>`)
    }
  } else {
    contractNames.appendChild(yo`<option></option>`)
  }
}

/* ------------------------------------------------
    section SETTINGS: Environment, Account, Gas, Value
------------------------------------------------ */
function settings (appAPI, appEvents) {
  // COPY ADDRESS
  function copyAddress () {
    copy(document.querySelector('#runTabView #txorigin').value)
  }

  // SETTINGS HTML
  var el = yo`
    <div>
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
        <i title="Copy Address" class="copytxorigin fa fa-clipboard ${css.copyaddress}" onclick=${copyAddress} aria-hidden="true"></i>
        <select name="txorigin" class="${css.selectAddress}" id="txorigin"></select>
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
  appEvents.udapp.register('transactionExecuted', (to, data, lookupOnly, txResult) => {
    if (!lookupOnly) el.querySelector('#value').value = '0'
  })

  // DROPDOWN
  var selectExEnv = el.querySelector('#selectExEnvOptions')
  selectExEnv.addEventListener('change', function (event) {
    if (!appAPI.executionContextChange(selectExEnv.options[selectExEnv.selectedIndex].value)) {
      selectExEnv.value = appAPI.executionContextProvider()
    }
  })
  selectExEnv.value = appAPI.executionContextProvider()

  return el
}

/* ------------------------------------------------
              section  LEGEND
------------------------------------------------ */
function legend () {
  var css = csjs`
    .legend {
      margin-top: 3%;
      background-color: white;
      line-height: 20px;
      border: .2em dotted ${styles.colors.lightGrey};
      padding: 8px 15px;
      border-radius: 5px;
      margin-bottom: 1em;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
    }
    .item {
      margin-right: 1em;
      display: flex;
      align-items: center;
    }
    .transact {
      color: #FFB9B9;
      margin-right: .3em;
    }
    .payable {
      color: #FF8B8B;
      margin-right: .3em;
    }
    .call {
      color: #9DC1F5;
      margin-right: .3em;
    }
  `
  var el =
  yo`
    <div class="${css.legend}">
      <div class="${css.item}"><i class="fa fa-circle ${css.transact}" aria-hidden="true"></i>Transact</div/>
      <div class="${css.item}"><i class="fa fa-circle ${css.payable}" aria-hidden="true"></i>Transact(Payable)</div/>
      <div class="${css.item}"><i class="fa fa-circle ${css.call}" aria-hidden="true"></i>Call</div/>
    </div>
  `
  return el
}
