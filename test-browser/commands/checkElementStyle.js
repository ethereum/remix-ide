const EventEmitter = require('events')

class checkElementStyle extends EventEmitter {
  async command (cssSelector, styleProperty, expectedResult) {
    await checkStyle(this.api, cssSelector, styleProperty, expectedResult)
    this.emit('complete')
    return this
  }
}

async function checkStyle (browser, cssSelector, styleProperty, expectedResult) {
  await browser.execute(function (cssSelector, styleProperty) {
    return window.getComputedStyle(document.querySelector(cssSelector)).getPropertyValue(styleProperty)
  }, [cssSelector, styleProperty], async function (result) {
    const value = result.value

    await browser.assert.equal(value.trim(), expectedResult)
  })
}

module.exports = checkElementStyle
