const EventEmitter = require('events')

class clearEditablecontent extends EventEmitter {
  async command (cssSelector) {
    await clearContent(this.api, cssSelector)
    this.emit('complete')
    return this
  }
}

function clearContent (browser, cssSelector) {
  browser.execute(function (cssSelector) {
    const selection = window.getSelection()
    const range = document.createRange()

    range.selectNodeContents(document.querySelector(cssSelector))
    selection.removeAllRanges()
    selection.addRange(range)
  }, [cssSelector], async function () {
    await browser.sendKeys(cssSelector, browser.Keys.BACK_SPACE)
    await browser.pause(5000)
  })
}

module.exports = clearEditablecontent
