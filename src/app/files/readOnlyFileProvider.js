'use strict'
var EventManager = require('../../lib/events')

var URL = URL || window.URL
const readOnlyFileProviderType = 'external'
class ReadOnlyFileProvider {
  constructor () {
    this.event = new EventManager()
    this.files = {}
    this.paths = {}
    this.normalizedNames = {} // contains the raw url associated with the displayed path
    this.type = readOnlyFileProviderType
    this.readonly = true
  }

  close (cb) {
    this.files = {}
    cb()
  }

  init (cb) {
    this.files = {}
  }

  exists (path, cb) {
    if (!this.files) return cb(null, false)
    var unprefixedPath = this.removePrefix(path)
    cb(null, this.files[unprefixedPath] !== undefined)
  }

  get (path, cb) {
    path = this.removePrefix(path)
    if (this.normalizedNames[path]) path = this.normalizedNames[path] // ensure we actually use the normalized path from here
    var content = this.files[path]
    if (!content) {
      content = this.files[this.normalizedNames[path]]
    }
    if (cb) {
      cb(null, content)
    }
    return content
  }

  set (path, content, cb) {
    path = this.removePrefix(path)
    this.addReadOnly(path, content)
    if (cb) cb()
    return true
  }

  addReadOnly (path, content, rawPath, provider) {
    provider = provider || 'http'

    // we really care about slashes for internal consistency
    // so we gather as much as we can from the raw url we got
    var recoveredSlashesPath = path.replace(/%2F/gi, '/') // global, ignore case
    var schemalessPath = this.removeHTTPScheme(recoveredSlashesPath)
    var procuredPath = provider + '/' + schemalessPath

    try { // lazy try to format JSON
      content = JSON.stringify(JSON.parse(content), null, '\t')
    } catch (e) {}
    if (!rawPath) rawPath = path
    // splitting off the path in a tree structure, the json tree is used in `resolveDirectory`
    var split = procuredPath
    var folder = false
    while (split.lastIndexOf('/') !== -1) {
      var subitem = split.substring(split.lastIndexOf('/'))
      split = split.substring(0, split.lastIndexOf('/'))
      if (!this.paths[this.type + '/' + split]) {
        this.paths[this.type + '/' + split] = {}
      }
      this.paths[this.type + '/' + split][split + subitem] = { isDirectory: folder }
      folder = true
    }
    if (!this.paths[this.type]) this.paths[this.type] = {} // ensure this exists, because other functions determine root by checking for this.type
    this.paths[this.type][split] = { isDirectory: folder }
    this.files[procuredPath] = content
    this.normalizedNames[rawPath] = procuredPath
    this.event.trigger('fileAdded', [procuredPath, true])
    return true
  }

  isReadOnly (path) {
    return true
  }

  remove (path) {
  }

  rename (oldPath, newPath, isFolder) {
    return true
  }

  list () {
    return this.files
  }

  resolveDirectory (path, callback) {
    var self = this
    if (path[0] === '/') path = path.substring(1)
    if (!path) return callback(null, { [self.type]: { } })
    // we just return the json tree populated by `addReadOnly`
    callback(null, this.paths[path])
  }

  removePrefix (path) {
    return path.indexOf(this.type + '/') === 0 ? path.replace(this.type + '/', '') : path
  }

  removeHTTPScheme (path) {
    const httpScheme = /https?:\/\//
    return httpScheme.exec(path) ? path.replace(httpScheme, '') : path
  }
}

module.exports = ReadOnlyFileProvider
