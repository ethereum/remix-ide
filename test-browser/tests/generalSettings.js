'use strict'
const init = require('../helpers/init')
const sauce = require('./sauce')

module.exports = {
  before: function (browser, done) {
    init(browser, done, 'http://127.0.0.1:8080', false)
  },

  'Should display settings menu': function (browser) {
    browser.waitForElementVisible('*[data-id="remixIdeIconPanel"]', 10000)
    .click('*[data-id="landingPageStartSolidity"]')
    .waitForElementVisible('*[data-id="verticalIconsKindsettings"]', 5000)
    .click('*[data-id="verticalIconsKindsettings"]')
    .waitForElementVisible('*[data-id="settingsTabSettingsView"]')
    .assert.containsText('h6[data-id="sidePanelSwapitTitle"]', 'SETTINGS')
  },

  'Should open gitter channel in a new tab when `Gitter Channel Button` is clicked': function (browser) {
    const runtimeBrowser = browser.capabilities.browserName

    browser.waitForElementVisible('*[data-id="remixIdeSidePanel"]')
    .waitForElementVisible('*[data-id="settingsTabGitterChannelButton"]')
    .click('*[data-id="settingsTabGitterChannelButton"]')
    .pause(2000)
    .switchBrowserTab(1)
    if (runtimeBrowser === 'chrome') browser.assert.urlContains('https://gitter.im/ethereum/remix')
  },

  'Should activate `generate contract metadata`': function (browser) {
    browser.switchBrowserTab(0)
    .waitForElementVisible('*[data-id="remixIdeSidePanel"]')
    .waitForElementVisible('*[data-id="settingsTabGenerateContractMetadata"]')
    .click('*[data-id="settingsTabGenerateContractMetadata"]')
    .click('*[data-id="verticalIconsFileExplorerIcons"]')
    .switchFile('browser/3_Ballot.sol')
    .click('*[data-id="verticalIconsKindsolidity"]')
    .pause(2000)
    .click('*[data-id="compilerContainerCompileBtn"]')
    .pause(3000)
    .click('*[data-id="verticalIconsKindfileExplorers"]')
    .switchFile('browser/artifacts')
    .switchFile('browser/artifacts/Ballot.json')
  },

  'Should add new github access token': function (browser) {
    browser.waitForElementVisible('*[data-id="verticalIconsKindsettings"]')
    .click('*[data-id="verticalIconsKindsettings"]')
    .setValue('*[data-id="settingsTabGistAccessToken"]', '**********')
    .click('*[data-id="settingsTabSaveGistToken"]')
    .waitForElementVisible('*[data-shared="tooltipPopup"]:nth-last-of-type(1)')
    .assert.containsText('*[data-shared="tooltipPopup"]:nth-last-of-type(1)', 'Access token saved')
    .click('*[data-id="tooltipCloseButton"]')
  },

  'Should copy github access token to clipboard': function (browser) {
    browser.waitForElementVisible('*[data-id="verticalIconsKindsettings"]')
    .click('*[data-id="copyToClipboardCopyIcon"]')
    .waitForElementVisible('*[data-shared="tooltipPopup"]:nth-last-of-type(1)')
    .assert.containsText('*[data-shared="tooltipPopup"]:nth-last-of-type(1)', 'Copied value to clipboard.')
    .click('*[data-id="tooltipCloseButton"]')
  },

  'Should remove github access token': function (browser) {
    browser.waitForElementVisible('*[data-id="verticalIconsKindsettings"]')
    .click('*[data-id="settingsTabRemoveGistToken"]')
    .waitForElementVisible('*[data-shared="tooltipPopup"]:nth-last-of-type(1)')
    .assert.containsText('*[data-shared="tooltipPopup"]:nth-last-of-type(1)', 'Access token removed')
    .assert.containsText('*[data-id="settingsTabGistAccessToken"]', '')
    .click('*[data-id="tooltipCloseButton"]')
  },

  'Should load dark theme': function (browser) {
    browser.waitForElementVisible('*[data-id="verticalIconsKindsettings"]')
    .click('*[data-id="settingsTabThemeDark"]')
    .pause(2000)
    .checkElementStyle(':root', '--primary', remixIdeThemes.dark.primary)
    .checkElementStyle(':root', '--secondary', remixIdeThemes.dark.secondary)
    .checkElementStyle(':root', '--success', remixIdeThemes.dark.success)
    .checkElementStyle(':root', '--info', remixIdeThemes.dark.info)
    .checkElementStyle(':root', '--warning', remixIdeThemes.dark.warning)
    .checkElementStyle(':root', '--danger', remixIdeThemes.dark.danger)
  },

  'Should load light theme': function (browser) {
    browser.waitForElementVisible('*[data-id="verticalIconsKindsettings"]')
    .click('*[data-id="settingsTabThemeLight"]')
    .pause(2000)
    .checkElementStyle(':root', '--primary', remixIdeThemes.light.primary)
    .checkElementStyle(':root', '--secondary', remixIdeThemes.light.secondary)
    .checkElementStyle(':root', '--success', remixIdeThemes.light.success)
    .checkElementStyle(':root', '--info', remixIdeThemes.light.info)
    .checkElementStyle(':root', '--warning', remixIdeThemes.light.warning)
    .checkElementStyle(':root', '--danger', remixIdeThemes.light.danger)
  },

  'Should load Cerulean theme': function (browser) {
    browser.waitForElementVisible('*[data-id="verticalIconsKindsettings"]')
    .click('*[data-id="settingsTabThemeCerulean"]')
    .pause(2000)
    .checkElementStyle(':root', '--primary', remixIdeThemes.curelean.primary)
    .checkElementStyle(':root', '--secondary', remixIdeThemes.curelean.secondary)
    .checkElementStyle(':root', '--success', remixIdeThemes.curelean.success)
    .checkElementStyle(':root', '--info', remixIdeThemes.curelean.info)
    .checkElementStyle(':root', '--warning', remixIdeThemes.curelean.warning)
    .checkElementStyle(':root', '--danger', remixIdeThemes.curelean.danger)
  },

  'Should load Flatly theme': function (browser) {
    browser.waitForElementVisible('*[data-id="verticalIconsKindsettings"]')
    .click('*[data-id="settingsTabThemeFlatly"]')
    .pause(2000)
    .checkElementStyle(':root', '--primary', remixIdeThemes.flatly.primary)
    .checkElementStyle(':root', '--secondary', remixIdeThemes.flatly.secondary)
    .checkElementStyle(':root', '--success', remixIdeThemes.flatly.success)
    .checkElementStyle(':root', '--info', remixIdeThemes.flatly.info)
    .checkElementStyle(':root', '--warning', remixIdeThemes.flatly.warning)
    .checkElementStyle(':root', '--danger', remixIdeThemes.flatly.danger)
  },

  'Should load Lumen theme': function (browser) {
    browser.waitForElementVisible('*[data-id="verticalIconsKindsettings"]')
    .click('*[data-id="settingsTabThemeLumen"]')
    .pause(2000)
    .checkElementStyle(':root', '--primary', remixIdeThemes.lumen.primary)
    .checkElementStyle(':root', '--secondary', remixIdeThemes.lumen.secondary)
    .checkElementStyle(':root', '--success', remixIdeThemes.lumen.success)
    .checkElementStyle(':root', '--info', remixIdeThemes.lumen.info)
    .checkElementStyle(':root', '--warning', remixIdeThemes.lumen.warning)
    .checkElementStyle(':root', '--danger', remixIdeThemes.lumen.danger)
  },

  'Should load Minty theme': function (browser) {
    browser.waitForElementVisible('*[data-id="verticalIconsKindsettings"]')
    .click('*[data-id="settingsTabThemeMinty"]')
    .pause(2000)
    .checkElementStyle(':root', '--primary', remixIdeThemes.minty.primary)
    .checkElementStyle(':root', '--secondary', remixIdeThemes.minty.secondary)
    .checkElementStyle(':root', '--success', remixIdeThemes.minty.success)
    .checkElementStyle(':root', '--info', remixIdeThemes.minty.info)
    .checkElementStyle(':root', '--warning', remixIdeThemes.minty.warning)
    .checkElementStyle(':root', '--danger', remixIdeThemes.minty.danger)
  },

  'Should load Pulse theme': function (browser) {
    browser.waitForElementVisible('*[data-id="verticalIconsKindsettings"]')
    .click('*[data-id="settingsTabThemePulse"]')
    .pause(2000)
    .checkElementStyle(':root', '--primary', remixIdeThemes.pulse.primary)
    .checkElementStyle(':root', '--secondary', remixIdeThemes.pulse.secondary)
    .checkElementStyle(':root', '--success', remixIdeThemes.pulse.success)
    .checkElementStyle(':root', '--info', remixIdeThemes.pulse.info)
    .checkElementStyle(':root', '--warning', remixIdeThemes.pulse.warning)
    .checkElementStyle(':root', '--danger', remixIdeThemes.pulse.danger)
  },

  'Should load Sandstone theme': function (browser) {
    browser.waitForElementVisible('*[data-id="verticalIconsKindsettings"]')
    .click('*[data-id="settingsTabThemeSandstone"]')
    .pause(2000)
    .checkElementStyle(':root', '--primary', remixIdeThemes.sandstone.primary)
    .checkElementStyle(':root', '--secondary', remixIdeThemes.sandstone.secondary)
    .checkElementStyle(':root', '--success', remixIdeThemes.sandstone.success)
    .checkElementStyle(':root', '--info', remixIdeThemes.sandstone.info)
    .checkElementStyle(':root', '--warning', remixIdeThemes.sandstone.warning)
    .checkElementStyle(':root', '--danger', remixIdeThemes.sandstone.danger)
  },

  'Should load Spacelab theme': function (browser) {
    browser.waitForElementVisible('*[data-id="verticalIconsKindsettings"]')
    .click('*[data-id="settingsTabThemeSpacelab"]')
    .pause(2000)
    .checkElementStyle(':root', '--primary', remixIdeThemes.spacelab.primary)
    .checkElementStyle(':root', '--secondary', remixIdeThemes.spacelab.secondary)
    .checkElementStyle(':root', '--success', remixIdeThemes.spacelab.success)
    .checkElementStyle(':root', '--info', remixIdeThemes.spacelab.info)
    .checkElementStyle(':root', '--warning', remixIdeThemes.spacelab.warning)
    .checkElementStyle(':root', '--danger', remixIdeThemes.spacelab.danger)
  },

  'Should load Yeti theme': function (browser) {
    browser.waitForElementVisible('*[data-id="verticalIconsKindsettings"]')
    .click('*[data-id="settingsTabThemeYeti"]')
    .pause(2000)
    .checkElementStyle(':root', '--primary', remixIdeThemes.yeti.primary)
    .checkElementStyle(':root', '--secondary', remixIdeThemes.yeti.secondary)
    .checkElementStyle(':root', '--success', remixIdeThemes.yeti.success)
    .checkElementStyle(':root', '--info', remixIdeThemes.yeti.info)
    .checkElementStyle(':root', '--warning', remixIdeThemes.yeti.warning)
    .checkElementStyle(':root', '--danger', remixIdeThemes.yeti.danger)
  },

  'Should load Cyborg theme': function (browser) {
    browser.waitForElementVisible('*[data-id="verticalIconsKindsettings"]')
    .click('*[data-id="settingsTabThemeCyborg"]')
    .pause(2000)
    .checkElementStyle(':root', '--primary', remixIdeThemes.cyborg.primary)
    .checkElementStyle(':root', '--secondary', remixIdeThemes.cyborg.secondary)
    .checkElementStyle(':root', '--success', remixIdeThemes.cyborg.success)
    .checkElementStyle(':root', '--info', remixIdeThemes.cyborg.info)
    .checkElementStyle(':root', '--warning', remixIdeThemes.cyborg.warning)
    .checkElementStyle(':root', '--danger', remixIdeThemes.cyborg.danger)
  },

  'Should load Darkly theme': function (browser) {
    browser.waitForElementVisible('*[data-id="verticalIconsKindsettings"]')
    .click('*[data-id="settingsTabThemeDarkly"]')
    .pause(2000)
    .checkElementStyle(':root', '--primary', remixIdeThemes.darkly.primary)
    .checkElementStyle(':root', '--secondary', remixIdeThemes.darkly.secondary)
    .checkElementStyle(':root', '--success', remixIdeThemes.darkly.success)
    .checkElementStyle(':root', '--info', remixIdeThemes.darkly.info)
    .checkElementStyle(':root', '--warning', remixIdeThemes.darkly.warning)
    .checkElementStyle(':root', '--danger', remixIdeThemes.darkly.danger)
  },

  'Should load Slate theme': function (browser) {
    browser.waitForElementVisible('*[data-id="verticalIconsKindsettings"]')
    .click('*[data-id="settingsTabThemeSlate"]')
    .pause(2000)
    .checkElementStyle(':root', '--primary', remixIdeThemes.slate.primary)
    .checkElementStyle(':root', '--secondary', remixIdeThemes.slate.secondary)
    .checkElementStyle(':root', '--success', remixIdeThemes.slate.success)
    .checkElementStyle(':root', '--info', remixIdeThemes.slate.info)
    .checkElementStyle(':root', '--warning', remixIdeThemes.slate.warning)
    .checkElementStyle(':root', '--danger', remixIdeThemes.slate.danger)
  },

  'Should load Superhero theme': function (browser) {
    browser.waitForElementVisible('*[data-id="verticalIconsKindsettings"]')
    .click('*[data-id="settingsTabThemeSuperhero"]')
    .pause(2000)
    .checkElementStyle(':root', '--primary', remixIdeThemes.superhero.primary)
    .checkElementStyle(':root', '--secondary', remixIdeThemes.superhero.secondary)
    .checkElementStyle(':root', '--success', remixIdeThemes.superhero.success)
    .checkElementStyle(':root', '--info', remixIdeThemes.superhero.info)
    .checkElementStyle(':root', '--warning', remixIdeThemes.superhero.warning)
    .checkElementStyle(':root', '--danger', remixIdeThemes.superhero.danger)
    .end()
  },

  tearDown: sauce
}

