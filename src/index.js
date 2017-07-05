'use strict'
require('babel-polyfill')

require('./app/style-base')

var app = require('./app.js')

document.body.appendChild(app.render())
app.init()
