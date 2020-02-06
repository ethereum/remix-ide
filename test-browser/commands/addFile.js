const EventEmitter = require('events')

class AddFile extends EventEmitter {
  async command (name, content) {
    const file = async () => {
      await addFile(this.api, name, content, () => {
        this.emit('complete')
      })
    }

    await this.api.perform(file)
    return this
  }
}

async function addFile (browser, name, content, done) {
  const loadFile = async (client, done) => {
    await browser.execute(function (fileName) {
      if (fileName !== 'Untitled.sol') {
        document.querySelector('#modal-dialog #prompt_text').setAttribute('value', fileName)
      }
      document.querySelector('#modal-footer-ok').click()
    }, [name], function (result) {
      console.log(result)
      done()
    })
  }

  await browser.clickLaunchIcon('udapp')
  await browser.clickLaunchIcon('fileExplorers')
  await browser.click('.newFile')
  await browser.waitForElementVisible('#modal-dialog')
  await browser.perform(loadFile)
  await browser.setEditorValue(content.content)
  await browser.pause(1000)
  await browser.perform(function () {
    done()
  })
}

module.exports = AddFile
