'use strict'
var contractHelper = require('../helpers/contracts')
var init = require('../helpers/init')
var sauce = require('./sauce')
var dom = require('../helpers/dom')

var sources = {
  'browser/Untitled.sol': { content: `
contract test1 { address test = tx.origin; }
contract test2 {}
contract TooMuchGas {
  uint x;
  function() { x++; }
}`}
}

module.exports = {
  before: function (browser, done) {
    init(browser, done)
  },
  '@sources': function () {
    return sources
  },
  'Static Analysis': function (browser) {
    runTests(browser)
  },
  tearDown: sauce
}

function runTests (browser) {
  browser
    .waitForElementVisible('.newFile', 10000)
    .click('.compileView')
  contractHelper.testContracts(browser, sources['browser/Untitled.sol'], ['TooMuchGas', 'test1', 'test2'], function () {
    browser
      .click('.staticanalysisView')
      .click('#staticanalysisView button')
      .waitForElementPresent('#staticanalysisresult .warning', 2000, true, function () {
        dom.listSelectorContains(['browser/Untitled.sol:2:33: Use of tx.origin',
          'Fallback function of contract TooMuchGas requires too much gas'],
          '#staticanalysisresult .warning span',
          browser, function () {
            browser.end()
          }
        )
      })
  })
}
