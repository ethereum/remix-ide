const EventEmitter = require('events')
const deepequal = require('deep-equal')

class CreateContract extends EventEmitter {
  async command (id, debugValue) {
    const debug = async () => {
      await checkDebug(this.api, id, debugValue, async () => {
        this.emit('complete')
      })
    }

    await this.api.perform(debug);
    return this
  }
}

async function checkDebug (browser, id, debugValue, done) {
    // id is soliditylocals or soliditystate
  const result = await browser.execute(function (id) {
    return document.querySelector('#' + id + ' .dropdownrawcontent').innerText
  }, [id])
  console.log(id + ' ' + result.value)
  var value
  try {
    value = JSON.parse(result.value)
  } catch (e) {
    await browser.assert.fail('cant parse solidity state', e.message, '')
    done()
    return
  }
  var equal = deepequal(debugValue, value)
  if (!equal) {
    await browser.assert.fail('checkDebug on ' + id, 'info about error', '')
  }
  done()
}

module.exports = CreateContract
