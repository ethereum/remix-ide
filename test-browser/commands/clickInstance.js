const EventEmitter = require('events')

class ClickInstance extends EventEmitter {
  async command (index) {
    index = index + 2
    let selector = '.instance:nth-of-type(' + index + ') > div > button'
    await this.api.waitForElementPresent(selector)
    await this.api.scrollAndClick(selector)
    this.emit('complete')
    return this
  }
}

module.exports = ClickInstance
