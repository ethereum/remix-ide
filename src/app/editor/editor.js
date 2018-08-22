'use strict'
var remixLib = require('remix-lib')
var EventManager = remixLib.EventManager
var yo = require('yo-yo')
var csjs = require('csjs-inject')
var ace = require('brace')

require('brace/theme/tomorrow_night_blue')

var globalRegistry = require('../../global/registry')

var Range = ace.acequire('ace/range').Range
require('brace/ext/language_tools')
require('brace/ext/searchbox')
var langTools = ace.acequire('ace/ext/language_tools')
require('ace-mode-solidity/build/remix-ide/mode-solidity')
var styleGuide = require('../ui/styles-guide/theme-chooser')
var styles = styleGuide.chooser()

function setTheme (cb) {
  if (styles.appProperties.aceTheme) {
    cb('brace/theme/', styles.appProperties.aceTheme)
  }
}

setTheme((path, theme) => {
  require('brace/theme/tomorrow_night_blue')
})

var css = csjs`
  .ace-editor {
    background-color  : ${styles.editor.backgroundColor_Editor};
    width     : 100%;
  }
`
document.head.appendChild(yo`
  <style>
    .ace-tm .ace_gutter,
    .ace-tm .ace_gutter-active-line,
    .ace-tm .ace_marker-layer .ace_active-line {
        background-color: ${styles.editor.backgroundColor_Tabs_Highlights};
    }
    .ace_gutter-cell.ace_breakpoint{
      background-color: ${styles.editor.backgroundColor_DebuggerMode};
    }
    .highlightreference {
      position:absolute;
      z-index:20;
      background-color: ${styles.editor.backgroundColor_Editor_Context_Highlights};
      opacity: 0.7
    }

    .highlightreferenceline {
      position:absolute;
      z-index:20;
      background-color: ${styles.editor.backgroundColor_Editor_Context_Highlights};
      opacity: 0.7
    }

    .highlightcode {
      position:absolute;
      z-index:20;
      background-color: ${styles.editor.backgroundColor_Editor_Context_Error_Highlights};
     }
  </style>
`)

