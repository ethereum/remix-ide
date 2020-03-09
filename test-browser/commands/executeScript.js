const EventEmitter = require('events')

class ExecuteScript extends EventEmitter {
  command (script) {
    this.api
      .clearEditablecontent('*[data-id="terminalCliInput"]')
      .sendKeys('*[data-id="terminalCliInput"]', script)
      .sendKeys('*[data-id="terminalCliInput"]', this.api.Keys.ENTER)
      .sendKeys('*[data-id="terminalCliInput"]', this.api.Keys.ENTER) // that's a bug... sometimes we need to press 2 times to execute a command
      .pause(2000)
      .perform(() => {
        this.emit('complete')
      })
    return this
  }
}

module.exports = ExecuteScript
