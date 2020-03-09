var yo = require('yo-yo')
var async = require('async')
var tooltip = require('../ui/tooltip')
var css = require('./styles/test-tab-styles')
var remixTests = require('remix-tests')
import { ViewPlugin } from '@remixproject/engine'
import { canUseWorker } from '../compiler/compiler-utils'

const TestTabLogic = require('./testTab/testTab')

const profile = {
  name: 'solidityUnitTesting',
  displayName: 'Solidity unit testing',
  methods: ['testFromPath', 'testFromSource'],
  events: [],
  icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH4wUDEhQZ0zbrmQAAAfNJREFUWMPF17lrFVEUx/EPaIKovfAScSndjUtULFQSYhHF0r/Dwsa/RywUiTaWgvaChWsiKkSMZte4o7G5A49x7r0zLy/PA6eZOef3PXebuYfu2xCmcQ9b9NgOYw6rwR9ia6/gR7HQBi/8PjavN/w4FivghV9bT/gwlhLwHzjTVPQ8rqAvE3ciA/+O8abwy/gVBG4lijiJ5czIL64FXvhNbCzFnaoBv9AUPo7fEcEb2BDiTuNTAv4NYxX6u/EIM7GZuZoQXcX1sJk+J2K+YrRCexfetsX9xKVyUB9uZ4r4k3j3BSMR+JvIMv2zQfsxkSkiBj9XAd8ZgRf+vmop+nGnAXwlcs534HUm93FsQ9YtIjby7XiVyZ3BntSpyBWxgrMR+FQG/gF76xzNftxtMO1rgo+G5AdBqLBN4d9eCCyHD1En8Oi0j4UPSBE4hcFSERN4Fz7BZRvEZKcjHynBC5/EQI1lGqgJ3xcTmE4kvswUMRBiUvCPKTg8zQi8QKsirxXe5eD7c1N4ALMZoeelIlrhWSpnNmjXsoM1iihmYhueZGIXcKTp7/hQ6UZb5c+Cp2LmglZHVqeIlC+G2/GarNMiFnGsWzfdpkV0Fd7e5czXgC+FvmDdWq35/wVvbzbnI/DhXvV9Q6W+r6fw9hZsKnjX4H8B0Aamri7CrBsAAAAASUVORK5CYII=',
  description: 'Fast tool to generate unit tests for your contracts',
  location: 'sidePanel',
  documentation: 'https://remix-ide.readthedocs.io/en/latest/unittesting.html'
}

