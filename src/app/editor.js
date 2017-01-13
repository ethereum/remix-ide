/* global FileReader */
'use strict'

var examples = require('./example-contracts')
var EventManager = require('../lib/eventManager')

var ace = require('brace')
require('../mode-solidity.js')

function Editor (doNotLoadStorage, storage) {
  var editor = ace.edit('input')
  document.getElementById('input').editor = editor // required to access the editor during tests
  var sessions = {}
  var sourceAnnotations = []
  var currentFileName

  this.event = new EventManager()

  setupStuff()

  function changeSession (fileKey) {
    editor.setSession(sessions[currentKey])
    editor.focus()
    this.event.trigger('currentSwitched', [fileKey])
  }

  function removeSession (fileKey) {
    delete sessions[fileKey]
  }

  function renameSession (oldFileKey, newFileKey) {
    if (oldFileKey !== newFileKey) {
      sessions[newFileKey] = sessions[oldFileKey]
      removeSession(oldFileKey)
    }
  }

  this.addMarker = function (range, cssClass) {
    return editor.session.addMarker(range, cssClass)
  }

  this.removeMarker = function (markerId) {
    editor.session.removeMarker(markerId)
  }

  function findNonClashingName (name) {
    var counter = ''
    while (storage.exists(name + counter)) {
      counter = (counter | 0) + 1
    }
    return name + counter
  }

  this.newFile = function () {
    currentFileName = findNonClashingName(utils.fileKey('Untitled'))
    storage.set(currentFileName, '')
    changeSession(currentFileName)
  }

  this.replaceFile = function (name, content) {
    storage.set(utils.fileKey(name), content)
  }

  this.replaceFileWithBackup = function (name, content) {
    name = utils.fileKey(name)
    if (storage.exists(name) && storage.get(name) !== content) {
      var newName = findNonClashingName(name)
      storage.rename(name, newName)
    }
    storage.set(name, content)
  }

  this.removeFile = function (name) {
    var files = this.getFileNames()
    var nextFileName = files[ Math.max(0, files.indexOf(name) - 1) ]

    storage.remove(utils.fileKey(name))
    this.removeSession(utils.fileKey(name))
    this.switchToFile(nextFileName)
  }

  this.uploadFile = function (file) {
    var fileReader = new FileReader()
    var name = file.name

    fileReader.onload = function (e) {
      storage.set(name, e.target.result)
      currentFileName = name
      changeSession(currentFileName)
    }
    fileReader.readAsText(file)
  }

  this.getCurrentFileName = function () {
    return currentFileName
  }

  this.getCurrentFileContent = function () {
    return editor.getValue()
  }

  this.saveCurrentFile = function () {
    var input = editor.getValue()
    storage.set(currentFileName, input)
  }

  this.switchToFile = function (name) {
    currentFileName = utils.fileKey(name)
    changeSession(currentFileName)
  }

  this.renameFile = function (oldName, newName) {
    storage.rename(utils.fileKey(oldName), utils.fileKey(newName))
    renameSession(utils.fileKey(oldName), utils.fileKey(newName))
  }

  this.hasFile = function (name) {
    return this.getFiles().indexOf(name) !== -1
  }

  this.getFile = function (name) {
    return storage.get(name)
  }

  function getFiles () {
    var files = []
    storage.keys().forEach(function (f) {
      // NOTE: as a temporary measure do not show the config file in the editor
      if (f !== '.browser-solidity.json') {
        files.push(f)
        if (!sessions[f]) sessions[f] = newEditorSession(f)
      }
    })
    return files
  }
  this.getFiles = getFiles

  // FIXME: merge this with the above
  this.getFileNames = function () {
    var ret = []
    this.getFiles().forEach(function (f) {
      ret.push(utils.fileNameFromKey(f))
    })
    return ret
  }

  this.packageFiles = function () {
    var files = {}
    var filesArr = this.getFiles()

    for (var f in filesArr) {
      files[filesArr[f]] = {
        content: storage.get(filesArr[f])
      }
    }
    return files
  }

  this.resize = function () {
    editor.resize()
    var session = editor.getSession()
    session.setUseWrapMode(document.querySelector('#editorWrap').checked)
    if (session.getUseWrapMode()) {
      var characterWidth = editor.renderer.characterWidth
      var contentWidth = editor.container.ownerDocument.getElementsByClassName('ace_scroller')[0].clientWidth

      if (contentWidth > 0) {
        session.setWrapLimit(parseInt(contentWidth / characterWidth, 10))
      }
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

  this.handleErrorClick = function (errLine, errCol) {
    editor.focus()
    editor.gotoLine(errLine + 1, errCol - 1, true)
  }

  function newEditorSession (filekey) {
    var s = new ace.EditSession(storage.get(filekey), 'ace/mode/javascript')
    s.setUndoManager(new ace.UndoManager())
    s.setTabSize(4)
    s.setUseSoftTabs(true)
    sessions[filekey] = s
    return s
  }

  function setupStuff () {
    // Unmap ctrl-t & ctrl-f
    editor.commands.bindKeys({ 'ctrl-t': null })
    editor.commands.bindKeys({ 'ctrl-f': null })

    function onChange() {
      this.event.trigger('currentEdited')
    }

    editor.getSession().on('change', onChange)
    editor.on('changeSession', function () {
      editor.getSession().on('change', onChange)
    })

    if (doNotLoadStorage) {
      return
    }

    var files = getFiles()

    if (files.length === 0) {
      files.push(examples.ballot.name)
      storage.set(examples.ballot.name, examples.ballot.content)
    }

    currentFileName = files[0]

    for (var x in files) {
      sessions[files[x]] = newEditorSession(files[x])
    }

    changeSession(currentFileName)
    editor.resize(true)
  }
}

module.exports = Editor
