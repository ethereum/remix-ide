const EventEmitter = require('events')
const deepequal = require('deep-equal')

class CreateContract extends EventEmitter {
  async command (id, debugValue) {
    checkDebug(this.api, id, debugValue)
    this.emit('complete')
    return this
  }
}

async function checkDebug (browser, id, debugValue) {
    // id is soliditylocals or soliditystate
  await browser.execute(function (id) {
    return document.querySelector('#' + id + ' .dropdownrawcontent').innerText
  }, [id], async function (result) {
    console.log(id + ' ' + result.value)
    var value
    try {
      value = JSON.parse(result.value)
    } catch (e) {
      await browser.assert.fail('cant parse solidity state', e.message, '')
      return
    }
    var equal = deepequal(debugValue, value)
    if (!equal) {
      await browser.assert.fail('checkDebug on ' + id, 'info about error', '')
    }
  })
}

module.exports = CreateContract
