'use strict'

function Storage () {
  this.exists = function (name) {
    return !!this.get(name)
  }

  this.get = function (name) {
    return window.localStorage.getItem('sol:' + name)
  }

  this.set = function (name, content) {
    window.localStorage.setItem('sol:' + name, content)
  }

  function safeKeys () {
    // NOTE: this is a workaround for some browsers
    return Object.keys(window.localStorage).filter(function (item) { return item !== null && item !== undefined })
  }

  this.keys = function () {
    return safeKeys()
      // filter any names not including sol:
      .filter(function (item) { return item.indexOf('sol:', 0) === 0 })
      // remove sol: from filename
      .map(function (item) { return item.replace(/^sol:/, '') })
  }

  this.remove = function (name) {
    window.localStorage.removeItem('sol:' + name)
  }

  this.rename = function (originalName, newName) {
    var content = this.get(originalName)
    this.set(newName, content)
    this.remove(originalName)
  }

  // on startup, upgrade the old storage layout
  safeKeys().forEach(function (name) {
    if (name.indexOf('sol-cache-file-', 0) === 0) {
      var content = window.localStorage.getItem(name)
      window.localStorage.setItem(name.replace(/^sol-cache-file-/, 'sol:'), content)
      window.localStorage.removeItem(name)
    }
  })

  // remove obsolete key
  window.localStorage.removeItem('editor-size-cache')
}

module.exports = Storage
