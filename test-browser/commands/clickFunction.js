const EventEmitter = require('events')

class ClickFunction extends EventEmitter {
  async command (fnFullName, expectedInput) {
    await this.api.waitForElementPresent('.instance button[title="' + fnFullName + '"]')
    await this.api.execute(function () {
      document.querySelector('#runTabView').scrollTop = document.querySelector('#runTabView').scrollHeight
    }, [], async () => {
      if (expectedInput) {
        await this.api.setValue('#runTabView input[title="' + expectedInput.types + '"]', expectedInput.values)
      }
    })
    await this.api.click('.instance button[title="' + fnFullName + '"]')
    await this.api.pause(2000)
    this.emit('complete')
    return this
  }
}

module.exports = ClickFunction
