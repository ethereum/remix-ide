'use strict'

var fs = require('fs')
var compiler = require('solc')
var compilerInput = require('remix-solidity').CompilerInput
var defaultVersion = 'v0.6.0+commit.26b70077'

compiler.loadRemoteVersion(defaultVersion, (error, solcSnapshot) => {
  if (error) console.log(error)
  var compilationResult = {}
  gatherCompilationResults('./test-browser/tests/', compilationResult, solcSnapshot)
  replaceSolCompiler(compilationResult, solcSnapshot)
})

function gatherCompilationResults (dir, compilationResult, solcSnapshot) {
  var filenames = fs.readdirSync(dir, 'utf8')
  filenames.map(function (item, i) {
    if (item.endsWith('.js')) {
      var testDef = require('.' + dir + item)
      if ('@sources' in testDef) {
        var sources = testDef['@sources']()
        for (var files in sources) {
          compile(solcSnapshot, sources[files], true, function (result) {
            compilationResult[result.key] = result
          })
          compile(solcSnapshot, sources[files], false, function (result) {
            compilationResult[result.key] = result
          })
        }
      }
    }
  })
  return compilationResult
}

function compile (solcSnapshot, source, optimization, addCompilationResult) {
  var missingInputs = []
  try {
    var input = compilerInput(source, {optimize: optimization})
    var result = solcSnapshot.compileStandardWrapper(input, function (path) {
      missingInputs.push(path)
    })
    input = input.replace(/(\t)|(\n)|(\\n)|( )/g, '')
  } catch (e) {
    console.log(e)
  }
  if (result && (result.error || (result.errors && result.errors.length > 0))) {
    console.log(result.error, result.errors)
  }
  if (result) {
    console.log(result.error, result.errors)
  }
  var ret = {
    key: input,
    source: source,
    optimization: optimization,
    missingInputs: missingInputs,
    result: result
  }
  addCompilationResult(ret)
}

function replaceSolCompiler (results, solcSnapshot) {
  fs.readFile('./test-browser/mockcompiler/compiler.js', 'utf8', function (error, data) {
    if (error) {
      console.log(error)
      process.exit(1)
      return
    }
    console.log(solcSnapshot.version())
    data = data + '\n\nvar mockCompilerVersion = \'' + solcSnapshot.version() + '\''
    data = data + '\n\nvar mockData = ' + JSON.stringify(results) + ';\n'
    fs.writeFile('./soljson.js', data, 'utf8', function (error) {
      if (error) {
        console.log(error)
        process.exit(1)
        return
      }
    })
  })
}
