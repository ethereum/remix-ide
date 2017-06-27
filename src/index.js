'use strict'
require('babel-polyfill')

require('./app/style-base')

var App = require('./app.js')

var app = new App({})

document.body.appendChild(app.render())