function Editor (opts = {}, localRegistry) {
  var self = this
  var el = yo`<div id="input"></div>`
  var editor = ace.edit(el)
  if (styles.appProperties.aceTheme) {
    editor.setTheme('ace/theme/' + styles.appProperties.aceTheme)
  }
  self._components = {}
  self._components.registry = localRegistry || globalRegistry
  self._deps = {
    fileManager: self._components.registry.get('filemanager').api,
    config: self._components.registry.get('config').api
  }

  ace.acequire('ace/ext/language_tools')
  editor.setOptions({
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true
  })
  var flowCompleter = {
    getCompletions: function (editor, session, pos, prefix, callback) {
      // @TODO add here other propositions
    }
  }
  langTools.addCompleter(flowCompleter)
  el.className += ' ' + css['ace-editor']
  el.editor = editor // required to access the editor during tests
  self.render = function () { return el }
  var event = new EventManager()
  self.event = event
  var sessions = {}
  var sourceAnnotations = []
  var readOnlySessions = {}
  var currentSession

  var emptySession = createSession('')

  editor.on('guttermousedown', function (e) {
    var target = e.domEvent.target
    if (target.className.indexOf('ace_gutter-cell') === -1) {
      return
    }
    var row = e.getDocumentPosition().row
    var breakpoints = e.editor.session.getBreakpoints()
    for (var k in breakpoints) {
      if (k === row.toString()) {
        event.trigger('breakpointCleared', [currentSession, row])
        e.editor.session.clearBreakpoint(row)
        e.stop()
        return
      }
    }
    self.setBreakpoint(row)
    event.trigger('breakpointAdded', [currentSession, row])
    e.stop()
  })

  this.displayEmptyReadOnlySession = function () {
    currentSession = null
    editor.setSession(emptySession)
    editor.setReadOnly(true)
  }

  this.setBreakpoint = function (row, css) {
    editor.session.setBreakpoint(row, css)
  }

  this.editorFontSize = function (incr) {
    editor.setFontSize(editor.getFontSize() + incr)
  }

  this.setText = function (text) {
    if (currentSession && sessions[currentSession]) {
      sessions[currentSession].setValue(text)
    }
  }

  function createSession (content) {
    var s = new ace.EditSession(content, 'ace/mode/solidity')
    s.setUndoManager(new ace.UndoManager())
    s.setTabSize(4)
    s.setUseSoftTabs(true)
    return s
  }

  function switchSession (path) {
    currentSession = path
    editor.setSession(sessions[currentSession])
    editor.setReadOnly(readOnlySessions[currentSession])
    editor.focus()
  }

  this.open = function (path, content) {
    if (!sessions[path]) {
      var session = createSession(content)
      sessions[path] = session
      readOnlySessions[path] = false
    } else if (sessions[path].getValue() !== content) {
      sessions[path].setValue(content)
    }
    switchSession(path)
  }

  this.openReadOnly = function (path, content) {
    if (!sessions[path]) {
      var session = createSession(content)
      sessions[path] = session
      readOnlySessions[path] = true
    }
    switchSession(path)
  }

  /**
    * returns the content of the current session
    *
    * @return {String} content of the file referenced by @arg path
    */
  this.currentContent = function () {
    return this.get(this.current())
  }

  /**
    * returns the content of the session targeted by @arg path
    * if @arg path is null, the content of the current session is returned
    *
    * @return {String} content of the file referenced by @arg path
    */
  this.get = function (path) {
    if (!path || currentSession === path) {
      return editor.getValue()
    } else if (sessions[path]) {
      return sessions[path].getValue()
    }
  }

  /**
    * returns the path of the currently editing file
    * returns `undefined` if no session is being editer
    *
    * @return {String} path of the current session
    */
  this.current = function () {
    if (editor.getSession() === emptySession) {
      return
    }
    return currentSession
  }

  this.getCursorPosition = function () {
    return editor.session.doc.positionToIndex(editor.getCursorPosition(), 0)
  }

  this.discardCurrentSession = function () {
    if (sessions[currentSession]) {
      delete sessions[currentSession]
      currentSession = null
    }
  }

  this.discard = function (path) {
    if (currentSession !== path) {
      delete sessions[path]
    }
  }

  this.resize = function (useWrapMode) {
    editor.resize()
    var session = editor.getSession()
    session.setUseWrapMode(useWrapMode)
    if (session.getUseWrapMode()) {
      var characterWidth = editor.renderer.characterWidth
      var contentWidth = editor.container.ownerDocument.getElementsByClassName('ace_scroller')[0].clientWidth

      if (contentWidth > 0) {
        session.setWrapLimit(parseInt(contentWidth / characterWidth, 10))
      }
    }
  }

  this.addMarker = function (lineColumnPos, source, cssClass) {
    var currentRange = new Range(lineColumnPos.start.line, lineColumnPos.start.column, lineColumnPos.end.line, lineColumnPos.end.column)
    if (sessions[source]) {
      return sessions[source].addMarker(currentRange, cssClass)
    }
    return null
  }

  this.scrollToLine = function (line, center, animate, callback) {
    editor.scrollToLine(line, center, animate, callback)
  }

  this.removeMarker = function (markerId, source) {
    if (sessions[source]) {
      sessions[source].removeMarker(markerId)
    }
  }

  this.clearAnnotations = function () {
    sourceAnnotations = []
    editor.getSession().clearAnnotations()
  }

  this.addAnnotation = function (annotation) {
    sourceAnnotations[sourceAnnotations.length] = annotation
    this.setAnnotations(sourceAnnotations)
  }

  this.setAnnotations = function (sourceAnnotations) {
    editor.getSession().setAnnotations(sourceAnnotations)
  }

  this.gotoLine = function (line, col) {
    editor.focus()
    editor.gotoLine(line + 1, col - 1, true)
  }

  this.find = (string) => editor.find(string)

  this.previousInput = ''
  this.saveTimeout = null
  // Do setup on initialisation here
  editor.on('changeSession', function () {
    editorOnChange(self)
    event.trigger('sessionSwitched', [])

    editor.getSession().on('change', function () {
      editorOnChange(self)
      event.trigger('contentChanged', [])
    })
  })

  // Unmap ctrl-t & ctrl-f
  editor.commands.bindKeys({ 'ctrl-t': null })

  editor.resize(true)
}

function editorOnChange (self) {
  var currentFile = self._deps.config.get('currentFile')
  if (!currentFile) {
    return
  }
  var input = self.get(currentFile)
  if (!input) {
    return
  }
  // if there's no change, don't do anything
  if (input === self.previousInput) {
    return
  }
  self.previousInput = input

  // fire storage update
  // NOTE: save at most once per 5 seconds
  if (self.saveTimeout) {
    window.clearTimeout(self.saveTimeout)
  }
  self.saveTimeout = window.setTimeout(() => {
    self._deps.fileManager.saveCurrentFile()
  }, 5000)
}

module.exports = Editor
