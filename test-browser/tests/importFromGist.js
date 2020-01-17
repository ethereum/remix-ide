'use strict';
const init = require('../helpers/init');
const sauce = require('./sauce');
const delayBetweenOperationsInMs = 500;
const gistIdRegex = /[a-z0-9]{32}/;

const importGistSuccessTest = (browser, value) => {
  const [gistId] = value.match(gistIdRegex);
  return browser
    .click('div [plugin="home"]')
    .pause(delayBetweenOperationsInMs)
    .useXpath().click("//*[@id=\"col1\"]/div[2]/div/button[1]")
    .useCss()
    .waitForElementPresent('#prompt_text')
    .pause(delayBetweenOperationsInMs)
    .setValue('#prompt_text', value)
    .pause(delayBetweenOperationsInMs)
    .modalFooterOKClick()
    .pause(delayBetweenOperationsInMs)
    .waitForElementPresent(`li[key="browser/gists"]`, 20000)
    .pause(delayBetweenOperationsInMs)
    .assert.elementPresent(`li[key="browser/gists/${gistId}"]`)
    .pause(delayBetweenOperationsInMs);
};

const importGistFailureTest = (browser, value) => {
  return browser
    .click('div [plugin="home"]')
    .useXpath().click("//*[@id=\"col1\"]/div[2]/div/button[1]")
    .useCss()
    .waitForElementPresent('#prompt_text')
    .pause(delayBetweenOperationsInMs)
    .setValue('#prompt_text', value)
    .pause(delayBetweenOperationsInMs)
    .modalFooterOKClick()
    .pause(delayBetweenOperationsInMs)
    .waitForElementPresent('.modal-body')
    .pause(delayBetweenOperationsInMs)
    .getText('.modal-body', (result) => {
      browser.assert.equal(result.value.trim(), 'Gist load error: Not Found');
    })
    .pause(delayBetweenOperationsInMs)
    .modalFooterOKClick()
    .pause(delayBetweenOperationsInMs)
};

module.exports = {
  before: function (browser, done) {
    init(browser, done)
  },
  'Import file from Gist using gist id': function (browser) {
    const gistId = '922fc7a0d44b5723ac27fa12130eab05' || process.env.gist_token;
    importGistSuccessTest(browser,gistId)
  },
  'Import file from Gist using gist url': function (browser) {
    const gistUrl = 'https://gist.github.com/Galactoss/846604ae97ca68b26d543ab5e812a2d9' || process.env.gist_url;
    importGistSuccessTest(browser,gistUrl)
  },
  'Import file from Gist fails when wrong gist id is entered': function (browser) {
    const gistId = '922fc7a0d44b5723ac27fa12130eabgg';
    importGistFailureTest(browser, gistId);
  },
  'Import file from Gist fails when wrong gist url is entered': function (browser) {
    const gistUrl = 'https://gist.github.com/Galactoss/846604ae97ca68b26d543ab5e812a2gg';
    importGistFailureTest(browser, gistUrl);
  },
  after: (browser,done)=>{
    browser.end();
    done();
  },
  tearDown: sauce
};
