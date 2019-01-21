var helpers = require('./contracts')

module.exports = function (browser, callback) {
  browser.clickLaunchIcon = helpers.clickLaunchIcon
  browser
    .url('http://127.0.0.1:8080/#version=builtin')
    .injectScript('test-browser/helpers/applytestmode.js', function () {
      browser.resizeWindow(2560, 1440, () => {
        initModules(browser, () => {
          browser.clickLaunchIcon('solidity').click('#autoCompile')
          .perform(function () {
            callback()
          })
        })
      })
    })
}

function initModules (browser, callback) {
  browser.click('div[title="plugin manager"]')
  .click('#pluginManager div[title="solidity"]')
  .click('#pluginManager div[title="run transactions"]')
  .click('#pluginManager div[title="solidity static analysis"]')
  .click('#pluginManager div[title="debugger"]')
  .perform(() => { callback() })
}
