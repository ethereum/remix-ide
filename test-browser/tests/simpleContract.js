'use strict'
var contractHelper = require('../helpers/contracts')
var init = require('../helpers/init')
var sauce = require('./sauce')

var sources = {
  'browser/Untitled.sol': { content: 'contract test1 {} contract test2 {}' }
}

module.exports = {
  before: function (browser, done) {
    init(browser, done)
  },
  '@sources': function () {
    return sources
  },
  'Simple Contract': function (browser) {
    runTests(browser)
  },
  tearDown: sauce
}

function runTests (browser) {
  browser
    .waitForElementVisible('.newFile', 10000)
    .click('.compileView')
  contractHelper.testContracts(browser, sources['browser/Untitled.sol'], ['test1', 'test2'], function () {
    browser.end()
  })
}
