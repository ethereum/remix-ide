const EventEmitter = require('events')

class CheckTerminalFilter extends EventEmitter {
  async command (filter, test) {
    await checkFilter(this.api, filter, test)
    this.emit('complete')
    return this
  }
}

async function checkFilter (browser, filter, test) {
  const filterClass = '[data-id="terminalInputSearch"]'

  await browser.setValue(filterClass, filter)
  await browser.execute(function () {
    return document.querySelector('[data-id="terminalJournal"]').innerHTML === test
  }, [], async function (result) {
    await browser.clearValue(filterClass)
    await browser.setValue(filterClass, '')
    if (!result.value) {
      await browser.assert.fail('useFilter on ' + filter + ' ' + test, 'info about error', '')
    }
  })
}

module.exports = CheckTerminalFilter
