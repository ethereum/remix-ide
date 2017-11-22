'use strict'
var contractHelper = require('../helpers/contracts')
var init = require('../helpers/init')
var sauce = require('./sauce')
<<<<<<< HEAD

var sources = {
  'browser/Untitled.sol': { content: `pragma solidity ^0.4.0;
      contract TestContract { function f() returns (uint) { return 8; } 
      function g() returns (uint, string, bool, uint) {  
        uint payment = 345;
        bool payed = true;
        string memory comment = "comment_comment_";
        uint month = 4;
        return (payment, comment, payed, month); } }`}
}
=======
var async = require('async')
>>>>>>> 57a496aa1f3a3f66c485f84651dbac671d0f6225

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
  browser.testFunction = contractHelper.testFunction
  browser
    .waitForElementVisible('.newFile', 10000)
    .click('.compileView')
<<<<<<< HEAD
  contractHelper.testContracts(browser, sources['browser/Untitled.sol'], ['TestContract'], function () {
    browser.click('.runView')
    .click('#runTabView div[class^="create"]')
    .waitForElementPresent('.instance button[title="f - transact (not payable)"]')
    .click('.instance button[title="f - transact (not payable)"]')
    .waitForElementPresent('#editor-container div[class^="terminal"] span[id="tx0xa178c603400a184ce5fedbcfab392d9b77822f6ffa7facdec693aded214523bc"]')
    .assert.containsText('#editor-container div[class^="terminal"] span[id="tx0xa178c603400a184ce5fedbcfab392d9b77822f6ffa7facdec693aded214523bc"]', '[vm] from:0xca3...a733c, to:TestContract.f() 0x692...77b3a, value:0 wei, data:0x261...21ff0, 0 logs, hash:0xa17...523bc')
    .click('#editor-container div[class^="terminal"] span[id="tx0xa178c603400a184ce5fedbcfab392d9b77822f6ffa7facdec693aded214523bc"] button[class^="details"]')
    .assert.containsText('#editor-container div[class^="terminal"] span[id="tx0xa178c603400a184ce5fedbcfab392d9b77822f6ffa7facdec693aded214523bc"] table[class^="txTable"] #decodedoutput', `{
=======
    .perform(() => {
      // the first fn is used to pass browser to the other ones.
      async.waterfall([function (callback) { callback(null, browser) }, testSimpleContract, testReturnValues, testInputValues], function () {
        browser.end()
      })
    })
}

function testSimpleContract (browser, callback) {
  contractHelper.testContracts(browser, 'Untitled.sol', sources[0]['browser/Untitled.sol'], ['TestContract'], function () {
    browser.click('.runView')
      .click('#runTabView div[class^="create"]')
      .pause(500)
      .testFunction('f - transact (not payable)',
        '0xa178c603400a184ce5fedbcfab392d9b77822f6ffa7facdec693aded214523bc',
        '[vm] from:0xca3...a733c, to:TestContract.f() 0x692...77b3a, value:0 wei, data:0x261...21ff0, 0 logs, hash:0xa17...523bc', null,
        `{
>>>>>>> 57a496aa1f3a3f66c485f84651dbac671d0f6225
 "0": "uint256: 8"
}`)
      .pause(500)
      .testFunction('g - transact (not payable)',
        '0xb1532162e2e31397dc1e07ed0a1cf08f728e9b4487c6f9ed79d2f39410c92781',
        '[vm] from:0xca3...a733c, to:TestContract.g() 0x692...77b3a, value:0 wei, data:0xe21...79b8e, 0 logs, hash:0xb15...92781', null, `{
 "0": "uint256: 345",
 "1": "string: comment_comment_",
 "2": "bool: true",
 "3": "uint256: 4"
}`).perform(() => { callback(null, browser) })
  })
}

function testReturnValues (browser, callback) {
  contractHelper.testContracts(browser, 'returnValues.sol', sources[1]['browser/returnValues.sol'], ['testReturnValues'], function () {
    browser.click('.runView')
      .click('#runTabView div[class^="create"]')
      .pause(500)
      .testFunction('retunValues1 - transact (not payable)',
        '0x79dc928d149d2ade02ab610a8ae290636222d034d4adce0bb08a68401e3d1f7f',
        '[vm] from:0xca3...a733c, to:testReturnValues.retunValues1() 0x5e7...26e9f, value:0 wei, data:0x9ed...59eb7, 0 logs, hash:0x79d...d1f7f',
        null,
        `{
 "0": "bool: _b true",
 "1": "uint256: _u 345",
 "2": "int256: _i -345",
 "3": "address: _a 0xca35b7d915458ef540ade6068dfe2f44e8fa733c"
}`)
      .pause(500)
      .testFunction('retunValues2 - transact (not payable)',
        '0x09175dcb30227b3af422d75786dbba3b0549985e5c7f59f86d12c7e1043ccb8c',
        '[vm] from:0xca3...a733c, to:testReturnValues.retunValues2() 0x5e7...26e9f, value:0 wei, data:0xf57...4036c, 0 logs, hash:0x091...ccb8c', null, `{
 "0": "bytes1: _b 0x12",
 "1": "bytes2: _b2 0x1223",
 "2": "bytes3: _b3 0x000000",
 "3": "bytes: _blit 0x123498",
 "4": "bytes5: _b5 0x0000043245",
 "5": "bytes6: _b6 0x002345532532",
 "6": "string: _str this is a long string _ this is a long string _ this is a long string _ this is a long string _ this is a long string _ this is a long string _ this is a long string _ this is a long string _ this is a long string _ this is a long string _ this is a long string _ this is a long string _ this is a long string _ this is a long string _ this is a long string",
 "7": "bytes7: _b7 0x03252353253253",
 "8": "bytes22: _b22 0x00000000000000000000325235235325325325235325",
 "9": "bytes32: _b32 0x0000000000000000000000000000000000032523532532523532523532523532"
}`).pause(500).testFunction('retunValues3 - transact (not payable)',
        '0x7faab07aeaafc8afe6bf283bb83be70c000dff381dec04e779354e354da14aff',
        '[vm] from:0xca3...a733c, to:testReturnValues.retunValues3() 0x5e7...26e9f, value:0 wei, data:0x033...e0a7d, 0 logs, hash:0x7fa...14aff', null, `{
 "0": "uint8: _en 2",
 "1": "int256[5][]: _a1 1,-45,-78,56,60, -1,42,334,-45455,-446, 1,10,-5435,45,-7"
}`).perform(() => { callback(null, browser) })
  })
}

function testInputValues (browser, callback) {
  contractHelper.testContracts(browser, 'inputValues.sol', sources[2]['browser/inputValues.sol'], ['test'], function () {
    browser.click('.runView')
        .click('#runTabView div[class^="create"]')
        .pause(500)
      .testFunction('inputValue1 - transact (not payable)',
        '0x917a873d27d105213eaf5461e14780387ccceb66fed574f8432d1963917832ae',
        '[vm] from:0xca3...a733c, to:test.inputValue1(uint256,int256,string) 0x8c1...401f5, value:0 wei, data:0xd69...00000, 0 logs, hash:0x917...832ae',
        {types: 'uint256 _u, int256 _i, string _str', values: '"2343242", "-4324324", "string _ string _  string _  string _  string _  string _  string _  string _  string _  string _"'},
        `{
 "0": "uint256: _uret 2343242",
 "1": "int256: _iret -4324324",
 "2": "string: _strret string _ string _  string _  string _  string _  string _  string _  string _  string _  string _"
}`).pause(500).testFunction('inputValue2 - transact (not payable)',
        '0x487d09e244853bcb108b3a22cd6ee57b6431e50869619c9b918e9764fc16ef7f',
        '[vm] from:0xca3...a733c, to:test.inputValue2(uint256[3],bytes8[4]) 0x8c1...401f5, value:0 wei, data:0x1b7...00000, 1 logs, hash:0x487...6ef7f',
        {types: 'uint256[3] _n, bytes8[4] _b8', values: '[1,2,3], ["0x1234", "0x1234","0x1234","0x1234"]'},
        `{
 "0": "uint256[3]: _nret 1, 2, 3",
 "1": "bytes8[4]: _b8ret 0x1234000000000000, 0x1234000000000000, 0x1234000000000000, 0x1234000000000000"
}`, `[
 {
  "topic": "d30981760edbf605bda8689e945f622877f230c9a77cbfbd448aa4b7d8ac6e7f",
  "event": "event1",
  "args": [
   "-123",
   "000000000000000000000000000000000000000000000000000000000000007b",
   "9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658",
   "0x00001234",
   "test _ test _ test _ test test _ test test _ test test _ test test _ test test _ test test _ test "
  ]
 }
]`)
      .perform(() => { callback(null, browser) })
  })
}

// @TODO test: bytes8[3][] type as input

var sources = [
  {'browser/Untitled.sol': {content: `pragma solidity ^0.4.0;
      contract TestContract { function f() returns (uint) { return 8; } 
      function g() returns (uint, string, bool, uint) {  
        uint payment = 345;
        bool payed = true;
        string memory comment = "comment_comment_";
        uint month = 4;
        return (payment, comment, payed, month); } }`}},
  {'browser/returnValues.sol': {content: `pragma solidity ^0.4.0;
    contract testReturnValues {
    enum ActionChoices { GoLeft, GoRight, GoStraight, SitStill }
    function retunValues1 () returns (bool _b, uint _u, int _i, address _a)  {
        _b = true;
        _u = 345;
        _i = -345;
        _a = msg.sender;
    }
    
    function retunValues2 () returns (byte _b, bytes2 _b2, bytes3 _b3, bytes _blit, bytes5 _b5, bytes6 _b6, string _str, bytes7 _b7, bytes22 _b22, bytes32 _b32)  {
        _b = 0x12;
        _b2 = 0x1223;
        _b5 = 0x43245;
        _b6 = 0x2345532532;
        _b7 = 0x3252353253253;
        _b22 = 0x325235235325325325235325;
        _b32 = 0x32523532532523532523532523532;
        _blit = hex"123498";
        _str = "this is a long string _ this is a long string _ this is a long string _ this is a long string _ this is a long string _ this is a long string _ this is a long string _ this is a long string _ this is a long string _ this is a long string _ this is a long string _ this is a long string _ this is a long string _ this is a long string _ this is a long string";
    }
    
    function retunValues3 () returns (ActionChoices _en, int[5][] _a1)  {
       _en = ActionChoices.GoStraight;
       int[5][] memory a = new int[5][](3);
       a[0] = [int(1),-45,-78,56,60];
       a[1] = [int(-1),42,334,-45455,-446];
       a[2] = [int(1),10,-5435,45,-7];
      _a1 = a;
    }
  }`}},
  {'browser/inputValues.sol': {content: `pragma solidity ^0.4.0;
  contract test {
      event event1(int _i, uint indexed _u, string indexed _str, bytes4 _b, string _notIndexed);
      function inputValue1 (uint _u, int _i, string _str) returns (uint _uret, int _iret, string _strret) {
        _uret = _u;
        _iret = _i;
        _strret = _str;
      }
      function inputValue2 (uint[3] _n, bytes8[4] _b8) returns (uint[3] _nret, bytes8[4] _b8ret){
          _nret = _n;
          _b8ret = _b8;
          event1(-123, 123, "test", 0x1234, "test _ test _ test _ test test _ test test _ test test _ test test _ test test _ test test _ test ");
      }
  }`}}
]
