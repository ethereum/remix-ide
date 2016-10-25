'use strict'

var testData = require('../mockcompiler/requests')
var contractHelper = require('../helpers/contracts')

module.exports = {
  'Ballot': function (browser) {
    runTests(browser, testData)
  }
}

function runTests (browser, testData) {
  browser
    .url('http://127.0.0.1:8080/#version=builtin')
    .waitForElementVisible('.newFile', 10000)
  browser.assert.notEqual(testData, null)
  contractHelper.testContracts(browser, testData.ballot.sources.Untitled.replace(/(\n)/g, ' '), ['Ballot'], function () { // removing \n to get rid of autoclose bracket
    browser.end()
  })
}
