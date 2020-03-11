const EventEmitter = require('events')

class addAtAddressInstance extends EventEmitter {
  async command (address, isValidFormat, isValidChecksum) {
    await addInstance(this.api, address, isValidFormat, isValidChecksum)
    this.emit('complete')
    return this
  }
}

async function addInstance (browser, address, isValidFormat, isValidChecksum) {
 await browser.clickLaunchIcon('udapp')
 await browser.clearValue('.ataddressinput')
 await browser.setValue('.ataddressinput', address)
 await browser.click('button[id^="runAndDeployAtAdressButton"]')
 await browser.execute(function () {
    var ret = document.querySelector('div[class^="modal-body"] div').innerHTML
    document.querySelector('#modal-footer-ok').click()
    return ret
  }, [], async function (result) {
    if (!isValidFormat) {
      await browser.assert.equal(result.value, 'Invalid address.')
    } else if (!isValidChecksum) {
      await browser.assert.equal(result.value, 'Invalid checksum address.')
    }
  })
}

module.exports = addAtAddressInstance
