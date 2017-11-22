'use strict'
var contractHelper = require('../helpers/contracts')
var init = require('../helpers/init')
var sauce = require('./sauce')
var dom = require('../helpers/dom')

<<<<<<< HEAD
var sources = {
  'browser/Untitled.sol': { content: `
=======
var sources = [
  {
    'browser/Untitled.sol': {content: `
>>>>>>> 57a496aa1f3a3f66c485f84651dbac671d0f6225
contract test1 { address test = tx.origin; }
contract test2 {}
contract TooMuchGas {
  uint x;
<<<<<<< HEAD
  function() { x++; }
}`}
}
=======
  function() { 
      x++;
    uint test;
    uint test1;
  }
}`}}
]
>>>>>>> 57a496aa1f3a3f66c485f84651dbac671d0f6225

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
<<<<<<< HEAD
  contractHelper.testContracts(browser, sources['browser/Untitled.sol'], ['TooMuchGas', 'test1', 'test2'], function () {
=======
  contractHelper.testContracts(browser, 'Untitled.sol', sources[0]['browser/Untitled.sol'], ['TooMuchGas', 'test1', 'test2'], function () {
>>>>>>> 57a496aa1f3a3f66c485f84651dbac671d0f6225
    browser
      .click('.staticanalysisView')
      .click('#staticanalysisView button')
      .waitForElementPresent('#staticanalysisresult .warning', 2000, true, function () {
<<<<<<< HEAD
        dom.listSelectorContains(['browser/Untitled.sol:2:33: Use of tx.origin',
          'Fallback function of contract TooMuchGas requires too much gas'],
          '#staticanalysisresult .warning span',
=======
        dom.listSelectorContains(['browser/Untitled.sol:2:33:Use of tx.origin',
          'Fallback function of contract TooMuchGas requires too much gas',
          'TooMuchGas.(): Variables have very similar names test and test1.'],
          '#staticanalysisresult .warning',
>>>>>>> 57a496aa1f3a3f66c485f84651dbac671d0f6225
          browser, function () {
            browser.end()
          }
        )
      })
  })
}
