/* global confirm, Option, Worker, chrome */
'use strict'

var async = require('async')
var $ = require('jquery')
var base64 = require('js-base64').Base64
var swarmgw = require('swarmgw')
var csjs = require('csjs-inject')
var yo = require('yo-yo')
var EventManager = require('ethereum-remix').lib.EventManager

var UniversalDApp = require('./universal-dapp.js')
var Remixd = require('./lib/remixd')
var OffsetToLineColumnConverter = require('./lib/offsetToLineColumnConverter')

var QueryParams = require('./app/query-params')
var GistHandler = require('./app/gist-handler')
var Storage = require('./app/files/storage')
var Browserfiles = require('./app/files/browser-files')
var SharedFolder = require('./app/files/shared-folder')
var Config = require('./app/config')
var Editor = require('./app/editor')
var Renderer = require('./app/renderer')
var Compiler = require('./app/compiler')
var ExecutionContext = require('./app/execution-context')
var Debugger = require('./app/debugger')
var StaticAnalysis = require('./app/staticanalysis/staticAnalysisView')
var FilePanel = require('./app/file-panel')
var EditorPanel = require('./app/editor-panel')
var RighthandPanel = require('./app/righthand-panel')
var examples = require('./app/example-contracts')
var modalDialogCustom = require('./app/modal-dialog-custom')
// var Txlistener = require('./app/txListener')

var css = csjs`
  html { box-sizing: border-box; }
  *, *:before, *:after { box-sizing: inherit; }
  body                 {
    margin             : 0;
    padding            : 0;
    font-size          : 12px;
    color              : #111111;
    font-weight        : normal;
  }
  .browsersolidity     {
    position           : relative;
    width              : 100vw;
    height             : 100vh;
    overflow           : hidden;
  }
  .centerpanel         {
    display            : flex;
    flex-direction     : column;
    position           : absolute;
    top                : 0;
    bottom             : 0;
    overflow           : hidden;
  }
  .leftpanel           {
    display            : flex;
    flex-direction     : column;
    position           : absolute;
    top                : 0;
    bottom             : 0;
    left               : 0;
    overflow           : hidden;
  }
  .rightpanel          {
    display            : flex;
    flex-direction     : column;
    position           : absolute;
    top                : 0;
    right              : 0;
    bottom             : 0;
    overflow           : hidden;
  }
`

class App {
  constructor (opts = {}) {
    var self = this
    self._api = {}
    var fileStorage = new Storage('sol:')
    self._api.config = new Config(fileStorage)
    self._api.filesProviders = {}
    self._api.filesProviders['browser'] = new Browserfiles(fileStorage)
    self._api.filesProviders['localhost'] = new SharedFolder(new Remixd())
    self._view = {}
    self._components = {}
    self.data = {
      _layout: {
        right: {
          offset: self._api.config.get('right-offset') || 400,
          show: true
        }, // @TODO: adapt sizes proportionally to browser window size
        left: {
          offset: self._api.config.get('left-offset') || 200,
          show: true
        }
      }
    }
    // ----------------- editor ----------------------------
    self._components.editor = new Editor({}) // @TODO: put into editorpanel
    // ----------------- editor panel ----------------------
    self._components.editorpanel = new EditorPanel({
      api: { editor: self._components.editor }
    })
    self._components.editorpanel.event.register('resize', direction => self._adjustLayout(direction))
  }
  _adjustLayout (direction, delta) {
    var self = this
    var layout = self.data._layout[direction]
    if (layout) {
      if (delta === undefined) {
        layout.show = !layout.show
        if (layout.show) delta = layout.offset
        else delta = 0
      } else {
        self._api.config.set(`${direction}-offset`, delta)
        layout.offset = delta
      }
    }
    if (direction === 'left') {
      self._view.leftpanel.style.width = delta + 'px'
      self._view.centerpanel.style.left = delta + 'px'
    }
    if (direction === 'right') {
      self._view.rightpanel.style.width = delta + 'px'
      self._view.centerpanel.style.right = delta + 'px'
    }
  }
  init () {
    var self = this
    run.apply(self)
  }
  render () {
    var self = this
    if (self._view.el) return self._view.el
    self._view.leftpanel = yo`
      <div id="filepanel" class=${css.leftpanel}>
        ${''}
      </div>
    `
    self._view.centerpanel = yo`
      <div id="editor-container" class=${css.centerpanel}>
        ${self._components.editorpanel.render()}
      </div>
    `
    self._view.rightpanel = yo`
      <div class=${css.rightpanel}>
        ${''}
      </div>
    `
    self._view.el = yo`
      <div class=${css.browsersolidity}>
        ${self._view.leftpanel}
        ${self._view.centerpanel}
        ${self._view.rightpanel}
      </div>
    `
    // INIT
    self._adjustLayout('left', self.data._layout.left.offset)
    self._adjustLayout('right', self.data._layout.right.offset)
    return self._view.el
  }
}

