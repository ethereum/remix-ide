const EventEmitter = require('events')

class clearEditablecontent extends EventEmitter {
  command (cssSelector) {
    this.api.perform((done) => {
      clearContent(this.api, cssSelector, () => {
        done()
        this.emit('complete')
      })
    })
    return this
  }
}

function clearContent (browser, cssSelector, callback) {
  browser.execute(function (cssSelector) {
    const selection = window.getSelection()
    const range = document.createRange()

    range.selectNodeContents(document.querySelector(cssSelector))
    selection.removeAllRanges()
    selection.addRange(range)
  }, [cssSelector], function () {
    browser.sendKeys(cssSelector, browser.Keys.BACK_SPACE)
    .pause(5000)
    callback()
  })
}

module.exports = clearEditablecontent
