var yo = require('yo-yo')
var csjs = require('csjs-inject')
var $ = require('jquery')
var armlet = require('armlet')

var globalRegistry = require('../../global/registry')
var tooltip = require('../ui/tooltip')
var styleGuide = require('../ui/styles-guide/theme-chooser')
var styles = styleGuide.chooser()

var TRIAL_CREDS = {
  address: '0x0000000000000000000000000000000000000000',
  pwd: 'trial'
}

module.exports = class SettingsTab {
  constructor (localRegistry) {
    const self = this
    self._components = {}
    self._components.registry = localRegistry || globalRegistry
    // dependencies
    self._deps = {
      config: self._components.registry.get('config').api,
      pluginManager: self._components.registry.get('pluginmanager').api
    }
    self._view = { /* eslint-disable */
      el: null,
      config: {
        mythx: null
      }
    }
    self.target = null
    self.contracts = {}
    self.result = null
    self.error = null
    self.isLoading = false
    self.renderActionBar = self.renderActionBar.bind(self)
    self.sendRequest = self.sendRequest.bind(self)

    self._deps.pluginManager.event.register('sendCompilationResult', (_, source, __, data) => {
      self.target = source.target
      self.contracts = data.contracts

      self.renderActionBar()
    })
  }
  getContracts() {
    if (!this.target || !this.contracts[this.target]) return []

    var file = this.contracts[this.target]
    return Object.keys(file).map(x => x);
  }
  sendRequest() {
    var contract = $('#mythx-contract-selector option:selected').text()
    const client = new armlet.Client(
      {
        ethAddress: this._deps.config.get('security/mythx-address') || TRIAL_CREDS.address,
        password: this._deps.config.get('security/mythx-pwd') || TRIAL_CREDS.pwd,
      })
    const data = {
      "bytecode": this.contracts[this.target][contract].evm.bytecode.object,
    };

    // set loading
    this.isLoading = true
    this.renderActionBar()

    client.analyzeWithStatus(
      {
        "data": data,
        "clientToolName": "remythx"
      })
      .then(result => {
        this.renderResult(result, null);
      }).catch(err => {
        this.renderResult(null, err);
      })
  }
  renderResult(data, error) {
    // re-render actionbar
    this.isLoading = false
    this.renderActionBar()

    // render error block
    this.error = error
    this.renderError()

    // render report block
    this.result = data
    this.renderReport()
  }
  renderActionBar() {
    var contracts = this.getContracts()
    if (!contracts || !contracts.length) {
      return "You need to compile your contract first!"
    }

    var analyzebtn = yo`<input onclick=${() => { this.sendRequest() }} value="Analyze" type="button">`
    if (this.isLoading) {
      analyzebtn.setAttribute('disabled', true)
    }
    var html = yo`
      <div>
        <div>
          <select id="mythx-contract-selector">${contracts.map(x => yo`<option>${x}</option>`)}</select>
        </div>
        ${analyzebtn}
      </div>`

    $('#mythx-action-bar').html(html)
  }
  renderError() {
    var html = ''
    if (this.error && this.error.length) {
      var html = yo`
        <div class="${css.block} ${css.mt1} ${css.error}">
          ${this.error}
        </div`
    }
    $('#mythx-error').html(html)
  }
  renderReport() {
    if (!this.result) {
      $('#mythx-report').html('')
      return
    }

    var contract = $('#mythx-contract-selector option:selected').text()
    var issues = this.result.issues.map(x => {
      return x.issues.map(y => {
        return yo`
          <tr>
            <td class="${css.report_issue_severity}">${y.severity}</td>
            <td class="${css.report_issue_content}">
              <div class="${css.report_issue_head}">${y.description.head}</div>
              <div>${y.description.tail}</div>
            </td>
          </tr>`
      })
    })
    var html = yo`
      <div class="${css.block} ${css.mt1}">
        <div>
          <b>${contract}</b>
          <span class=${css.report_elapsed}>${this.result.elapsed} ms</span>
        </div>
        <table class=${css.report_table}>
          <tr>
            <th class="${css.report_header}">Severity</th>
            <th class="${css.report_header}">Issue</th>
          </tr>
          ${issues}
        </table>
      </div`
    $('#mythx-report').html(html)
  }
  render() {
    const self = this
    if (self._view.el) return self._view.el

    var mythxAddress = yo`<input id="mythxaddress" type="text" class=${css.input}>`
    mythxAddress.value = TRIAL_CREDS.address
    var address = self._deps.config.get('security/mythx-address')
    if (address) mythxAddress.value = address

    var mythxPwd = yo`<input id="mythxpwd" type="password" class=${css.input}>`
    mythxPwd.value = TRIAL_CREDS.pwd
    var pwd = self._deps.config.get('security/mythx-pwd')
    if (pwd) mythxPwd.value = pwd

    var saveMythxCreds = yo`<input id="savemythxcreds" onclick=${() => {
      self._deps.config.set('security/mythx-address', mythxAddress.value);
      self._deps.config.set('security/mythx-pwd', mythxPwd.value);
      tooltip('MythX credentials saved')
    }} value="Save" type="button">`

    self._view.config.mythx = yo`
      <div class="${css.info}">
        <div class=${css.title}>MythX</div>
        <div class=${css.block}>
          <div>
            <label for="mythxaddress" class=${css.label}>Address</label>
            ${mythxAddress}
          </div>
          <div class=${css.pt1}>
            <label for="mythxPwd" class=${css.label}>Password</label>
            ${mythxPwd}
          </div>
          <div class=${css.pt1}>${saveMythxCreds}</div>
        </div>
        <div id="mythx-action-bar" class="${css.block} ${css.mt1}">
          ${self.renderActionBar()}
        </div>
        <div id="mythx-error">
          ${self.renderError()}
        </div>
        <div id="mythx-report">
          ${self.renderReport()}
        </div>
      </div>
      `
    self._view.el = yo`
      <div class="${css.securityTabView}" id="securityView">
        ${self._view.config.mythx}
      </div>`
    return self._view.el
  }
}

const css = csjs`
  .securityTabView {
    padding: 2%;
    display: flex;
  }
  .pt1 {
    padding-top: 4px;
  }
  .mt1 {
    margin-top: 4px;
  }
  .info {
    ${styles.rightPanel.runTab.box_Instance};
    margin-bottom: 1em;
    word-break: break-word;
  }
  .block {
    border: 1px solid #efefef;
    padding: 8px;
  }
  .title {
    font-size: 1.1em;
    font-weight: bold;
    margin-bottom: 1em;
  }
  .label {
    display: inline-block;
    width: 60px;
  }
  .input {
    display: inline-block;
    width: 350px;
  }
  .error {
    color: ${styles.appProperties.errorText_Color};
  }
  .report_table {
    border: 1px dashed #efefef;
    border-collapse: collapse;
  }
  .report_header {
    background: #efefef;
    text-align: left;
  }
  .report_elapsed {
    float: right;
  }
  .report_issue_content {

  }
  .report_issue_severity {
    width: 60px;
  }
  .report_issue_head {
    font-weight: bold;
  }
`