var remixIdeThemes = {
  dark: {
    primary: '#007aa6',
    secondary: '#595c76',
    success: '#32ba89',
    info: '#086CB5',
    warning: '#c97539',
    danger: '#b84040'
  },
  light: {
    primary: '#007aa6',
    secondary: '#a8b3bc',
    success: '#32ba89',
    info: '#007aa6',
    warning: '#c97539',
    danger: '#b84040'
  },
  curelean: {
    primary: '#2FA4E7',
    secondary: '#e9ecef',
    success: '#73A839',
    info: '#033C73',
    warning: '#DD5600',
    danger: '#C71C22'
  },
  flatly: {
    primary: '#2C3E50',
    secondary: '#95a5a6',
    success: '#18BC9C',
    info: '#3498DB',
    warning: '#F39C12',
    danger: '#E74C3C'
  },
  lumen: {
    primary: '#158CBA',
    secondary: '#f0f0f0',
    success: '#28B62C',
    info: '#75CAEB',
    warning: '#FF851B',
    danger: '#FF4136'
  },
  minty: {
    primary: '#78C2AD',
    secondary: '#F3969A',
    success: '#56CC9D',
    info: '#6CC3D5',
    warning: '#FFCE67',
    danger: '#FF7851'
  },
  pulse: {
    primary: '#593196',
    secondary: '#A991D4',
    success: '#13B955',
    info: '#009CDC',
    warning: '#EFA31D',
    danger: '#FC3939'
  },
  sandstone: {
    primary: '#325D88',
    secondary: '#8E8C84',
    success: '#93C54B',
    info: '#29ABE0',
    warning: '#F47C3C',
    danger: '#d9534f'
  },
  spacelab: {
    primary: '#446E9B',
    secondary: '#999',
    success: '#3CB521',
    info: '#3399F3',
    warning: '#D47500',
    danger: '#CD0200'
  },
  yeti: {
    primary: '#008cba',
    secondary: '#eee',
    success: '#43ac6a',
    info: '#5bc0de',
    warning: '#E99002',
    danger: '#F04124'
  },
  cyborg: {
    primary: '#2A9FD6',
    secondary: '#555',
    success: '#77B300',
    info: '#9933CC',
    warning: '#FF8800',
    danger: '#CC0000'
  },
  darkly: {
    primary: '#375a7f',
    secondary: '#444',
    success: '#00bc8c',
    info: '#3498DB',
    warning: '#F39C12',
    danger: '#E74C3C'
  },
  slate: {
    primary: '#3A3F44',
    secondary: '#7A8288',
    success: '#62c462',
    info: '#5bc0de',
    warning: '#f89406',
    danger: '#ee5f5b'
  },
  superhero: {
    primary: '#DF691A',
    secondary: '#4E5D6C',
    success: '#5cb85c',
    info: '#5bc0de',
    warning: '#f0ad4e',
    danger: '#d9534f'
  }
}
