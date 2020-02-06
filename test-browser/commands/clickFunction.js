const EventEmitter = require('events')

class ClickFunction extends EventEmitter {
  async command (fnFullName, expectedInput) {
    const scrollTop = async function (client, done) {
      await client.execute(function () {
        document.querySelector('#runTabView').scrollTop = document.querySelector('#runTabView').scrollHeight
      }, [])
      if (expectedInput) {
        await client.setValue('#runTabView input[title="' + expectedInput.types + '"]', expectedInput.values, function () {})
      }
      done()
    }

    await this.api.waitForElementPresent('.instance button[title="' + fnFullName + '"]')
    await browser.perform(scrollTop)
    await browser.click('.instance button[title="' + fnFullName + '"]')
    await browser.pause(2000)
    await browser.perform(() => {
      this.emit('complete')
    })
    return this
  }
}

module.exports = ClickFunction
