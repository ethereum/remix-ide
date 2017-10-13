'use strict'
var contractHelper = require('../helpers/contracts')
var init = require('../helpers/init')
var sauce = require('./sauce')

module.exports = {
  before: function (browser, done) {
    init(browser, done)
  },
  '@sources': function () {
    return sources
  },
  'Compiling': function (browser) {
    runTests(browser)
  },
  tearDown: sauce
}

function runTests (browser) {
  browser.testFunction = testFunction
  browser
    .waitForElementVisible('.newFile', 10000)
    .click('.compileView')
  contractHelper.testContracts(browser, sources['browser/Untitled.sol'], ['TestContract'], function () {
    browser.click('.runView')
    .click('#runTabView div[class^="create"]')
    .testFunction('f - transact (not payable)',
                 '0xa178c603400a184ce5fedbcfab392d9b77822f6ffa7facdec693aded214523bc',
                 '[vm] from:0xca3...a733c, to:TestContract.f() 0x692...77b3a, value:0 wei, data:0x261...21ff0, 0 logs, hash:0xa17...523bc',
                 `{
 "0": "uint256: 8"
}`, browser)
    .testFunction('g - transact (not payable)',
                 '0xb1532162e2e31397dc1e07ed0a1cf08f728e9b4487c6f9ed79d2f39410c92781',
                 '[vm] from:0xca3...a733c, to:TestContract.g() 0x692...77b3a, value:0 wei, data:0x261...21ff0, 0 logs, hash:0xb15...92781', `{
 "0": "uint256: 345",
 "1": "string: comment_comment_",
 "2": "bool: true",
 "3": "uint256: 4"
}`)
  })

  contractHelper.testContracts(browser, sources['browser/returnValues.sol'], ['testReturnValues'], function () {
    browser.click('.runView')
    .click('#runTabView div[class^="create"]')
    .testFunction('retunValues1 - transact (not payable)',
                 '0x79dc928d149d2ade02ab610a8ae290636222d034d4adce0bb08a68401e3d1f7f',
                 '[vm] from:0xca3...a733c, to:browser/Untitled.sol:test1.retunValues1() 0x5e7...26e9f, value:0 wei, data:0x9ed...59eb7, 0 logs, hash:0x79d...d1f7f',
                 `{
  "0": "bool: _b true",
  "1": "uint256: _u 345",
  "2": "int256: _i -345",
  "3": "address: _a 0xca35b7d915458ef540ade6068dfe2f44e8fa733c"
}`, browser)
    .testFunction('retunValues2 - transact (not payable)',
                 '0x09175dcb30227b3af422d75786dbba3b0549985e5c7f59f86d12c7e1043ccb8c',
                 '[vm] from:0xca3...a733c, to:browser/Untitled.sol:test1.retunValues2() 0x5e7...26e9f, value:0 wei, data:0xf57...4036c, 0 logs, hash:0x091...ccb8c', `{
  "0": "bytes1: _b 0x12",
  "1": "bytes2: _b2 0x1223",
  "2": "bytes3: _b3 0x000000",
  "3": "bytes5: _b5 0x0000043245",
  "4": "bytes6: _b6 0x002345532532",
  "5": "bytes7: _b7 0x03252353253253",
  "6": "bytes22: _b22 0x00000000000000000000325235235325325325235325",
  "7": "bytes32: _b32 0x0000000000000000000000000000000000032523532532523532523532523532"
}`)
  })
}

function testFunction (fnFullName, txHash, log, expectedReturn, browser) {
  browser.waitForElementPresent('.instance button[title="' + fnFullName + '"]')
    .click('.instance button[title=" ' + fnFullName + ' "]')
    .waitForElementPresent('#editor-container div[class^="terminal"] span[id="tx' + txHash + '"]')
    .assert.containsText('#editor-container div[class^="terminal"] span[id="tx' + txHash + '"]', log)
    .click('#editor-container div[class^="terminal"] span[id="tx' + txHash + '"] button[class^="details"]')
    .assert.containsText('#editor-container div[class^="terminal"] span[id="tx' + txHash + '"] table[class^="txTable"] #decodedoutput', expectedReturn)
  return browser
}

var sources = {
  'browser/Untitled.sol': { content: `pragma solidity ^0.4.0;
      contract TestContract { function f() returns (uint) { return 8; } 
      function g() returns (uint, string, bool, uint) {  
        uint payment = 345;
        bool payed = true;
        string memory comment = "comment_comment_";
        uint month = 4;
        return (payment, comment, payed, month); } }`},
  'browser/returnValues.sol': { content: `pragma solidity ^0.4.0;
    contract testReturnValues {
    function retunValues1 () returns (bool _b, uint _u, int _i, address _a)  {
        _b = true;
        _u = 345;
        _i = -345;
        _a = msg.sender;
    }
    
    function retunValues2 () returns (byte _b, bytes2 _b2, bytes3 _b3, bytes5 _b5, bytes6 _b6, bytes7 _b7, bytes22 _b22, bytes32 _b32)  {
        _b = 0x12;
        _b2 = 0x1223;
        _b5 = 0x43245;
        _b6 = 0x2345532532;
        _b7 = 0x3252353253253;
        _b22 = 0x325235235325325325235325;
        _b32 = 0x32523532532523532523532523532;
    }
}`}
}
