var yo = require('yo-yo')
var $ = require('jquery')

var tabbedMenu = require('./tabbed-menu')
var contractTab = require('./contract-tab')
var settingsTab = require('./settings-tab')
var analysisTab = require('./analysis-tab')
var debuggerTab = require('./debugger-tab')
var filesTab = require('./files-tab')

var csjs = require('csjs-inject')

var css = csjs`
  .options {
      float: left;
      padding: 0.7em 0.3em;
      min-width: 65px;
      font-size: 0.9em;
      cursor: pointer;
      background-color: transparent;
      margin-right: 0.5em;
      font-size: 1em;
  }
`

// ------------------------------------------------------------------

module.exports = RighthandPanel

function RighthandPanel (container, appAPI, events, opts) {
  var optionViews = yo`<div id="optionViews" class="settingsView"></div>`
  var element = yo`
    <div id="header">
        <div id="menu">
          <img id="solIcon" title="Solidity realtime compiler and runtime" src="assets/img/remix_logo_512x512.svg" alt="Solidity realtime compiler and runtime">
          <ul id="options">
            <li class="envView" title="Environment">Contract</li>
            <li class="settingsView" title="Settings">Settings</li>
            <li class="publishView" title="Publish" >Files</li>
            <li class="debugView" title="Debugger">Debugger</li>
            <li class="staticanalysisView" title="Static Analysis">Analysis</li>
            <li id="helpButton"><a href="https://remix.readthedocs.org" target="_blank" title="Open Documentation">Docs</a></li>
          </ul>
        </div>
        ${optionViews}
      </div>
  `
  contractTab(optionViews, appAPI, events, opts)
  settingsTab(optionViews, appAPI, events, opts)
  analysisTab(optionViews, appAPI, events, opts)
  debuggerTab(optionViews, appAPI, events, opts)
  filesTab(optionViews, appAPI, events, opts)
  container.appendChild(element)

  ;[...container.querySelectorAll('#header #options li')].forEach((el) => { el.classList.add(css.options) })

  // ----------------- toggle right hand panel -----------------

  var hidingRHP = false
  $('.toggleRHP').click(function () {
    hidingRHP = !hidingRHP
    $('.toggleRHP i').toggleClass('fa-angle-double-right', !hidingRHP)
    $('.toggleRHP i').toggleClass('fa-angle-double-left', hidingRHP)
  })

  // ----------------- tabbed menu -----------------
  var tabbedMenuAPI = {
    warnCompilerLoading: appAPI.warnCompilerLoading
  }
  // load tabbed menu component
  var tabContainer // @TODO
  var tabEvents = {compiler: events.compiler, app: events.app}
  tabbedMenu(tabContainer, tabbedMenuAPI, tabEvents, {})
}
