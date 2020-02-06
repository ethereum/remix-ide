const EventEmitter = require('events')

class addAtAddressInstance extends EventEmitter {
  async command (address, isValidFormat, isValidChecksum) {
    const instance = async () => {
      await addInstance(this.api, address, isValidFormat, isValidChecksum, () => {
        this.emit('complete')
      })
    }

    await this.api.perform(instance)
    return this
  }
}

async function addInstance (browser, address, isValidFormat, isValidChecksum, callback) {
  const modalOK = () => {
    var ret = document.querySelector('div[class^="modal-body"] div').innerHTML
    document.querySelector('#modal-footer-ok').click()
    return ret
  }
  const checkSum = async (result) => {
    if (!isValidFormat) {
      await browser.assert.equal(result.value, 'Invalid address.')
    } else if (!isValidChecksum) {
      await browser.assert.equal(result.value, 'Invalid checksum address.')
    }
    callback()
  }

  await browser.clickLaunchIcon('udapp')
  await browser.clearValue('.ataddressinput')
  await browser.setValue('.ataddressinput', address)     
  await browser.click('button[id^="runAndDeployAtAdressButton"]')
  await browser.execute(modalOK, [], checkSum)
}

module.exports = addAtAddressInstance
