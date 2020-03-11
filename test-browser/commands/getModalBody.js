const EventEmitter = require('events')

class GetModalBody extends EventEmitter {
  async command (callback) {
    await this.api.waitForElementVisible('.modal-body')
    await this.api.getText('.modal-body', async (result) => {
      console.log(result)
      await callback(result.value)
    })
    this.emit('complete')
    return this
  }
}

module.exports = GetModalBody
