var yo = require('yo-yo')
var csjs = require('csjs-inject')
var helper = require('./lib/helper')
var copyToClipboard = require('./app/ui/copy-to-clipboard')
var styles = require('remix-lib').ui.themeChooser.chooser()

module.exports = UniversalDAppUI

function UniversalDAppUI (udapp, opts = {}) {
  this.udapp = udapp
  this.el = yo`<div class=${css.udapp}></div>`
}
UniversalDAppUI.prototype.reset = function () {
  this.el.innerHTML = ''
}
UniversalDAppUI.prototype.renderInstance = function (contract, address, contractName) {
  var abi = this.udapp.getABI(contract)
  return this.renderInstanceFromABI(abi, address, contractName)
}
UniversalDAppUI.prototype.renderInstanceFromABI = function (contractABI, address, contractName) {
  address = (address.slice(0, 2) === '0x' ? '' : '0x') + address.toString('hex')
  var shortAddress = helper.shortenAddress(address)
  var context = this.udapp.context()

  if (this.udapp.removable_instances) {
    var close = yo`
      <div class="${css.udappClose}" onclick=${remove}>
        <i class="${css.closeIcon} fa fa-close" aria-hidden="true"></i>
      </div>`
    function remove () { instance.remove() } // eslint-disable-line
  }
  var title = yo`
    <div class="${css.title}" onclick=${toggleClass}>
      <div class="${css.titleText}"> ${contractName} at ${shortAddress} (${context}) </div>
      ${copyToClipboard(() => address)}
    </div>`
  function toggleClass () { instance.classList.toggle(`${css.hidesub}`) }
  var fallback = this.udapp.getFallbackInterface(contractABI)
  if (fallback) {
    var opts = { funABI: fallback, address, contractAbi: contractABI, contractName }
    var fallbackEL = this.getCallButton(opts)
  }
  var functions = contractABI
    .filter(funABI => funABI.type === 'function')
    .map(funABI => this.getCallButton({
      funABI: funABI,
      address: address,
      contractAbi: contractABI,
      contractName: contractName
    }))
  var instance = yo`
    <div class="instance ${css.instance}" id="instance${address}">
      ${close || ''}
      ${title}
      ${fallbackEL || ''}
      ${functions}
    </div>`
  return instance
}
UniversalDAppUI.prototype.getCallButton = function (args) {
  var self = this
  var lookupOnly = args.funABI.constant
  var title = args.funABI.name || '(fallback)'

  var buttonTitle = title
  if (lookupOnly) buttonTitle = `${title} - call`
  if (args.funABI.payable) buttonTitle = `${title} - transact (payable)`
  if (!lookupOnly && !args.funABI.payable) buttonTitle = `${title} - transact (not payable)`

  var inputs = self.udapp.getInputs(args.funABI)
  if (inputs.length) var inputField = yo`<input placeholder="${inputs}" title="${inputs}"></input>`
  if (lookupOnly) var outputOverride = yo`<div class=${css.value}></div>`
  var button = yo`
    <button onclick=${clickButton} class="${css.instanceButton} ${css.call}" title="${buttonTitle}">
      ${title}
    </button>`
  function clickButton () {
    self.udapp.call(true, args, ((inputField || {}).value || []), lookupOnly, (decoded) => {
      outputOverride.innerHTML = ''
      outputOverride.appendChild(decoded)
    })
  }

  var contractClasses = `${css.contractProperty} ${css.buttonsContainer}`
  if (args.funABI.inputs && args.funABI.inputs.length > 0) contractClasses += ` ${css.hasArgs}`
  if (lookupOnly) contractClasses += ` ${css.constant}`
  if (args.funABI.payable) contractClasses += ` ${css.payable}`
  var contractProperty = yo`
    <div class="${contractClasses}">
      <div class="${css.contractActions}">
        ${button}
        ${inputField || ''}
      </div>
      ${outputOverride || ''}
    </div>`

  return contractProperty
}

var css = csjs`
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

  .buttonsContainer {
    margin-top: 2%;
    display: flex;
    overflow: hidden;
  }
  .contractActions {
    display: flex;
  }
  .instanceButton {
    margin: none;
  }
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
    margin-bottom: 0.4em;
  }
  .contractProperty.hasArgs input {
    width: 75%;
    padding: .36em;
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
