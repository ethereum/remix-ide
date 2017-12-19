var yo = require('yo-yo')
var remixLib = require('remix-lib')
var EventManager = remixLib.EventManager
var TabbedMenu = require('../tabs/tabbed-menu')
var compileTab = require('../tabs/compile-tab')
var runTab = require('../tabs/run-tab')
var settingsTab = require('../tabs/settings-tab')
var analysisTab = require('../tabs/analysis-tab')
var debuggerTab = require('../tabs/debugger-tab')
var supportTab = require('../tabs/support-tab')
var pluginTab = require('../tabs/plugin-tab')
var PluginManager = require('../../pluginManager')

// -------------- styling ----------------------
var csjs = require('csjs-inject')
var styleGuide = remixLib.ui.styleGuide
var styles = styleGuide()

var css = csjs`
  #righthand-panel {
    display: flex;
    flex-direction: column;
    top: 0;
    right: 0;
    bottom: 0;
    box-sizing: border-box;
    overflow: hidden;
  }
  #optionViews {
    background-color: ${styles.rightPanel.backgroundColor_Tab};
    overflow: scroll;
    height: 100%;
  }
  #optionViews > div {
    display: none;
  }
  #optionViews .pre {
    word-wrap: break-word;
    background-color: ${styles.rightPanel.BackgroundColor_Pre};
    border-radius: 3px;
    display: inline-block;
    padding: 0 0.6em;
  }
  #optionViews .hide {
    display: none;
  }
  a {
    color: ${styles.rightPanel.text_link};
  }
  .menu {
    display: flex;
    background-color: ${styles.rightPanel.BackgroundColor_Pre};
  }
  .options {
    float: left;
    padding-top: 0.7em;
    min-width: 60px;
    font-size: 0.9em;
    cursor: pointer;
    font-size: 1em;
    text-align: center;
  }
  .opts {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .opts_li {
    display: block;
    font-weight: bold;
    color: ${styles.rightPanel.text_Teriary};
  }
  .opts_li.active {
    color: ${styles.rightPanel.text_Primary};
  }
  .opts_li:hover {
    color: ${styles.rightPanel.icon_HoverColor_TogglePanel};
  }
  .dragbar             {
    position           : absolute;
    width              : 0.5em;
    top                : 3em;
    bottom             : 0;
    cursor             : col-resize;
    z-index            : 999;
    border-left        : 2px solid ${styles.rightPanel.bar_Dragging};
  }
  .ghostbar           {
    width             : 3px;
    background-color  : ${styles.rightPanel.bar_Ghost};
    opacity           : 0.5;
    position          : absolute;
    cursor            : col-resize;
    z-index           : 9999;
    top               : 0;
    bottom            : 0;
  }
  .panel              {
    height            : 100%;
  }
  .header             {
    height            : 100%;
  }
  .solIcon {
    margin-left: 10px;
    margin-right: 30px;
    display: flex;
    align-self: center;
    height: 29px;
    width: 20px;
    background-color: ${styles.colors.transparent};
  }
`

// ------------------------------------------------------------------

module.exports = RighthandPanel

function RighthandPanel (appAPI, events, opts) {
  var self = this
  self._api = appAPI
  self.event = new EventManager()
  self._view = {}

  var optionViews = yo`<div id="optionViews"></div>`
  var options = yo`
    <ul class=${css.opts}>
    </ul>
  `
  self._view.dragbar = yo`<div id="dragbar" class=${css.dragbar}></div>`
  self._view.element = yo`
    <div id="righthand-panel" class=${css.panel}>
      ${self._view.dragbar}
      <div id="header" class=${css.header}>
        <div class=${css.menu}>
          ${options}
        </div>
        ${optionViews}
      </div>
    </div>
  `
  appAPI.switchTab = (tabClass) => {
    this.event.trigger('switchTab', [tabClass])
  }

  // load tabbed menu component
  var tabEvents = {compiler: events.compiler, app: events.app, rhp: self.event}
  self._view.tabbedMenu = new TabbedMenu(options, {}, tabEvents, {})

  events.rhp = self.event

  this._view.tabbedMenu.addTab('Compile', 'compileView', compileTab(optionViews, appAPI, events, opts))
  this._view.tabbedMenu.addTab('Run', 'runView', runTab(optionViews, appAPI, events, opts))
  this._view.tabbedMenu.addTab('Settings', 'settingsView', settingsTab(optionViews, appAPI, events, opts))
  this._view.tabbedMenu.addTab('Analysis', 'staticanalysisView', analysisTab(optionViews, appAPI, events, opts))
  this._view.tabbedMenu.addTab('Debugger', 'debugView', debuggerTab(optionViews, appAPI, events, opts))
  this._view.tabbedMenu.addTab('Support', 'supportView', supportTab(optionViews, appAPI, events, opts))
  this._view.tabbedMenu.selectTabByTitle('Compile')

  self.pluginManager = new PluginManager(appAPI, events)
  events.rhp.register('plugin-loadRequest', (json) => {
    var content = pluginTab(optionViews, {}, {}, {}, json.url)
    this._view.tabbedMenu.addTab(json.title, 'plugin', content)
    self.pluginManager.register(json, content)
  })

  self.render = function () { return self._view.element }

  self.init = function () {
    // ----------------- resizeable ui ---------------
    var limit = 60
    self._view.dragbar.addEventListener('mousedown', mousedown)
    var ghostbar = yo`<div class=${css.ghostbar}></div>`
    function mousedown (event) {
      event.preventDefault()
      if (event.which === 1) {
        moveGhostbar(event)
        document.body.appendChild(ghostbar)
        document.addEventListener('mousemove', moveGhostbar)
        document.addEventListener('mouseup', removeGhostbar)
        document.addEventListener('keydown', cancelGhostbar)
      }
    }
    function cancelGhostbar (event) {
      if (event.keyCode === 27) {
        document.body.removeChild(ghostbar)
        document.removeEventListener('mousemove', moveGhostbar)
        document.removeEventListener('mouseup', removeGhostbar)
        document.removeEventListener('keydown', cancelGhostbar)
      }
    }
    function getPosition (event) {
      var lhp = window['filepanel'].offsetWidth
      var max = document.body.offsetWidth - limit
      var newpos = (event.pageX > max) ? max : event.pageX
      newpos = (newpos > (lhp + limit)) ? newpos : lhp + limit
      return newpos
    }
    function moveGhostbar (event) { // @NOTE VERTICAL ghostbar
      ghostbar.style.left = getPosition(event) + 'px'
    }
    function removeGhostbar (event) {
      document.body.removeChild(ghostbar)
      document.removeEventListener('mousemove', moveGhostbar)
      document.removeEventListener('mouseup', removeGhostbar)
      document.removeEventListener('keydown', cancelGhostbar)
      self.event.trigger('resize', [document.body.offsetWidth - getPosition(event)])
    }
  }
}