module.exports = App

function run () {
  var self = this

  var queryParams = new QueryParams()
  var gistHandler = new GistHandler()

  var editor = self._components.editor
  // The event listener needs to be registered as early as possible, because the
  // parent will send the message upon the "load" event.
  var filesToLoad = null
  var loadFilesCallback = function (files) { filesToLoad = files } // will be replaced later

  window.addEventListener('message', function (ev) {
    if (typeof ev.data === typeof [] && ev.data[0] === 'loadFiles') {
      loadFilesCallback(ev.data[1])
    }
  }, false)

  this.event = new EventManager()

  var config = self._api.config
  var filesProviders = self._api.filesProviders

  var tabbedFiles = {} // list of files displayed in the tabs bar

  // return all the files, except the temporary/readonly ones.. package only files from the browser storage.
  function packageFiles (callback) {
    var ret = {}
    var files = filesProviders['browser']
    var filtered = Object.keys(files.list()).filter(function (path) { if (!files.isReadOnly(path)) { return path } })
    async.eachSeries(filtered, function (path, cb) {
      ret[path.replace(files.type + '/', '')] = { content: files.get(path) }
      cb()
    }, () => {
      callback(null, ret)
    })
  }

  function createNonClashingName (path) {
    var counter = ''
    if (path.endsWith('.sol')) path = path.substring(0, path.lastIndexOf('.sol'))
    while (filesProviders['browser'].exists(path + counter + '.sol')) {
      counter = (counter | 0) + 1
    }
    return path + counter + '.sol'
  }

  // Add files received from remote instance (i.e. another browser-solidity)
  function loadFiles (filesSet) {
    for (var f in filesSet) {
      filesProviders['browser'].set(createNonClashingName(f), filesSet[f].content)
    }
    switchToNextFile()
  }

  // Replace early callback with instant response
  loadFilesCallback = function (files) {
    loadFiles(files)
  }

  // Run if we did receive an event from remote instance while starting up
  if (filesToLoad !== null) {
    loadFiles(filesToLoad)
  }

  // ------------------ gist load ----------------

  var loadingFromGist = gistHandler.handleLoad(queryParams.get(), function (gistId) {
    $.ajax({
      url: 'https://api.github.com/gists/' + gistId,
      jsonp: 'callback',
      dataType: 'jsonp',
      success: function (response) {
        if (response.data) {
          if (!response.data.files) {
            modalDialogCustom.alert('Gist load error: ' + response.data.message)
            return
          }
          loadFiles(response.data.files)
        }
      }
    })
  })

  // insert ballot contract if there are no files available
  if (!loadingFromGist && Object.keys(filesProviders['browser'].list()).length === 0) {
    if (!filesProviders['browser'].set(examples.ballot.name, examples.ballot.content)) {
      modalDialogCustom.alert('Failed to store example contract in browser. Remix will not work properly. Please ensure Remix has access to LocalStorage. Safari in Private mode is known not to work.')
    }
  }

  // ----------------- Chrome cloud storage sync --------------------

  function chromeCloudSync () {
    if (typeof chrome === 'undefined' || !chrome || !chrome.storage || !chrome.storage.sync) {
      return
    }

    var obj = {}
    var done = false
    var count = 0

    function check (key) {
      chrome.storage.sync.get(key, function (resp) {
        console.log('comparing to cloud', key, resp)
        if (typeof resp[key] !== 'undefined' && obj[key] !== resp[key] && confirm('Overwrite "' + key + '"? Click Ok to overwrite local file with file from cloud. Cancel will push your local file to the cloud.')) {
          console.log('Overwriting', key)
          filesProviders['browser'].set(key, resp[key])
        } else {
          console.log('add to obj', obj, key)
          filesProviders['browser'].get(key, (error, content) => {
            if (error) {
              console.log(error)
            } else {
              obj[key] = content
            }
          })
        }
        done++
        if (done >= count) {
          chrome.storage.sync.set(obj, function () {
            console.log('updated cloud files with: ', obj, this, arguments)
          })
        }
      })
    }

    for (var y in filesProviders['browser'].list()) {
      console.log('checking', y)
      filesProviders['browser'].get(y, (error, content) => {
        if (error) {
          console.log(error)
        } else {
          obj[y] = content
          count++
          check(y)
        }
      })
    }
  }

  window.syncStorage = chromeCloudSync
  chromeCloudSync()

  // ---------------- FilePanel --------------------
  var FilePanelAPI = {
    createName: createNonClashingName,
    switchToFile: switchToFile,
    event: this.event,
    currentFile: function () {
      return config.get('currentFile')
    },
    currentContent: function () {
      return editor.get(config.get('currentFile'))
    },
    setText: function (text) {
      editor.setText(text)
    }
  }
  var filePanel = new FilePanel(FilePanelAPI, filesProviders)

  // TODO this should happen inside file-panel.js
  var filepanelContainer = document.querySelector('#filepanel')
  filepanelContainer.appendChild(filePanel.render())

  filePanel.event.register('resize', delta => self._adjustLayout('left', delta))

  function fileRenamedEvent (oldName, newName, isFolder) {
    // TODO please never use 'window' when it is possible to use a variable
    // that references the DOM node
    [...window.files.querySelectorAll('.file .name')].forEach(function (span) {
      if (span.innerText === oldName) span.innerText = newName
    })
    if (!isFolder) {
      config.set('currentFile', '')
      editor.discard(oldName)
      if (tabbedFiles[oldName]) {
        delete tabbedFiles[oldName]
        tabbedFiles[newName] = newName
      }
      switchToFile(newName)
    } else {
      var newFocus
      for (var k in tabbedFiles) {
        if (k.indexOf(oldName + '/') === 0) {
          var newAbsolutePath = k.replace(oldName, newName)
          tabbedFiles[newAbsolutePath] = newAbsolutePath
          delete tabbedFiles[k]
          if (config.get('currentFile') === k) {
            newFocus = newAbsolutePath
          }
        }
      }
      if (newFocus) {
        switchToFile(newFocus)
      }
    }
    refreshTabs()
  }

  filesProviders['browser'].event.register('fileRenamed', fileRenamedEvent)
  filesProviders['localhost'].event.register('fileRenamed', fileRenamedEvent)

  function fileRemovedEvent (path) {
    if (path === config.get('currentFile')) {
      config.set('currentFile', '')
      switchToNextFile()
    }
    editor.discard(path)
    delete tabbedFiles[path]
    refreshTabs()
  }
  filesProviders['browser'].event.register('fileRemoved', fileRemovedEvent)
  filesProviders['localhost'].event.register('fileRemoved', fileRemovedEvent)

  // --------------------Files tabs-----------------------------
  var $filesEl = $('#files')

  // Switch tab
  $filesEl.on('click', '.file:not(.active)', function (ev) {
    ev.preventDefault()
    switchToFile($(this).find('.name').text())
    return false
  })

  // Remove current tab
  $filesEl.on('click', '.file .remove', function (ev) {
    ev.preventDefault()
    var name = $(this).parent().find('.name').text()
    delete tabbedFiles[name]
    refreshTabs()
    if (Object.keys(tabbedFiles).length) {
      switchToFile(Object.keys(tabbedFiles)[0])
    } else {
      editor.displayEmptyReadOnlySession()
    }
    return false
  })

  function switchToFile (file) {
    editorSyncFile()
    config.set('currentFile', file)
    refreshTabs(file)
    fileProviderOf(file).get(file, (error, content) => {
      if (error) {
        console.log(error)
      } else {
        if (fileProviderOf(file).isReadOnly(file)) {
          editor.openReadOnly(file, content)
        } else {
          editor.open(file, content)
        }
        self.event.trigger('currentFileChanged', [file, fileProviderOf(file)])
      }
    })
  }

  function switchToNextFile () {
    var fileList = Object.keys(filesProviders['browser'].list())
    if (fileList.length) {
      switchToFile(fileList[0])
    }
  }

  var previouslyOpenedFile = config.get('currentFile')
  if (previouslyOpenedFile) {
    filesProviders['browser'].get(previouslyOpenedFile, (error, content) => {
      if (!error && content) {
        switchToFile(previouslyOpenedFile)
      } else {
        switchToNextFile()
      }
    })
  } else {
    switchToNextFile()
  }

  function fileProviderOf (file) {
    var provider = file.match(/[^/]*/)
    if (provider !== null) {
      return filesProviders[provider[0]]
    }
    return null
  }

  // Display files that have already been selected
  function refreshTabs (newfile) {
    if (newfile) {
      tabbedFiles[newfile] = newfile
    }

    var $filesEl = $('#files')
    $filesEl.find('.file').remove()

    for (var file in tabbedFiles) {
      $filesEl.append($('<li class="file"><span class="name">' + file + '</span><span class="remove"><i class="fa fa-close"></i></span></li>'))
    }
    var currentFileOpen = !!config.get('currentFile')

    if (currentFileOpen) {
      var active = $('#files .file').filter(function () { return $(this).find('.name').text() === config.get('currentFile') })
      active.addClass('active')
    }
    $('#input').toggle(currentFileOpen)
    $('#output').toggle(currentFileOpen)
    self._components.editorpanel.refresh()
  }

  var compiler = new Compiler(handleImportCall)
  var offsetToLineColumnConverter = new OffsetToLineColumnConverter(compiler.event)

  // ----------------- Renderer -----------------
  var rendererAPI = {
    error: (file, error) => {
      if (file === config.get('currentFile')) {
        editor.addAnnotation(error)
      }
    },
    errorClick: (errFile, errLine, errCol) => {
      if (errFile !== config.get('currentFile') && (filesProviders['browser'].exists(errFile) || filesProviders['localhost'].exists(errFile))) {
        switchToFile(errFile)
      }
      editor.gotoLine(errLine, errCol)
    }
  }
  var renderer = new Renderer(rendererAPI)

  // ------------------------------------------------------------
  var executionContext = new ExecutionContext()

  // ----------------- UniversalDApp -----------------
  var transactionContextAPI = {
    getAddress: (cb) => {
      cb(null, $('#txorigin').val())
    },
    getValue: (cb) => {
      try {
        var comp = $('#value').val().split(' ')
        cb(null, executionContext.web3().toWei(comp[0], comp.slice(1).join(' ')))
      } catch (e) {
        cb(e)
      }
    },
    getGasLimit: (cb) => {
      cb(null, $('#gasLimit').val())
    }
  }

  var udapp = new UniversalDApp(executionContext, {
    removable: false,
    removable_instances: true
  })
  udapp.reset({}, transactionContextAPI)
  udapp.event.register('debugRequested', this, function (txResult) {
    startdebugging(txResult.transactionHash)
  })

  // ---------------- Righthand-panel --------------------
  var rhpAPI = {
    config: config,
    setEditorSize (delta) {
      $('#righthand-panel').css('width', delta)
      self._view.centerpanel.style.right = delta + 'px'
      document.querySelector(`.${css.dragbar2}`).style.right = delta + 'px'
      onResize()
    },
    executionContextChange: (context) => {
      return executionContext.executionContextChange(context)
    },
    executionContextProvider: () => {
      return executionContext.getProvider()
    },
    packageFiles: (cb) => {
      packageFiles(cb)
    },
    getContracts: () => {
      if (compiler.lastCompilationResult && compiler.lastCompilationResult.data) {
        return compiler.lastCompilationResult.data.contracts
      }
      return null
    },
    udapp: () => {
      return udapp
    },
    executionContext: () => {
      return executionContext
    },
    fileProviderOf: (path) => {
      return fileProviderOf(path)
    },
    getBalance: (address, callback) => {
      udapp.getBalance(address, (error, balance) => {
        if (error) {
          callback(error)
        } else {
          callback(null, executionContext.web3().fromWei(balance, 'ether'))
        }
      })
    },
    compilationMessage: (message, container, options) => {
      renderer.error(message, container, options)
    },
    currentCompiledSourceCode: () => {
      if (compiler.lastCompilationResult.source) {
        return compiler.lastCompilationResult.source.sources[compiler.lastCompilationResult.source.target]
      }
      return ''
    },
    resetDapp: (contracts) => {
      udapp.reset(contracts, transactionContextAPI)
    }
  }
  var rhpEvents = {
    compiler: compiler.event,
    app: self.event,
    udapp: udapp.event,
    editor: editor.event
  }
  self._components.righthandpanel = new RighthandPanel(rhpAPI, rhpEvents, {})
  self._view.rightpanel.appendChild(self._components.righthandpanel.render())
  self._components.righthandpanel.init()
  self._components.righthandpanel.event.register('resize', delta => self._adjustLayout('right', delta))

  // ----------------- editor resize ---------------

  function onResize () {
    editor.resize(document.querySelector('#editorWrap').checked)
  }
  onResize()

  self._view.el.addEventListener('change', onResize)
  document.querySelector('#editorWrap').addEventListener('change', onResize)

  // ----------------- compiler ----------------------

  function handleGithubCall (root, path, cb) {
    return $.getJSON('https://api.github.com/repos/' + root + '/contents/' + path)
      .done(function (data) {
        if ('content' in data) {
          cb(null, base64.decode(data.content))
        } else {
          cb('Content not received')
        }
      })
      .fail(function (xhr, text, err) {
        // NOTE: on some browsers, err equals to '' for certain errors (such as offline browser)
        cb(err || 'Unknown transport error')
      })
  }

  function handleSwarmImport (url, cb) {
    swarmgw.get(url, function (err, content) {
      // retry if this failed and we're connected via RPC
      if (err && !executionContext.isVM()) {
        var web3 = executionContext.web3()
        web3.swarm.download(url, cb)
      } else {
        cb(err, content)
      }
    })
  }

  function handleIPFS (url, cb) {
    // replace ipfs:// with /ipfs/
    url = url.replace(/^ipfs:\/\/?/, 'ipfs/')

    return $.ajax({ type: 'GET', url: 'https://gateway.ipfs.io/' + url })
      .done(function (data) {
        cb(null, data)
      })
      .fail(function (xhr, text, err) {
        // NOTE: on some browsers, err equals to '' for certain errors (such as offline browser)
        cb(err || 'Unknown transport error')
      })
  }

  function handleImportCall (url, cb) {
    var provider = fileProviderOf(url)
    if (provider && provider.exists(url)) {
      return provider.get(url, cb)
    }

    var handlers = [
      { match: /^(https?:\/\/)?(www.)?github.com\/([^/]*\/[^/]*)\/(.*)/, handler: function (match, cb) { handleGithubCall(match[3], match[4], cb) } },
      { match: /^(bzz[ri]?:\/\/?.*)$/, handler: function (match, cb) { handleSwarmImport(match[1], cb) } },
      { match: /^(ipfs:\/\/?.+)/, handler: function (match, cb) { handleIPFS(match[1], cb) } }
    ]

    var found = false
    handlers.forEach(function (handler) {
      if (found) {
        return
      }

      var match = handler.match.exec(url)
      if (match) {
        found = true

        $('#output').append($('<div/>').append($('<pre/>').text('Loading ' + url + ' ...')))
        handler.handler(match, function (err, content) {
          if (err) {
            cb('Unable to import "' + url + '": ' + err)
            return
          }

          // FIXME: at some point we should invalidate the cache
          filesProviders['browser'].addReadOnly(url, content)
          cb(null, content)
        })
      }
    })

    if (found) {
      return
    } else if (/^[^:]*:\/\//.exec(url)) {
      cb('Unable to import "' + url + '": Unsupported URL schema')
    } else {
      cb('Unable to import "' + url + '": File not found')
    }
  }

  // ----------------- Debugger -----------------
  var debugAPI = {
    statementMarker: null,
    fullLineMarker: null,
    source: null,
    currentSourceLocation: (lineColumnPos, location) => {
      if (this.statementMarker) editor.removeMarker(this.statementMarker, this.source)
      if (this.fullLineMarker) editor.removeMarker(this.fullLineMarker, this.source)
      this.statementMarker = null
      this.fullLineMarker = null
      this.source = null
      if (lineColumnPos) {
        this.source = compiler.lastCompilationResult.data.sourceList[location.file] // auto switch to that tab
        if (config.get('currentFile') !== this.source) {
          switchToFile(this.source)
        }
        this.statementMarker = editor.addMarker(lineColumnPos, this.source, 'highlightcode')
        editor.scrollToLine(lineColumnPos.start.line, true, true, function () {})

        if (lineColumnPos.start.line === lineColumnPos.end.line) {
          this.fullLineMarker = editor.addMarker({
            start: {
              line: lineColumnPos.start.line,
              column: 0
            },
            end: {
              line: lineColumnPos.start.line + 1,
              column: 0
            }
          }, this.source, 'highlightcode_fullLine')
        }
      }
    },
    lastCompilationResult: () => {
      return compiler.lastCompilationResult
    },
    offsetToLineColumn: (location, file) => {
      return offsetToLineColumnConverter.offsetToLineColumn(location, file, compiler.lastCompilationResult)
    }
  }
  var transactionDebugger = new Debugger('#debugger', debugAPI, executionContext.event, editor.event)
  transactionDebugger.addProvider('vm', executionContext.vm())
  transactionDebugger.addProvider('injected', executionContext.web3())
  transactionDebugger.addProvider('web3', executionContext.web3())
  transactionDebugger.switchProvider(executionContext.getProvider())

  // ----------------- StaticAnalysis -----------------
  var staticAnalysisAPI = {
    renderWarning: (label, warningContainer, type) => {
      return renderer.error(label, warningContainer, type)
    },
    offsetToLineColumn: (location, file) => {
      return offsetToLineColumnConverter.offsetToLineColumn(location, file, compiler.lastCompilationResult)
    }
  }
  var staticanalysis = new StaticAnalysis(staticAnalysisAPI, compiler.event)
  var node = document.getElementById('staticanalysisView')
  node.insertBefore(staticanalysis.render(), node.childNodes[0])

  // ----------------- Tx listener -----------------
  // Commented for now. will be used later.
  /*
  var txlistener = new Txlistener({
    api: {
      web3: function () { return executionContext.web3() },
      isVM: function () { return executionContext.isVM() },
      vm: function () { return executionContext.vm() },
      contracts: function () {
        if (compiler.lastCompilationResult && compiler.lastCompilationResult.data) {
          return compiler.lastCompilationResult.data.contracts
        }
        return null
      },
      context: function () {
        return executionContext.getProvider()
      }
    },
    event: {
      executionContext: executionContext.event,
      udapp: udapp.event
    }
  })

  txlistener.startListening()

  txlistener.event.register('newTransaction', (tx) => {
    var resolvedTransaction = txlistener.resolvedTransaction(tx.hash)
    var address = null
    if (resolvedTransaction) {
      address = resolvedTransaction.contractAddress ? resolvedTransaction.contractAddress : tx.to
    }
    console.log({
      tx: tx,
      resolvedContract: txlistener.resolvedContract(address),
      resolvedTransaction: resolvedTransaction
    })
  })
  */

  // ----------------- autoCompile -----------------
  var autoCompile = document.querySelector('#autoCompile').checked
  if (config.exists('autoCompile')) {
    autoCompile = config.get('autoCompile')
    $('#autoCompile').checked = autoCompile
  }

  document.querySelector('#autoCompile').addEventListener('change', function () {
    autoCompile = document.querySelector('#autoCompile').checked
    config.set('autoCompile', autoCompile)
  })

  function runCompiler () {
    if (transactionDebugger.isActive) return

    editorSyncFile()
    var currentFile = config.get('currentFile')
    if (currentFile) {
      var target = currentFile
      var sources = {}
      var provider = fileProviderOf(currentFile)
      if (provider) {
        provider.get(target, (error, content) => {
          if (error) {
            console.log(error)
          } else {
            sources[target] = content
            compiler.compile(sources, target)
          }
        })
      } else {
        console.log('cannot compile ' + currentFile + '. Does not belong to any explorer')
      }
    }
  }

  function editorSyncFile () {
    var currentFile = config.get('currentFile')
    if (currentFile && editor.current()) {
      var input = editor.get(currentFile)
      var provider = fileProviderOf(currentFile)
      if (provider) {
        provider.set(currentFile, input)
      } else {
        console.log('cannot save ' + currentFile + '. Does not belong to any explorer')
      }
    }
  }

  var previousInput = ''
  var compileTimeout = null
  var saveTimeout = null

  function editorOnChange () {
    var currentFile = config.get('currentFile')
    if (!currentFile) {
      return
    }
    var input = editor.get(currentFile)

    // if there's no change, don't do anything
    if (input === previousInput) {
      return
    }
    previousInput = input

    // fire storage update
    // NOTE: save at most once per 5 seconds
    if (saveTimeout) {
      window.clearTimeout(saveTimeout)
    }
    saveTimeout = window.setTimeout(editorSyncFile, 5000)

    // special case: there's nothing else to do
    if (input === '') {
      return
    }

    if (!autoCompile) {
      return
    }

    if (compileTimeout) {
      window.clearTimeout(compileTimeout)
    }
    compileTimeout = window.setTimeout(runCompiler, 300)
  }

  editor.event.register('contentChanged', editorOnChange)
  // in order to save the file when switching
  editor.event.register('sessionSwitched', editorOnChange)

  $('#compile').click(function () {
    runCompiler()
  })

  executionContext.event.register('contextChanged', this, function (context) {
    runCompiler()
  })

  executionContext.event.register('web3EndpointChanged', this, function (context) {
    runCompiler()
  })

  compiler.event.register('loadingCompiler', this, function (url, usingWorker) {
    setVersionText(usingWorker ? '(loading using worker)' : ' Loading... please, wait a moment! ')
  })

  compiler.event.register('compilerLoaded', this, function (version) {
    previousInput = ''
    setVersionText(version)
    runCompiler()

    if (queryParams.get().context) {
      executionContext.setContext(queryParams.get().context, queryParams.get().endpointurl)
    }

    if (queryParams.get().debugtx) {
      startdebugging(queryParams.get().debugtx)
    }
  })

  compiler.event.register('compilationStarted', this, function () {
    editor.clearAnnotations()
  })

  function startdebugging (txHash) {
    self.event.trigger('debuggingRequested', [])
    transactionDebugger.debug(txHash)
  }

  function setVersionText (text) {
    document.querySelector('#version').innerText = text
  }

  function loadVersion (version) {
    queryParams.update({ version: version })
    var url
    if (version === 'builtin') {
      var location = window.document.location
      location = location.protocol + '//' + location.host + '/' + location.pathname
      if (location.endsWith('index.html')) {
        location = location.substring(0, location.length - 10)
      }
      if (!location.endsWith('/')) {
        location += '/'
      }

      url = location + 'soljson.js'
    } else {
      url = 'https://ethereum.github.io/solc-bin/bin/' + version
    }
    var isFirefox = typeof InstallTrigger !== 'undefined'
    if (document.location.protocol !== 'file:' && Worker !== undefined && isFirefox) {
      // Workers cannot load js on "file:"-URLs and we get a
      // "Uncaught RangeError: Maximum call stack size exceeded" error on Chromium,
      // resort to non-worker version in that case.
      compiler.loadVersion(true, url)
    } else {
      compiler.loadVersion(false, url)
    }
  }

  // set default
  $('#optimize').attr('checked', (queryParams.get().optimize === 'true'))
  compiler.setOptimize(document.querySelector('#optimize').checked)

  document.querySelector('#optimize').addEventListener('change', function () {
    var optimize = document.querySelector('#optimize').checked
    queryParams.update({ optimize: optimize })
    compiler.setOptimize(optimize)
    runCompiler()
  })

  // ----------------- version selector-------------

  // clear and disable the version selector
  $('option', '#versionSelector').remove()
  $('#versionSelector').attr('disabled', true)

  // load the new version upon change
  $('#versionSelector').change(function () {
    loadVersion($('#versionSelector').val())
  })

  var header = new Option('Select new compiler version')
  header.disabled = true
  header.selected = true
  $('#versionSelector').append(header)

  $.getJSON('https://ethereum.github.io/solc-bin/bin/list.json').done(function (data) {
    // populate version dropdown with all available compiler versions (descending order)
    $.each(data.builds.slice().reverse(), function (i, build) {
      $('#versionSelector').append(new Option(build.longVersion, build.path))
    })

    $('#versionSelector').attr('disabled', false)

    // always include the local version
    $('#versionSelector').append(new Option('latest local version', 'builtin'))

    // find latest release
    var selectedVersion = data.releases[data.latestRelease]

    // override with the requested version
    if (queryParams.get().version) {
      selectedVersion = queryParams.get().version
    }

    loadVersion(selectedVersion)
  }).fail(function (xhr, text, err) {
    // loading failed for some reason, fall back to local compiler
    $('#versionSelector').append(new Option('latest local version', 'builtin'))

    loadVersion('builtin')
  })
}
