'use strict'

var EventManager = require('ethereum-remix').lib.EventManager
var yo = require('yo-yo')
var csjs = require('csjs-inject')
var ace = require('brace')
var Range = ace.acequire('ace/range').Range
require('./mode-solidity.js')

var css = csjs`
  .ace-editor {
    width     : 100%;
  }
`
document.head.appendChild(yo`
  <style>
    .ace-tm .ace_gutter,
    .ace-tm .ace_gutter-active-line,
    .ace-tm .ace_marker-layer .ace_active-line {
        background-color: rgba(225, 229, 251, 0.5);
    }
  </style>
`)

function Editor (opts = {}) {
  var self = this
  var el = yo`<div id="input"></div>`
  var editor = ace.edit(el)
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

  this.setPosition = function (line, column, noClip) {
    editor.moveCursorTo(line, column)
    //var anchor = new ace.Anchor(editor, line, column)
    //anchor.setPosition(line, column, noClip)
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
    var s = new ace.EditSession(content, 'ace/mode/javascript')
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

  this.get = function (path) {
    if (currentSession === path) {
      return editor.getValue()
    }
  }

  this.current = function (path) {
    if (editor.getSession() === emptySession) {
      return
    }
    return currentSession
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

  // Do setup on initialisation here
  editor.on('changeSession', function () {
    event.trigger('sessionSwitched', [])

    editor.getSession().on('change', function () {
      event.trigger('contentChanged', [])
    })
  })

  // Unmap ctrl-t & ctrl-f
  editor.commands.bindKeys({ 'ctrl-t': null })
  editor.commands.bindKeys({ 'ctrl-f': null })

  editor.resize(true)
}

module.exports = Editor
