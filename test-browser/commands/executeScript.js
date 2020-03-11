const EventEmitter = require('events')

class ExecuteScript extends EventEmitter {
  async command (script) {
    await this.api.clearEditablecontent('*[data-id="terminalCliInput"]')
    await this.api.sendKeys('*[data-id="terminalCliInput"]', script)
    await this.api.sendKeys('*[data-id="terminalCliInput"]', this.api.Keys.ENTER)
    await this.api.sendKeys('*[data-id="terminalCliInput"]', this.api.Keys.ENTER) // that's a bug... sometimes we need to press 2 times to execute a command
    this.emit('complete')
    return this
  }
}

module.exports = ExecuteScript
