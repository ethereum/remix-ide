const EventEmitter = require('events')

class VerifyContracts extends EventEmitter {
  command (compiledContractNames, opts = { wait: 1000, version: null }) {
    this.api.perform((done) => {
      verifyContracts(this.api, compiledContractNames, opts, () => {
        done()
        this.emit('complete')
      })
    })
    return this
  }
}

function getCompiledContracts (browser, opts, callback) {
  browser
  .clickLaunchIcon('solidity')
  .pause(opts.wait)
  .waitForElementPresent('*[data-id="compiledContracts"] option')
  .perform((done) => {
    if (opts.version) {
      browser
      .click('*[data-id="compilation-details"]')
      .waitForElementVisible('*[data-id="treeViewDivcompiler"]')
      .pause(2000)
      .click('*[data-id="treeViewDivcompiler"]')
      .waitForElementVisible('*[data-id="treeViewLicompiler/version"]')
      .assert.containsText('*[data-id="treeViewLicompiler/version"]', `version:\n${opts.version}`)
      .perform(done)
    } else done()
  })
  .execute(function () {
    var contracts = document.querySelectorAll('*[data-id="compiledContracts"] option')
    if (!contracts) {
      return null
    } else {
      var ret = []
      for (var c = 0; c < contracts.length; c++) {
        ret.push(contracts[c].value)
      }
      return ret
    }
  }, [], function (result) {
    callback(result)
  })
}

function verifyContracts (browser, compiledContractNames, opts, callback) {
  getCompiledContracts(browser, opts, (result) => {
    if (result.value) {
      for (var contract in compiledContractNames) {
        console.log(' - ' + compiledContractNames[contract], result.value)
        if (result.value.indexOf(compiledContractNames[contract]) === -1) {
          browser.assert.fail('compiled contract ' + compiledContractNames + ' not found', 'info about error', '')
          browser.end()
          return
        }
      }
    } else {
      browser.assert.fail('compiled contract ' + compiledContractNames + ' not found - none found', 'info about error', '')
      browser.end()
    }
    console.log('contracts all found ' + compiledContractNames)
    callback()
  })
}

module.exports = VerifyContracts
