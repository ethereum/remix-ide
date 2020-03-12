const EventEmitter = require('events')

class CreateContract extends EventEmitter {
  command (inputParams) {
    this.api.perform((done) => {
      createContract(this.api, inputParams, () => {
        done()
        this.emit('complete')
      })
    })
    return this
  }
}

function createContract (browser, inputParams, callback) {
  browser.clickLaunchIcon('settings').clickLaunchIcon('udapp')
  .execute(function (cssSelector) {
    const hidden = window.getComputedStyle(document.querySelector(cssSelector)).getPropertyValue('visibility')

    return hidden.trim() === 'hidden' ? true : false // eslint-disable-line
  }, ['*[data-id="multiParamManagerBasicInputField"]'], function (result) {
    const hidden = result.value

    if (!hidden) {
      browser.setValue('*[data-id="multiParamManagerBasicInputField"]', inputParams, function () {
        browser.click('*[data-id="multiParamManagerFuncButton"]').pause(500).perform(function () { callback() })
      })
    } else {
      browser.click('*[data-id="multiParamManagerFuncButton"]').pause(500).perform(function () { callback() })
    }
  })
}

module.exports = CreateContract
