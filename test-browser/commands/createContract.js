const EventEmitter = require('events')

class CreateContract extends EventEmitter {
  async command (inputParams) {
    await createContract(this.api, inputParams)
    this.emit('complete')
    return this
  }
}

async function createContract (browser, inputParams) {
  await browser.clickLaunchIcon('settings')
  await browser.clickLaunchIcon('udapp')
  await browser.execute(function (cssSelector) {
    const hidden = window.getComputedStyle(document.querySelector(cssSelector)).getPropertyValue('visibility')

    return hidden.trim() === 'hidden' ? true : false // eslint-disable-line
  }, ['div[class^="contractActionsContainerSingle"] input'], async function (result) {
    const hidden = result.value

    if (!hidden) {
      await browser.setValue('div[class^="contractActionsContainerSingle"] input', inputParams)
    }
  })
  await browser.click('#runTabView button[class^="instanceButton"]')
  await browser.pause(500)
}

module.exports = CreateContract
