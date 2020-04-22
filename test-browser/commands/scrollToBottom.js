const EventEmitter = require('events')

class ScrollToBottom extends EventEmitter {
  command (target) {
    this.api.perform((client, done) => {
      _scrollToBottom(this.api, target, () => {
        done()
        this.emit('complete')
      })
    })
    return this
  }
}

function _scrollToBottom (browser, target, cb) {
  browser.execute(function (target) {
    const element = document.querySelector(target)

    element.scrollTop = element.scrollHeight
  }, [target], function () {
    cb()
  })
}

module.exports = ScrollToBottom
