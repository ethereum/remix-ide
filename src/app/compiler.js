var solc = require('solc/wrapper');

var webworkify = require('webworkify');
var utils = require('./utils');

var Base64 = require('js-base64').Base64;

function Compiler (editor, renderer, queryParams, handleGithubCall, outputField, hidingRHP, formalVerification, sourceTracker, updateFiles) {
  var compileJSON;
  var compilerAcceptsMultipleFiles;

  var previousInput = '';

  var cachedRemoteFiles = {};
  var worker = null;

  var compileTimeout = null;

  function onChange () {
    var input = editor.getValue();
    if (input === '') {
      editor.setCacheFileContent('');
      return;
    }
    if (input === previousInput) {
      return;
    }
    previousInput = input;
    if (compileTimeout) {
      window.clearTimeout(compileTimeout);
    }
    compileTimeout = window.setTimeout(compile, 300);
  }

  editor.onChangeSetup(onChange);

  var compile = function (missingInputs) {
    editor.clearAnnotations();
    outputField.empty();
    if (formalVerification) {
      formalVerification.compiling();
    }
    var input = editor.getValue();
    editor.setCacheFileContent(input);

    var files = {};
    files[utils.fileNameFromKey(editor.getCacheFile())] = input;
    gatherImports(files, missingInputs, function (input, error) {
      outputField.empty();
      if (input === null) {
        renderer.error(error);
      } else {
        var optimize = queryParams.get().optimize;
        compileJSON(input, optimize ? 1 : 0);
      }
    });
  };
  this.compile = compile;

  function setCompileJSON (_compileJSON) {
    compileJSON = _compileJSON;
  }
  this.setCompileJSON = setCompileJSON; // this is exposed for testing

  function onCompilerLoaded (setVersionText, version) {
    setVersionText(version);
    previousInput = '';
    onChange();
  }

  function onInternalCompilerLoaded (setVersionText) {
    if (worker === null) {
      var compiler = solc(window.Module);

      compilerAcceptsMultipleFiles = compiler.supportsMulti;

      compileJSON = function (source, optimize, cb) {
        var missingInputs = [];
        var missingInputsCallback = function (path) {
          missingInputs.push(path);
          return { error: 'Deferred import' };
        };

        var result;
        try {
          result = compiler.compile(source, optimize, missingInputsCallback);
        } catch (exception) {
          result = { error: 'Uncaught JavaScript exception:\n' + exception };
        }

        compilationFinished(result, missingInputs);
      };

      onCompilerLoaded(setVersionText, compiler.version());
    }
  }

  function compilationFinished (data, missingInputs) {
    var noFatalErrors = true; // ie warnings are ok

    if (data['error'] !== undefined) {
      renderer.error(data['error']);
      if (utils.errortype(data['error']) !== 'warning') {
        noFatalErrors = false;
      }
    }
    if (data['errors'] !== undefined) {
      data['errors'].forEach(function (err) {
        renderer.error(err);
        if (utils.errortype(err) !== 'warning') {
          noFatalErrors = false;
        }
      });
    }

    if (missingInputs !== undefined && missingInputs.length > 0) {
      compile(missingInputs);
    } else if (noFatalErrors && !hidingRHP()) {
      renderer.contracts(data, editor.getValue());
      formalVerification.compilationFinished(data);
      sourceTracker.setCompilationData(data)
    }
  }

  this.loadVersion = function (usingWorker, version, setVersionText) {
    var url;
    if (version !== 'soljson.js') {
      url = 'https://ethereum.github.io/solc-bin/bin/' + version;
    } else {
      url = 'soljson.js';
    }
    console.log('Loading ' + url + ' ' + (usingWorker ? 'with worker' : 'without worker'));

    if (usingWorker) {
      loadWorker(url, setVersionText);
    } else {
      loadInternal(url, setVersionText);
    }
  };

  function loadInternal (url, setVersionText) {
    delete window.Module;
    // Set a safe fallback until the new one is loaded
    setCompileJSON(function (source, optimize) { compilationFinished('{}'); });

    var newScript = document.createElement('script');
    newScript.type = 'text/javascript';
    newScript.src = url;
    document.getElementsByTagName('head')[0].appendChild(newScript);
    var check = window.setInterval(function () {
      if (!window.Module) {
        return;
      }
      window.clearInterval(check);
      onInternalCompilerLoaded(setVersionText);
    }, 200);
  }

  function loadWorker (url, setVersionText) {
    if (worker !== null) {
      worker.terminate();
    }
    worker = webworkify(require('./compiler-worker.js'));
    worker.addEventListener('message', function (msg) {
      var data = msg.data;
      switch (data.cmd) {
        case 'versionLoaded':
          compilerAcceptsMultipleFiles = !!data.acceptsMultipleFiles;
          onCompilerLoaded(setVersionText, data.data);
          break;
        case 'compiled':
          var result;
          try {
            result = JSON.parse(data.data);
          } catch (exception) {
            result = { 'error': 'Invalid JSON output from the compiler: ' + exception };
          }
          compilationFinished(result, data.missingInputs);
          break;
      }
    });
    worker.onerror = function (msg) { console.log(msg.data); };
    worker.addEventListener('error', function (msg) { console.log(msg.data); });
    compileJSON = function (source, optimize) {
      worker.postMessage({cmd: 'compile', source: JSON.stringify(source), optimize: optimize});
    };
    worker.postMessage({cmd: 'loadVersion', data: url});
  }

  function gatherImports (files, importHints, cb) {
    importHints = importHints || [];
    if (!compilerAcceptsMultipleFiles) {
      cb(files[editor.getCacheFile()]);
      return;
    }
    var importRegex = /^\s*import\s*[\'\"]([^\'\"]+)[\'\"];/g;
    var reloop = false;
    var githubMatch;
    do {
      reloop = false;
      for (var fileName in files) {
        var match;
        while ((match = importRegex.exec(files[fileName]))) {
          var importFilePath = match[1];
          if (importFilePath.startsWith('./')) {
            importFilePath = importFilePath.slice(2);
          }
          importHints.push(importFilePath);
        }
      }
      while (importHints.length > 0) {
        var m = importHints.pop();
        if (m in files) {
          continue;
        }
        if (editor.hasFile(m)) {
          files[m] = editor.getFile(m);
          reloop = true;
        } else if (m in cachedRemoteFiles) {
          files[m] = cachedRemoteFiles[m];
          reloop = true;
        } else if ((githubMatch = /^(https?:\/\/)?(www.)?github.com\/([^\/]*\/[^\/]*)\/(.*)/.exec(m))) {
          handleGithubCall(githubMatch[3], githubMatch[4], function (result) {
            if ('content' in result) {
              var content = Base64.decode(result.content);
              cachedRemoteFiles[m] = content;
              files[m] = content;
              gatherImports(files, importHints, cb);
            } else {
              cb(null, 'Unable to import "' + m + '"');
            }
          }).fail(function () {
            cb(null, 'Unable to import "' + m + '"');
          });
          return;
        } else {
          cb(null, 'Unable to import "' + m + '"');
          return;
        }
      }
    } while (reloop);
    cb({ 'sources': files });
  }
}

module.exports = Compiler;
