'use strict'

var CONFIG_FILE = '.remix.config'

function Config (storage) {
  this.items = {}
  this.unpersistedItems = {}

  // load on instantiation
  try {
    var config = storage.get(CONFIG_FILE)
    if (config) {
      this.items = JSON.parse(config)
    }
  } catch (exception) {
  }

  this.exists = function (key) {
    return this.items[key] !== undefined
  }

  this.get = function (key) {
    return this.items[key]
  }

  this.set = function (key, content) {
    this.items[key] = content
    try {
      storage.set(CONFIG_FILE, JSON.stringify(this.items))
    } catch (exception) {
    }
  }

  this.getUnpersistedProperty = function (key) {
    return this.unpersistedItems[key]
  }

  this.setUnpersistedProperty = function (key, value) {
    this.unpersistedItems[key] = value
  }
}

module.exports = Config
