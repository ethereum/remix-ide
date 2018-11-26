/* global chrome */
'use strict'
var EventManager = require('remix-lib').EventManager

module.exports = class Muon {
  constructor (type, path) {
    this.event = new EventManager()
    path = path || type
    this.key = 'folder_' + path
    this.type = type
    this.error = { 'EEXIST': 'File already exists' }
    this._readOnlyFiles = {}
    this._readOnlyMode = false
    this.filesContent = {}
    this.files = {}
    this.callbacksMap = {}
    if (typeof chrome !== 'undefined' && chrome.ipcRenderer) {
      chrome.ipcRenderer.on(this.key, (event, args) => {
        this.callbacksMap[args.id](args.error, args.result)
        delete this.callbacksMap[args.id]
      })
    }
  }

  isConnected () {
    return chrome && chrome.ipcRenderer
  }

  close (cb) {
    cb()
  }

  _registerCallBack (cb) {
    var id = new Date().getTime()
    this.callbacksMap[id] = cb
    return id
  }

  init (cb) {
    var id = this._registerCallBack((error, result) => {
      this._readOnlyMode = result
      cb(error)
    })
    chrome.ipcRenderer.send(this.key, { targetFunction: 'folderIsReadOnly', id })
  }

  exists (path, cb) {
    var unprefixedpath = this.removePrefix(path)
    var id = this._registerCallBack((error, result) => {
      cb(error, result)
    })
    chrome.ipcRenderer.send(this.key, { targetFunction: 'exists', id, payload: {path: unprefixedpath} })
  }

  get (path, cb) {
    var unprefixedpath = this.removePrefix(path)
    var id = this._registerCallBack((error, file) => {
      if (!error) {
        this.filesContent[path] = file.content
        if (file.readonly) { this._readOnlyFiles[path] = 1 }
        cb(error, file.content)
      } else {
        // display the last known content.
        // TODO should perhaps better warn the user that the file is not synced.
        cb(null, this.filesContent[path])
      }
    })
    chrome.ipcRenderer.send(this.key, { targetFunction: 'get', id, payload: {path: unprefixedpath} })
  }

  set (path, content, cb) {
    var unprefixedpath = this.removePrefix(path)
    var id = this._registerCallBack((error, result) => {
      if (cb) return cb(error, result)
      var path = this.type + '/' + unprefixedpath
      this.event.trigger('fileChanged', [path])
    })
    chrome.ipcRenderer.send(this.key, { targetFunction: 'set', id, payload: {path: unprefixedpath, content: content} })
    return true
  }

  addReadOnly (path, content) {
    return false
  }

  isReadOnly (path) {
    return this._readOnlyMode || this._readOnlyFiles[path] === 1
  }

  remove (path) {
    var unprefixedpath = this.removePrefix(path)
    var id = this._registerCallBack((error) => {
      if (error) console.log(error)
      var path = this.type + '/' + unprefixedpath
      delete this.filesContent[path]
      this.init(() => {
        this.event.trigger('fileRemoved', [path])
      })
    })
    chrome.ipcRenderer.send(this.key, { targetFunction: 'remove', id, payload: {path: unprefixedpath} })
  }

  rename (oldPath, newPath, isFolder) {
    var unprefixedoldPath = this.removePrefix(oldPath)
    var unprefixednewPath = this.removePrefix(newPath)
    var id = this._registerCallBack((error) => {
      if (error) {
        console.log(error)
        if (this.error[error.code]) error = this.error[error.code]
        this.event.trigger('fileRenamedError', [this.error[error.code]])
      } else {
        var newPath = this.type + '/' + unprefixednewPath
        var oldPath = this.type + '/' + unprefixedoldPath
        this.filesContent[newPath] = this.filesContent[oldPath]
        delete this.filesContent[oldPath]
        this.init(() => {
          this.event.trigger('fileRenamed', [oldPath, newPath, isFolder])
        })
      }
    })
    chrome.ipcRenderer.send(this.key, { targetFunction: 'remove', id, payload: {oldPath: unprefixedoldPath, newPath: unprefixednewPath} })
    return true
  }

  removePrefix (path) {
    path = path.indexOf(this.type) === 0 ? path.replace(this.type, '') : path
    if (path[0] === '/') return path.substring(1)
    return path
  }

  resolveDirectory (path, callback) {
    var self = this
    if (path[0] === '/') path = path.substring(1)
    if (!path) return callback(null, { [self.type]: { } })

    var id = this._registerCallBack((error, result) => {
      callback(error, result)
    })
    path = self.removePrefix(path)
    chrome.ipcRenderer.send(this.key, { targetFunction: 'resolveDirectory', id, payload: {path: path} })
  }
}
