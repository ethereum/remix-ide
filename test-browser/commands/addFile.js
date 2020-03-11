const EventEmitter = require('events')

class AddFile extends EventEmitter {
  async command (name, content) {
    await addFile(this.api, name, content)
    this.emit('complete')
    return this
  }
}

async function addFile (browser, name, content) {
  await browser.clickLaunchIcon('udapp')
  await browser.clickLaunchIcon('fileExplorers')
  await browser.click('.newFile')
  await browser.waitForElementVisible('#modal-dialog')
  await browser.execute(function (fileName) {
    if (fileName !== 'Untitled.sol') {
      document.querySelector('#modal-dialog #prompt_text').setAttribute('value', fileName)
    }
    document.querySelector('#modal-footer-ok').click()
  }, [name], function (result) {
    console.log(result)
  })
  await browser.setEditorValue(content.content)
  await browser.pause(1000)
}

module.exports = AddFile
