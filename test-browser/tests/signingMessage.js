'use strict'
var init = require('../helpers/init')
var sauce = require('./sauce')

module.exports = {
  before: function (browser, done) {
    init(browser, done)
  },
  '@sources': function () {
    return sources
  },
  'Test Signature': function (browser) {
    let hash, signature
    browser
    .clickLaunchIcon('udapp')
    .selectAccount('0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c') // this account will be used for this test suite
    .signMessage('test message', (h, s) => {
      hash = h
      signature = s
      console.log('hash', hash)
      console.log('signature', signature)
      browser.assert.ok(typeof hash.value === 'string', 'type of hash.value must be String')
      browser.assert.ok(typeof signature.value === 'string', 'type of signature.value must be String')
    })
      .addFile('signMassage.sol', sources[0]['browser/signMassage.sol'])
      .switchFile('browser/signMassage.sol')
      .pause(5000)
      .selectContract('ECVerify')
      .createContract('')
      .clickInstance(0)
      .perform((done) => {
        browser.getAddressAtPosition(0, (address) => {
          // skip 'instance' part of e.g. 'instance0x692a70d2e424a56d2c6c27aa97d1a86395877b3a'
          console.log('Test Signature address', address)
          var inputs = `"${hash.value}","${signature.value}"`
          console.log('Test Signature Input', inputs)
          browser.clickFunction('ecrecovery - call', { types: 'bytes32 hash, bytes sig', values: inputs })
              .pause(5000)
              .verifyCallReturnValue(
                address,
                ['0: address: 0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c'])
              .perform(() => {
                done()
              })
        })
      })
      .end()
  },
  tearDown: sauce
}

var sources = [
  {
    'browser/signMassage.sol': {content: `
    pragma solidity >=0.4.22 <0.7.0;
    contract SignMassageTest {
      function testRecovery(bytes32 h, uint8 v, bytes32 r, bytes32 s) public pure returns (address) {
          return ecrecover(h, v, r, s);
      }
    }

    library ECVerify {
      function ecrecovery(bytes32 hash, bytes memory sig) public pure returns (address) {
        bytes32 r;
        bytes32 s;
        uint8 v;

        if (sig.length != 65) {
          return address(0);
        }

        assembly {
          r := mload(add(sig, 32))
          s := mload(add(sig, 64))
          v := and(mload(add(sig, 65)), 255)
        }

        if (v < 27) {
          v += 27;
        }

        if (v != 27 && v != 28) {
          return address(0);
        }

        return ecrecover(hash, v, r, s);
      }

      function ecverify(bytes32 hash, bytes memory sig, address signer) public pure returns (bool) {
        return signer == ecrecovery(hash, sig);
      }
    }`}
  }
]
