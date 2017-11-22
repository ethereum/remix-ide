'use strict'

var Module = { // eslint-disable-line
  cwrap: function () { return arguments[0] === 'version' ? version : compileStandard },
  writeStringToMemory: function () {},
  setValue: function () {},
  Pointer_stringify: function (value) { return value },
  Runtime: {
    addFunction: function () { return arguments[0] },
    removeFunction: function () {}
  },
  _compileJSONMulti: {},
  _compileJSONCallback: {},
  _compileJSON: {},
<<<<<<< HEAD
=======
  _malloc: function () {},
>>>>>>> 57a496aa1f3a3f66c485f84651dbac671d0f6225
  _compileStandard: compileStandard
}

function compileStandard (source, missingInputs) {
  source = source.replace(/(\t)|(\n)|(\\n)|( )/g, '')
  var data = mockData[source] // eslint-disable-line
  if (data === undefined) {
    return JSON.stringify({
      errors: [{ formattedMessage: 'mock compiler: source not found', severity: 'error' }]
    })
  } else {
    data.missingInputs.map(function (item, i) {
      if (missingInputs) {
        missingInputs(item, '', '')
      }
    })
  }
  return data.result
}

function version () {
  return mockCompilerVersion // eslint-disable-line
}
