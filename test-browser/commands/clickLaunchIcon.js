const EventEmitter = require('events')

class ClickLaunchIcon extends EventEmitter {
  async command (icon) {
    await this.api.waitForElementVisible('#icon-panel div[plugin="' + icon + '"]')
    await this.api.click('#icon-panel div[plugin="' + icon + '"]')
    this.emit('complete')
    return this
  }
}

module.exports = ClickLaunchIcon
