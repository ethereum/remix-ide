const EventEmitter = require('events')

class CheckTerminalFilter extends EventEmitter {
  async command (filter, test) {
    const filters = async () => {
      await checkFilter(this.api, filter, test, () => {
        this.emit('complete')
      })
    }

    await this.api.perform(filters);
    return this
  }
}

async function checkFilter (browser, filter, test, done) {
  if (browser.options.desiredCapabilities.browserName === 'chrome') { // nightwatch deos not handle well that part.... works locally
    done()
    return
  }
  const filterClass = '#main-panel div[class^="search"] input[class^="filter"]'
  await browser.setValue(filterClass, filter);
  const result = await browser.execute(function () {
    return document.querySelector('#main-panel div[class^="journal"]').innerHTML === test
  }, [])
  await browser.clearValue(filterClass).setValue(filterClass, '')
  if (!result.value) {
    await browser.assert.fail('useFilter on ' + filter + ' ' + test, 'info about error', '')
  }
  done()
}

module.exports = CheckTerminalFilter
