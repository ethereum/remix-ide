'use strict'

var solc = require('solc/wrapper')
var solcABI = require('solc/abi')

var webworkify = require('webworkify')

var compilerInput = require('./compiler-input')
var resolveSMTLib2Query = require('./smtlib2query')

var EventManager = require('ethereum-remix').lib.EventManager

var txHelper = require('../execution/txHelper')

/*
  trigger compilationFinished, compilerLoaded, compilationStarted, compilationDuration
*/
function Compiler (handleImportCall) {
  var self = this
  this.event = new EventManager()

  var compileJSON

  var worker = null

  var currentVersion

  var optimize = false

  this.setOptimize = function (_optimize) {
    optimize = _optimize
  }

  var compilationStartTime = null
  this.event.register('compilationFinished', (success, data, source) => {
    if (success && compilationStartTime) {
      this.event.trigger('compilationDuration', [(new Date().getTime()) - compilationStartTime])
    }
    compilationStartTime = null
  })

  this.event.register('compilationStarted', () => {
    compilationStartTime = new Date().getTime()
  })

  var internalCompile = function (files, target, missingInputs) {
    gatherImports(files, null, target, missingInputs, function (error, input) {
      if (error) {
        self.lastCompilationResult = null
        self.event.trigger('compilationFinished', [false, {'error': { formattedMessage: error, severity: 'error' }}, files])
      } else {
        compileJSON(input, optimize ? 1 : 0)
      }
    })
  }

  var compile = function (files, target) {
    self.event.trigger('compilationStarted', [])
    internalCompile(files, target)
  }
  this.compile = compile

  function setCompileJSON (_compileJSON) {
    compileJSON = _compileJSON
  }
  this.setCompileJSON = setCompileJSON // this is exposed for testing

  function onCompilerLoaded (version) {
    currentVersion = version
    self.event.trigger('compilerLoaded', [version])
  }

  function onInternalCompilerLoaded () {
    if (worker === null) {
      var compiler = solc(window.Module)

      compileJSON = function (source, optimize, cb) {
        var missingInputs = []
        var missingInputsCallback = function (path) {
          missingInputs.push(path)
          return { error: 'Deferred import' }
        }

        var result
        try {
          var input = compilerInput(source.sources, {optimize: optimize, target: source.target, auxiliaryInput: source.auxiliaryInput})
          result = compiler.compileStandardWrapper(input, missingInputsCallback)
          result = JSON.parse(result)
        } catch (exception) {
          result = { error: 'Uncaught JavaScript exception:\n' + exception }
        }

        compilationFinished(result, missingInputs, source)
      }
      onCompilerLoaded(compiler.version())
    }
  }

  this.lastCompilationResult = {
    data: null,
    source: null
  }

  /**
    * return the contract obj of the given @arg name. Uses last compilation result.
    * return null if not found
    * @param {String} name    - contract name
    * @returns contract obj and associated file: { contract, file } or null
    */
  this.getContract = (name) => {
    if (this.lastCompilationResult.data && this.lastCompilationResult.data.contracts) {
      return txHelper.getContract(name, this.lastCompilationResult.data.contracts)
    }
    return null
  }

  /**
    * call the given @arg cb (function) for all the contracts. Uses last compilation result
    * @param {Function} cb    - callback
    */
  this.visitContracts = (cb) => {
    if (this.lastCompilationResult.data && this.lastCompilationResult.data.contracts) {
      return txHelper.visitContracts(this.lastCompilationResult.data.contracts, cb)
    }
    return null
  }

  /**
    * return the compiled contracts from the last compilation result
    * @return {Object}     - contracts
    */
  this.getContracts = () => {
    if (this.lastCompilationResult.data && this.lastCompilationResult.data.contracts) {
      return this.lastCompilationResult.data.contracts
    }
    return null
  }

   /**
    * return the sources from the last compilation result
    * @param {Object} cb    - map of sources
    */
  this.getSources = () => {
    if (this.lastCompilationResult.source) {
      return this.lastCompilationResult.source.sources
    }
    return null
  }

  /**
    * return the sources @arg fileName from the last compilation result
    * @param {Object} cb    - map of sources
    */
  this.getSource = (fileName) => {
    if (this.lastCompilationResult.source) {
      return this.lastCompilationResult.source.sources[fileName]
    }
    return null
  }

  /**
    * return the source from the last compilation result that has the given index. null if source not found
    * @param {Int} index    - index of the source
    */
  this.getSourceName = (index) => {
    if (this.lastCompilationResult.data && this.lastCompilationResult.data.sources) {
      return Object.keys(this.lastCompilationResult.data.sources)[index]
    }
    return null
  }

  function compilationFinished (data, missingInputs, source) {
    var noFatalErrors = true // ie warnings are ok

    function isValidError (error) {
      // The deferred import is not a real error
      // FIXME: maybe have a better check?
      if (/Deferred import/.exec(error.message)) {
        return false
      }

      return error.severity !== 'warning'
    }

    if (data['error'] !== undefined) {
      // Ignore warnings (and the 'Deferred import' error as those are generated by us as a workaround
      if (isValidError(data['error'])) {
        noFatalErrors = false
      }
    }
    if (data['errors'] !== undefined) {
      data['errors'].forEach(function (err) {
        // Ignore warnings and the 'Deferred import' error as those are generated by us as a workaround
        if (isValidError(err)) {
          noFatalErrors = false
        }
      })
    }

    if (!noFatalErrors) {
      // There are fatal errors - abort here
      self.lastCompilationResult = null
      self.event.trigger('compilationFinished', [false, data, source])
    } else if ((missingInputs !== undefined && missingInputs.length > 0) ||
        (data.auxiliaryInputRequested && Object.keys(data.auxiliaryInputRequested).length > 0)) {
      // try compiling again with the new set of inputs
      for (var i = 0; i < missingInputs.length; i++) {
        missingInputs[i] = {type: 'source', filename: missingInputs[i]}
      }
      if (data.auxiliaryInputRequested && data.auxiliaryInputRequested.smtlib2) {
        var smtlib2Requests = data.auxiliaryInputRequested.smtlib2
        for (var key in smtlib2Requests) {
          missingInputs.push({type: 'smtlib2', key: key, query: smtlib2Requests[key]})
        }
      }
      internalCompile(source.sources, source.target, missingInputs)
    } else {
      data = updateInterface(data)

      self.lastCompilationResult = {
        data: data,
        source: source
      }
      self.event.trigger('compilationFinished', [true, data, source])
    }
  }

  this.loadVersion = function (usingWorker, url) {
    console.log('Loading ' + url + ' ' + (usingWorker ? 'with worker' : 'without worker'))
    self.event.trigger('loadingCompiler', [url, usingWorker])

    if (usingWorker) {
      loadWorker(url)
    } else {
      loadInternal(url)
    }
  }

  function loadInternal (url) {
    delete window.Module
    // NOTE: workaround some browsers?
    window.Module = undefined

    // Set a safe fallback until the new one is loaded
    setCompileJSON(function (source, optimize) {
      compilationFinished({error: 'Compiler not yet loaded.'})
    })

    var newScript = document.createElement('script')
    newScript.type = 'text/javascript'
    newScript.src = url
    document.getElementsByTagName('head')[0].appendChild(newScript)
    var check = window.setInterval(function () {
      if (!window.Module) {
        return
      }
      window.clearInterval(check)
      onInternalCompilerLoaded()
    }, 200)
  }

  function loadWorker (url) {
    if (worker !== null) {
      worker.terminate()
    }
    worker = webworkify(require('./compiler-worker.js'))
    var jobs = []
    worker.addEventListener('message', function (msg) {
      var data = msg.data
      switch (data.cmd) {
        case 'versionLoaded':
          onCompilerLoaded(data.data)
          break
        case 'compiled':
          var result
          try {
            result = JSON.parse(data.data)
          } catch (exception) {
            result = { 'error': 'Invalid JSON output from the compiler: ' + exception }
          }
          var sources = {}
          if (data.job in jobs !== undefined) {
            sources = jobs[data.job].sources
            delete jobs[data.job]
          }
          compilationFinished(result, data.missingInputs, sources)
          break
      }
    })
    worker.onerror = function (msg) {
      compilationFinished({ error: 'Worker error: ' + msg.data })
    }
    worker.addEventListener('error', function (msg) {
      compilationFinished({ error: 'Worker error: ' + msg.data })
    })
    compileJSON = function (source, optimize) {
      jobs.push({sources: source})
      var options = {optimize: optimize, target: source.target, auxiliaryInput: source.auxiliaryInput}
      worker.postMessage({cmd: 'compile', job: jobs.length - 1, input: compilerInput(source.sources, options)})
    }
    worker.postMessage({cmd: 'loadVersion', data: url})
  }

  function gatherImports (files, auxInput, target, importHints, cb) {
    importHints = importHints || []

    while (importHints.length > 0) {
      var m = importHints.pop()
      if (m.type === 'source') {
        if (m.filename in files) {
          continue
        }

        handleImportCall(m.filename, function (err, content) {
          if (err) {
            cb(err)
          } else {
            files[m.filename] = { content }
            gatherImports(files, auxInput, target, importHints, cb)
          }
        })

        return
      } else if (m.type === 'smtlib2') {
        resolveSMTLib2Query(m.query, function (err, result) {
          if (err) {
            cb(err)
          } else {
            auxInput = auxInput || {smtlib2: {}}
            auxInput['smtlib2'][m.key] = result
            gatherImports(files, auxInput, target, importHints, cb)
          }
        })

        return
      } else {
        console.log('Invalid missing input type: ' + m.type)
      }
    }

    cb(null, { 'sources': files, 'target': target, 'auxiliaryInput': auxInput })
  }

  function truncateVersion (version) {
    var tmp = /^(\d+.\d+.\d+)/.exec(version)
    if (tmp) {
      return tmp[1]
    }
    return version
  }

  function updateInterface (data) {
    txHelper.visitContracts(data.contracts, (contract) => {
      data.contracts[contract.file][contract.name].abi = solcABI.update(truncateVersion(currentVersion), contract.object.abi)
    })
    return data
  }
}

module.exports = Compiler
