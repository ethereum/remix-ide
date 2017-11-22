'use strict'

var solc = require('solc/wrapper')
var compilerInput = require('./compiler-input')

var compileJSON = function () { return '' }
var missingInputs = []

module.exports = function (self) {
  self.addEventListener('message', function (e) {
    var data = e.data
    switch (data.cmd) {
      case 'loadVersion':
        delete self.Module
        // NOTE: workaround some browsers?
        self.Module = undefined

        compileJSON = null

        self.importScripts(data.data)

        var compiler = solc(self.Module)

        compileJSON = function (input) {
          try {
<<<<<<< HEAD
            var inputStandard = compilerInput(JSON.parse(input), {optimize: optimize})
            return compiler.compileStandardWrapper(inputStandard, function (path) {
=======
            return compiler.compileStandardWrapper(input, function (path) {
>>>>>>> 57a496aa1f3a3f66c485f84651dbac671d0f6225
              missingInputs.push(path)
              return { 'error': 'Deferred import' }
            })
          } catch (exception) {
            return JSON.stringify({ error: 'Uncaught JavaScript exception:\n' + exception })
          }
        }

        self.postMessage({
          cmd: 'versionLoaded',
          data: compiler.version()
        })
        break
      case 'compile':
        missingInputs.length = 0
        self.postMessage({cmd: 'compiled', job: data.job, data: compileJSON(data.input), missingInputs: missingInputs})
        break
    }
  }, false)
}
