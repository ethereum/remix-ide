const EventEmitter = require('events')

class GetEditorValue extends EventEmitter {
  async command (callback) {
    await this.api.execute(function (value) {
      return document.getElementById('input').editor.getValue()
    }, [], async (result) => {
      await callback(result.value)
    })
    this.emit('complete')
    return this
  }
}

module.exports = GetEditorValue
