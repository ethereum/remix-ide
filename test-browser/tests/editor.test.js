'use strict'
const init = require('../helpers/init')
const sauce = require('./sauce')

module.exports = {

  before: function (browser, done) {
    init(browser, done)
  },

  'Should zoom in editor': function (browser) {
    browser.waitForElementVisible('div[data-id="mainPanelPluginsContainer"]')
    .switchFile('browser/1_Storage.sol')
    .waitForElementVisible('*[data-id="editorInput"]')
    .checkElementStyle('*[data-id="editorInput"]', 'font-size', '12px')
    .click('*[data-id="tabProxyZoomIn"]')
    .click('*[data-id="tabProxyZoomIn"]')
    .checkElementStyle('*[data-id="editorInput"]', 'font-size', '14px')
  },

  'Should zoom out editor': function (browser) {
    browser.waitForElementVisible('*[data-id="editorInput"]')
    .checkElementStyle('*[data-id="editorInput"]', 'font-size', '14px')
    .click('*[data-id="tabProxyZoomOut"]')
    .click('*[data-id="tabProxyZoomOut"]')
    .checkElementStyle('*[data-id="editorInput"]', 'font-size', '12px')
  },

  'Should display compile error in editor': function (browser) {
    browser.waitForElementVisible('*[data-id="editorInput"]')
    .waitForElementVisible('*[class="ace_content"]')
    .click('*[class="ace_content"]')
    .sendKeys('*[class="ace_text-input"]', 'error')
    .pause(2000)
    .waitForElementVisible('.ace_error')
  },

  'Should minimize and maximize codeblock in editor': function (browser) {
    browser.waitForElementVisible('*[data-id="editorInput"]')
    .waitForElementVisible('.ace_open')
    .click('.ace_start:nth-of-type(1)')
    .waitForElementVisible('.ace_closed')
    .click('.ace_start:nth-of-type(1)')
    .waitForElementVisible('.ace_open')
  },

  'Should add breakpoint to editor': function (browser) {
    browser.waitForElementVisible('*[data-id="editorInput"]')
    .waitForElementNotPresent('.ace_breakpoint')
    .click('.ace_gutter-cell:nth-of-type(1)')
    .waitForElementVisible('.ace_breakpoint')
  },

  'Should load syntax highlighter for ace light theme': function (browser) {
    browser.waitForElementVisible('*[data-id="editorInput"]')
    .checkElementStyle('.ace_keyword', 'color', aceThemes.light.keyword)
    .checkElementStyle('.ace_comment.ace_doc', 'color', aceThemes.light.comment)
    .checkElementStyle('.ace_function', 'color', aceThemes.light.function)
    .checkElementStyle('.ace_variable', 'color', aceThemes.light.variable)
  },

  'Should load syntax highlighter for ace dark theme': function (browser) {
    browser.waitForElementVisible('*[data-id="verticalIconsKindsettings"]')
    .click('*[data-id="verticalIconsKindsettings"]')
    .waitForElementVisible('*[data-id="settingsTabThemeDark"]')
    .click('*[data-id="settingsTabThemeDark"]')
    .pause(2000)
    .waitForElementVisible('*[data-id="editorInput"]')
    .checkElementStyle('.ace_keyword', 'color', aceThemes.dark.keyword)
    .checkElementStyle('.ace_comment.ace_doc', 'color', aceThemes.dark.comment)
    .checkElementStyle('.ace_function', 'color', aceThemes.dark.function)
    .checkElementStyle('.ace_variable', 'color', aceThemes.dark.variable)
  },

  'Should highlight source code': function (browser) {
    browser.addFile('sourcehighlight.js', sourcehighlightScript)
    .switchFile('browser/sourcehighlight.js')
    .executeScript('remix.exeCurrent()')
    .scrollUp('*[data-id="editorInput"]', 100)
    .pause(5000)
    .scrollUp('.ace_scroller', 100)
    .waitForElementPresent('.highlightLine32')
    .checkElementStyle('.highlightLine32', 'background-color', 'rgb(8, 108, 181)')
    .waitForElementPresent('.highlightLine40')
    .checkElementStyle('.highlightLine40', 'background-color', 'rgb(8, 108, 181)')
    .end()
  },

  tearDown: sauce
}

var aceThemes = {
  light: {
    keyword: 'rgb(147, 15, 128)',
    comment: 'rgb(35, 110, 36)',
    function: 'rgb(0, 0, 162)',
    variable: 'rgb(253, 151, 31)'
  },
  dark: {
    keyword: 'rgb(0, 105, 143)',
    comment: 'rgb(85, 85, 85)',
    function: 'rgb(0, 174, 239)',
    variable: 'rgb(153, 119, 68)'
  }
}

const sourcehighlightScript = {
  content: `
  (async () => {
    try {
        const pos = {
            start: {
                line: 32,
                column: 3
            },
            end: {
                line: 32,
                column: 20
            }
        }
        await remix.call('editor', 'highlight', pos, 'browser/3_Ballot.sol')
        
         const pos2 = {
            start: {
                line: 40,
                column: 3
            },
            end: {
                line: 40,
                column: 20
            }
        }
        await remix.call('editor', 'highlight', pos2, 'browser/3_Ballot.sol')
        
         const pos3 = {
            start: {
                line: 50,
                column: 3
            },
            end: {
                line: 50,
                column: 20
            }
        }
        await remix.call('editor', 'highlight', pos3, 'browser/3_Ballot.sol')
    } catch (e) {
        console.log(e.message)
    }
  })()
  `  
}