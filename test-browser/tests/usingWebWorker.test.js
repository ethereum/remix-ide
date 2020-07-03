'use strict'
var init = require('../helpers/init')
var sauce = require('./sauce')

var sources = [
  {'browser/basic.sol': { content:
    `pragma solidity >=0.2.0 <0.7.0;

    /**
     * @title Basic contract
     */
    contract Basic {
        uint someVar;
        constructor() public {}
    }`
  }}
]

module.exports = {
  before: function (browser, done) {
    init(browser, done)
  },
  '@sources': function () {
    return sources
  },
  'Using Web Worker': function (browser) {
    browser
    .waitForElementVisible('*[data-id="remixIdeIconPanel"]', 10000)
    .clickLaunchIcon('fileExplorers')
    .addFile('browser/basic.sol', sources[0]['browser/basic.sol'])
    .clickLaunchIcon('solidity')
    .execute(() => {
      document.getElementById('nightlies').checked = true
    })
    .noWorkerErrorFor('soljson-v0.3.4+commit.7dab8902.js')
    .noWorkerErrorFor('soljson-v0.6.5+commit.f956cc89.js')
    .noWorkerErrorFor('soljson-v0.6.8-nightly.2020.5.14+commit.a6d0067b.js')
    .noWorkerErrorFor('soljson-v0.6.0-nightly.2019.12.17+commit.d13438ee.js')
    .noWorkerErrorFor('soljson-v0.4.26+commit.4563c3fc.js')
    .execute(() => {
      document.getElementById('nightlies').checked = false
    })
    .end()
  },

  tearDown: sauce
}