module.exports = class TestTab extends ViewPlugin {
  constructor (fileManager, filePanel, compileTab, appManager, renderer) {
    super(profile)
    this.compileTab = compileTab
    this._view = { el: null }
    this.fileManager = fileManager
    this.filePanel = filePanel
    this.data = {}
    this.appManager = appManager
    this.renderer = renderer
    this.baseurl = 'https://solc-bin.ethereum.org/bin'
    appManager.event.on('activate', (name) => {
      if (name === 'solidity') this.updateRunAction(fileManager.currentFile())
    })
    appManager.event.on('deactivate', (name) => {
      if (name === 'solidity') this.updateRunAction(fileManager.currentFile())
    })
  }

  onActivationInternal () {
    this.testTabLogic = new TestTabLogic(this.fileManager)
    this.listenToEvents()
  }

  listenToEvents () {
    this.filePanel.event.register('newTestFileCreated', file => {
      var testList = this.view.querySelector("[class^='testList']")
      var test = yo`<label class="singleTestLabel"><input class="singleTest" onchange=${(e) => this.toggleCheckbox(e.target.checked, file)} type="checkbox" checked="true">${file}</label>`
      testList.appendChild(test)
      this.data.allTests.push(file)
      this.data.selectedTests.push(file)
    })

    this.fileManager.events.on('noFileSelected', () => {
      this.updateGenerateFileAction()
      this.updateRunAction()
      this.updateTestFileList()
    })

    this.fileManager.events.on('currentFileChanged', (file, provider) => {
      this.updateGenerateFileAction(file)
      this.updateRunAction(file)
      this.testTabLogic.getTests((error, tests) => {
        if (error) return tooltip(error)
        this.data.allTests = tests
        this.data.selectedTests = [...this.data.allTests]
        this.updateTestFileList(tests)
        if (!this.testsOutput || !this.testsSummary) return
      })
    })
  }

  listTests () {
    return this.data.allTests.map(test => yo`<label class="singleTestLabel"><input class="singleTest" onchange =${(e) => this.toggleCheckbox(e.target.checked, test)} type="checkbox" checked="true">${test} </label>`)
  }

  toggleCheckbox (eChecked, test) {
    if (!this.data.selectedTests) {
      this.data.selectedTests = this._view.el.querySelectorAll('.singleTest:checked')
    }
    let selectedTests = this.data.selectedTests
    selectedTests = eChecked ? [...selectedTests, test] : selectedTests.filter(el => el !== test)
    this.data.selectedTests = selectedTests
    let checkAll = this._view.el.querySelector('[id="checkAllTests"]')
    if (eChecked) {
      checkAll.checked = true
    } else if (!selectedTests.length) {
      checkAll.checked = false
    }
  }

  checkAll (event) {
    let checkBoxes = this._view.el.querySelectorAll('.singleTest')
    const checkboxesLabels = this._view.el.querySelectorAll('.singleTestLabel')
    // checks/unchecks all
    for (let i = 0; i < checkBoxes.length; i++) {
      checkBoxes[i].checked = event.target.checked
      this.toggleCheckbox(event.target.checked, checkboxesLabels[i].innerText)
    }
  }

  testCallback (result) {
    this.testsOutput.hidden = false
    if (result.type === 'contract') {
      this.testsOutput.appendChild(yo`<div class=${css.outputTitle}>${result.filename} (${result.value})</div>`)
    } else if (result.type === 'testPass') {
      this.testsOutput.appendChild(yo`<div class="${css.testPass} ${css.testLog} alert-success">✓ (${result.value})</div>`)
    } else if (result.type === 'testFailure') {
      this.testsOutput.appendChild(yo`<div class="${css.testFailure} ${css.testLog} alert-danger">✘ (${result.value})</div>`)
    }
  }

  resultsCallback (_err, result, cb) {
    // total stats for the test
    // result.passingNum
    // result.failureNum
    // result.timePassed
    cb()
  }

  updateFinalResult (_errors, result, filename) {
    this.testsSummary.hidden = false
    if (_errors) {
      _errors.forEach((err) => this.renderer.error(err.formattedMessage || err.message, this.testsSummary, {type: err.severity}))
      return
    }
    this.testsSummary.appendChild(yo`<div class=${css.summaryTitle}> ${filename} </div>`)
    if (result.totalPassing > 0) {
      this.testsSummary.appendChild(yo`<div class="text-success" >${result.totalPassing} passing (${result.totalTime}s)</div>`)
      this.testsSummary.appendChild(yo`<br>`)
    }
    if (result.totalFailing > 0) {
      this.testsSummary.appendChild(yo`<div class="text-danger" >${result.totalFailing} failing</div>`)
      this.testsSummary.appendChild(yo`<br>`)
    }
    result.errors.forEach((error, index) => {
      this.testsSummary.appendChild(yo`<div class="text-danger" >${error.context} - ${error.value} </div>`)
      this.testsSummary.appendChild(yo`<div class="${css.testFailureSummary} text-danger" >${error.message}</div>`)
      this.testsSummary.appendChild(yo`<br>`)
    })
  }

  async testFromPath (path) {
    const fileContent = await this.fileManager.getFile(path)
    return this.testFromSource(fileContent, path)
  }

  /*
    Test are not associated with the UI
  */
  testFromSource (content, path = 'browser/unit_test.sol') {
    return new Promise((resolve, reject) => {
      let runningTest = {}
      runningTest[path] = { content }
      const {currentVersion, evmVersion, optimize} = this.compileTab.getCurrentCompilerConfig()
      const currentCompilerUrl = this.baseurl + '/' + currentVersion
      const compilerConfig = {
        currentCompilerUrl,
        evmVersion,
        optimize,
        usingWorker: canUseWorker(currentVersion)
      }
      remixTests.runTestSources(runningTest, compilerConfig, () => {}, () => {}, (error, result) => {
        if (error) return reject(error)
        resolve(result)
      }, (url, cb) => {
        return this.compileTab.compileTabLogic.importFileCb(url, cb)
      })
    })
  }

  runTest (testFilePath, callback) {
    this.loading.hidden = false
    this.fileManager.getFile(testFilePath).then((content) => {
      const runningTest = {}
      runningTest[testFilePath] = { content }
      const {currentVersion, evmVersion, optimize} = this.compileTab.getCurrentCompilerConfig()
      const currentCompilerUrl = this.baseurl + '/' + currentVersion
      const compilerConfig = {
        currentCompilerUrl,
        evmVersion,
        optimize,
        usingWorker: canUseWorker(currentVersion)
      }
      remixTests.runTestSources(
        runningTest,
        compilerConfig,
        (result) => this.testCallback(result),
        (_err, result, cb) => this.resultsCallback(_err, result, cb),
        (error, result) => {
          this.updateFinalResult(error, result, testFilePath)
          this.loading.hidden = true
          callback(error)
        }, (url, cb) => {
          return this.compileTab.compileTabLogic.importFileCb(url, cb)
        }
      )
    }).catch((error) => {
      if (error) return
    })
  }

  runTests () {
    this.call('editor', 'clearAnnotations')
    this.testsOutput.innerHTML = ''
    this.testsSummary.innerHTML = ''
    var tests = this.data.selectedTests
    if (!tests) return
    this.loading.hidden = tests.length === 0
    async.eachOfSeries(tests, (value, key, callback) => { this.runTest(value, callback) })
  }

  updateGenerateFileAction (currentFile) {
    let el = yo`<button class="${css.generateTestFile} btn btn-primary" onclick="${this.testTabLogic.generateTestFile.bind(this.testTabLogic)}">Generate test file</button>`
    if (!currentFile) {
      el.setAttribute('disabled', 'disabled')
      el.setAttribute('title', 'No file selected')
    }
    if (!this.generateFileActionElement) {
      this.generateFileActionElement = el
    } else {
      yo.update(this.generateFileActionElement, el)
    }
    return this.generateFileActionElement
  }

  updateRunAction (currentFile) {
    let el = yo`<button id="runTestsTabRunAction" class="${css.runButton} btn btn-primary"  onclick="${this.runTests.bind(this)}">Run Tests</button>`
    const isSolidityActive = this.appManager.actives.includes('solidity')
    if (!currentFile || !isSolidityActive) {
      el.setAttribute('disabled', 'disabled')
      if (!currentFile) el.setAttribute('title', 'No file selected')
      if (!isSolidityActive) el.setAttribute('title', 'The solidity module should be activated')
    }

    if (!this.runActionElement) {
      this.runActionElement = el
    } else {
      yo.update(this.runActionElement, el)
    }
    return this.runActionElement
  }

  updateTestFileList (tests) {
    const testsMessage = (tests && tests.length ? this.listTests() : 'No test file available')
    let el = yo`<div class=${css.testList}>${testsMessage}</div>`
    if (!this.testFilesListElement) {
      this.testFilesListElement = el
    } else {
      yo.update(this.testFilesListElement, el)
    }
    return this.testFilesListElement
  }
  render () {
    this.onActivationInternal()
    this.testsOutput = yo`<div class="${css.container} m-3 border border-primary border-right-0 border-left-0 border-bottom-0"  hidden='true' id="solidityUnittestsOutput"></div>`
    this.testsSummary = yo`<div class="${css.container} border border-primary border-right-0 border-left-0 border-bottom-0" hidden='true' id="solidityUnittestsSummary"></div>`
    this.loading = yo`<span class='text-info ml-1'>Running tests...</span>`
    this.loading.hidden = true
    var el = yo`
      <div class="${css.testTabView} card" id="testView">
        <div class="${css.infoBox}">
          Test your smart contract in Solidity.<br/><br/>
          <ol>
            <li> To get started, click on "Generate test file" button</li>
            <li> To write tests, visit our <a href="https://remix-ide.readthedocs.io/en/latest/unittesting.html#write-tests" target="_blank"> documentation </a></li>
            <li> To run tests, select file(s) and click on "Run Tests" button</li>
          </ol>
          To run unit tests in your Continuous Integration and as CLI, use the stand alone NPM module <a href="https://www.npmjs.com/package/remix-tests" target="_blank">remix-tests</a>.
          <p>To get support, join our  <a href="https://gitter.im/ethereum/remix" target="_blank">Gitter</a> channel. </p>
          ${this.updateGenerateFileAction()}
        </div>
        <div class="${css.tests}">          
          <div class="${css.buttons}">
          ${this.updateRunAction()}
            <label class="${css.label} mx-4 m-2" for="checkAllTests">
              <input id="checkAllTests"
                type="checkbox"
                onclick="${(event) => { this.checkAll(event) }}"
                checked="true"
              >
              Check/Uncheck all
            </label>
          </div>
          ${this.updateTestFileList()}
          <hr>
          <div class="${css.buttons}" ><h6>Results:${this.loading}</h6></div>
          ${this.testsOutput}
          ${this.testsSummary}
        </div>
      </div>
    `
    if (!this._view.el) this._view.el = el
    return el
  }

}
