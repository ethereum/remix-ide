'use strict'

require('babel-polyfill')
var App = require('./app.js')

var app = new App({})

document.body.appendChild(app.render())
if (window.remix) {
  window.remix.appchain = {
    contracts: {},
    helpers: {}
  }
}

app.init() // @TODO: refactor to remove
