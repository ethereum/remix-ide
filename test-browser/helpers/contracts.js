'use strict'

module.exports = {
  checkCompiledContracts: checkCompiledContracts,
  testContracts: testContracts
}

function checkCompiledContracts (browser, compiled, callback) {
  browser.execute(function () {
    var contracts = document.querySelectorAll('.udapp .contract')
    var ret = []
    for (var k in contracts) {
      var el = contracts[k]
      if (el.querySelector) {
        ret.push({
          name: el.querySelector('.title').innerText.replace(el.querySelector('.size').innerText, '').replace(/(\t)|(\r)|(\n)/g, '') // IE/firefox add \r\n
        })
      }
    }
    return ret
  }, [''], function (result) {
    browser.assert.equal(result.value.length, compiled.length)
    result.value.map(function (item, i) {
      browser.assert.equal(item.name, compiled[i])
    })
    callback()
  })
}

function testContracts (browser, contractCode, compiledContractNames, callback) {
  browser
    .clearValue('#input textarea')
    .click('.newFile')
    .setValue('#input textarea', contractCode, function () {
      browser.pause(3000)
      checkCompiledContracts(browser, compiledContractNames, callback)
    })
}
