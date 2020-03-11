const EventEmitter = require('events')

class GetAddressAtPosition extends EventEmitter {
  async command (index, cb) {
    await getAddressAtPosition(this.api, index, (pos) => {
      cb(pos)
    })
    this.emit('complete')
    return this
  }
}

async function getAddressAtPosition (browser, index, callback) {
  index = index + 2
  await browser.execute(function (index) {
    return document.querySelector('.instance:nth-of-type(' + index + ')').getAttribute('id').replace('instance', '')
  }, [index], async function (result) {
    await callback(result.value)
  })
}

module.exports = GetAddressAtPosition
