const yo = require('yo-yo')
const csjs = require('csjs-inject')
const remixLib = require('remix-lib')

var globalRegistry = require('../../global/registry')

const styleguide = require('../ui/styles-guide/theme-chooser')
const PluginManager = require('../plugin/pluginManager')
const TabbedMenu = require('../tabs/tabbed-menu')
const CompileTab = require('../tabs/compile-tab')
const SettingsTab = require('../tabs/settings-tab')
const AnalysisTab = require('../tabs/analysis-tab')
const DebuggerTab = require('../tabs/debugger-tab')
const SupportTab = require('../tabs/support-tab')
const PluginTab = require('../tabs/plugin-tab')
const TestTab = require('../tabs/test-tab')
const RunTab = require('../tabs/run-tab')
const plugins = require('../plugin/plugins')
const DraggableContent = require('../ui/draggableContent')

var toolTip = require('../ui/tooltip')
const EventManager = remixLib.EventManager
const styles = styleguide.chooser()

module.exports = class RighthandPanel {
  constructor (localRegistry) {
    const self = this
    self._components = {}
    self._components.registry = localRegistry || globalRegistry
    self._components.registry.put({api: this, name: 'righthandpanel'})
    self.event = new EventManager()
    self._view = {
      element: null,
      tabbedMenu: null,
      tabbedMenuViewport: null,
      dragbar: null
    }

    self._deps = {
      fileProviders: self._components.registry.get('fileproviders').api,
      compiler: self._components.registry.get('compiler').api,
      udapp: self._components.registry.get('udapp').api,
      app: self._components.registry.get('app').api,
      txlistener: self._components.registry.get('txlistener').api
    }

    var tabbedMenu = new TabbedMenu(self._components.registry)

    var pluginManager = new PluginManager(
      self._deps.app,
      self._deps.compiler,
      self._deps.txlistener,
      self._deps.fileProviders,
      self._deps.udapp
   )

    var analysisTab = new AnalysisTab(self._components.registry)
    analysisTab.event.register('newStaticAnaysisWarningMessage', (msg, settings) => { self._components.compile.addWarning(msg, settings) })

    self._components.debuggerTab = new DebuggerTab(self._components.registry)

    self._components = {
      pluginManager: pluginManager,
      tabbedMenu: tabbedMenu,
      compile: new CompileTab(self._components.registry),
      run: new RunTab(self._components.registry),
      settings: new SettingsTab(self._components.registry),
      analysis: analysisTab,
      debug: self._components.debuggerTab,
      support: new SupportTab(self._components.registry),
      test: new TestTab(self._components.registry)
    }

    self.event.register('plugin-loadRequest', json => {
      self.loadPlugin(json)
    })

    self.event.register('plugin-name-loadRequest', name => {
      var plugin = plugins[name]
      if (plugin) {
        if (!self._components.pluginManager.plugins[plugin.title]) {
          self.loadPlugin(plugin)
        } else {
          toolTip(name + ' already loaded')
        }
      } else {
        toolTip('unknown plugin ' + name)
      }
    })

    self.loadPlugin = function (json) {
      var modal = new DraggableContent(() => {
        self._components.pluginManager.unregister(json)
      })
      var tab = new PluginTab(json)
      var content = tab.render()
      document.querySelector('body').appendChild(modal.render(json.title, content))
      self._components.pluginManager.register(json, modal, content)
    }

    self._view.dragbar = yo`<div id="dragbar" class=${css.dragbar}></div>`
    self._view.element = yo`
      <div id="righthand-panel" class=${css.righthandpanel}>
        ${self._view.dragbar}
        <div id="header" class=${css.header}>
          ${self._components.tabbedMenu.render()}
          ${self._components.tabbedMenu.renderViewport()}
        </div>
      </div>`

    const { compile, run, settings, analysis, debug, support, test } = self._components
    self._components.tabbedMenu.addTab('Compile', 'compileView', compile.render())
    self._components.tabbedMenu.addTab('Run', 'runView', run.render())
    self._components.tabbedMenu.addTab('Analysis', 'staticanalysisView', analysis.render())
    self._components.tabbedMenu.addTab('Testing', 'testView', test.render())
    self._components.tabbedMenu.addTab('Debugger', 'debugView', debug.render())
    self._components.tabbedMenu.addTab('Settings', 'settingsView', settings.render())
    self._components.tabbedMenu.addTab('Support', 'supportView', support.render())
    self._components.tabbedMenu.selectTabByTitle('Compile')
  }
  // showDebugger () {
  //   const self = this
  //   if (!self._components.tabbedMenu) return
  //   self._components.tabbedMenu.selectTab(self._view.el.querySelector('li.debugView'))
  // }
  render () {
    const self = this
    if (self._view.element) return self._view.element
    return self._view.element
  }

  debugger () {
    return this._components.debug.debugger()
  }

  focusOn (x) {
    if (this._components.tabbedMenu) this._components.tabbedMenu.selectTabByClassName(x)
  }

  init () {
    // @TODO: init is for resizable drag bar only and should be refactored in the future
    const self = this
    const limit = 60
    self._view.dragbar.addEventListener('mousedown', mousedown)
    const ghostbar = yo`<div class=${css.ghostbar}></div>`
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
      const lhp = window['filepanel'].offsetWidth
      const max = document.body.offsetWidth - limit
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

const css = csjs`
  .righthandpanel      {
    display            : flex;
    flex-direction     : column;
    top                : 0;
    right              : 0;
    bottom             : 0;
    box-sizing         : border-box;
    overflow           : hidden;
    height             : 100%;
  }
  .header              {
    height             : 100%;
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
`
