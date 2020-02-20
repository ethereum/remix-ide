'use strict'
const init = require('../helpers/init')
const sauce = require('./sauce')
const testData = {
  validGistId: '1859c97c6e1efc91047d725d5225888e',
  invalidGistId: '6368b389f9302v32902msk2402'
}
// 99266d6da54cc12f37f11586e8171546c7700d67

module.exports = {
  before: function (browser, done) {
    init(browser, done)
  },
  'UploadToGists': function (browser) {
      /*
       - set the access token
       - publish to gist
       - retrieve the gist
       - switch to a file in the new gist
      */
    console.log('token', process.env.gist_token)
    browser
    .waitForElementVisible('*[data-id="remixIdeIconPanel"]', 10000)
    .clickLaunchIcon('fileExplorers')
    .click('*[data-id="fileExplorerNewFilepublishToGist"]')
    .modalFooterOKClick()
    .getModalBody((value, done) => {
      const reg = /gist.github.com\/([^.]+)/
      const id = value.match(reg)
      console.log('gist regex', id)
      if (!id) {
        browser.assert.fail('cannot get the gist id', '', '')
      } else {
        let gistid = id[1]
        browser
          .modalFooterCancelClick()
          .executeScript(`remix.loadgist('${gistid}')`)
          .switchFile('browser/gists')
          .switchFile(`browser/gists/${gistid}`)
          .switchFile(`browser/gists/${gistid}/1_Storage.sol`)
          .perform(done)
      }
    })
  },

  'Load Gist Modal': function (browser) {
    browser.clickLaunchIcon('home')
    .waitForElementVisible('*[data-id="remixIdeIconPanel"]', 10000)
    .clickLaunchIcon('fileExplorers')
    .scrollAndClick('*[data-id="landingPageImportFromGistButton"]')
    .waitForElementVisible('*[data-id="modalDialogModalTitle"]')
    .assert.containsText('*[data-id="modalDialogModalTitle"]', 'Load a Gist')
    .waitForElementVisible('*[data-id="modalDialogModalBody"]')
    .assert.containsText('*[data-id="modalDialogModalBody"]', 'Enter the ID of the Gist or URL you would like to load.')
    .waitForElementVisible('*[data-id="modalDialogCustomPromptText"]')
    .modalFooterCancelClick()
  },

  'Display Error Message For Invalid Gist ID': function (browser) {
    browser
    .waitForElementVisible('*[data-id="remixIdeIconPanel"]', 10000)
    .clickLaunchIcon('fileExplorers')
    .scrollAndClick('*[data-id="landingPageImportFromGistButton"]')
    .waitForElementVisible('*[data-id="modalDialogCustomPromptText"]')
    .setValue('*[data-id="modalDialogCustomPromptText"]', testData.invalidGistId)
    .modalFooterOKClick()
    .waitForElementVisible('*[data-id="modalDialogModalBody"]')
    .assert.containsText('*[data-id="modalDialogModalBody"]', 'Gist load error: Not Found')
    .modalFooterOKClick()
  },

  'Import From Gist For Valid Gist ID': function (browser) {
    browser
    .waitForElementVisible('*[data-id="remixIdeIconPanel"]', 10000)
    .clickLaunchIcon('fileExplorers')
    .scrollAndClick('*[data-id="landingPageImportFromGistButton"]')
    .waitForElementVisible('*[data-id="modalDialogCustomPromptText"]')
    .setValue('*[data-id="modalDialogCustomPromptText"]', testData.validGistId)
    .modalFooterOKClick()
    .switchFile(`browser/gists/${testData.validGistId}`)
    .switchFile(`browser/gists/${testData.validGistId}/ApplicationRegistry`)
    .waitForElementVisible(`div[title='browser/gists/${testData.validGistId}/ApplicationRegistry']`)
    .assert.containsText(`div[title='browser/gists/${testData.validGistId}/ApplicationRegistry'] > span`, 'ApplicationRegistry')
    .end()
  },

  tearDown: sauce
}
