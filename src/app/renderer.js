var $ = require('jquery');

var utils = require('./utils');
var uiHelper = require('./ui-helper');

function Renderer (editor, web3, updateFiles, udapp, executionContext, formalVerificationEvent, compilerEvent) {
  this.editor = editor;
  this.web3 = web3;
  this.updateFiles = updateFiles;
  this.udapp = udapp;
  this.executionContext = executionContext;
  var self = this;
  formalVerificationEvent.register('compilationFinished', this, function (success, message, container, noAnnotations) {
    if (!success) {
      self.error(message, container, noAnnotations);
    }
  });
  compilerEvent.register('compilationFinished', this, function (success, data, source) {
    $('#output').empty();
    if (success) {
      self.contracts(data, source);
    } else {
      data.forEach(function (err) {
        self.error(err);
      });
    }
  });
}

Renderer.prototype.error = function (message, container, noAnnotations) {
  var type = utils.errortype(message);
  var $pre = $('<pre />').text(message);
  var $error = $('<div class="sol ' + type + '"><div class="close"><i class="fa fa-close"></i></div></div>').prepend($pre);
  if (container === undefined) {
    container = $('#output');
  }
  container.append($error);
  var err = message.match(/^([^:]*):([0-9]*):(([0-9]*):)? /);
  if (err) {
    var errFile = err[1];
    var errLine = parseInt(err[2], 10) - 1;
    var errCol = err[4] ? parseInt(err[4], 10) : 0;
    if (!noAnnotations && (errFile === '' || errFile === utils.fileNameFromKey(this.editor.getCacheFile()))) {
      this.editor.addAnnotation({
        row: errLine,
        column: errCol,
        text: message,
        type: type
      });
    }
    $error.click(function (ev) {
      if (errFile !== '' && errFile !== utils.fileNameFromKey(this.editor.getCacheFile()) && this.editor.hasFile(errFile)) {
        // Switch to file
        this.editor.setCacheFile(utils.fileKey(errFile));
        this.updateFiles();
      // @TODO could show some error icon in files with errors
      }
      this.editor.handleErrorClick(errLine, errCol);
    });
    $error.find('.close').click(function (ev) {
      ev.preventDefault();
      $error.remove();
      return false;
    });
  }
};

Renderer.prototype.contracts = function (data, source) {
  var udappContracts = [];
  for (var contractName in data.contracts) {
    var contract = data.contracts[contractName];
    udappContracts.push({
      name: contractName,
      interface: contract['interface'],
      bytecode: contract.bytecode
    });
  }

  // rendering function used by udapp. they need data and source
  var combined = function (contractName, jsonInterface, bytecode) {
    return JSON.stringify([{ name: contractName, interface: jsonInterface, bytecode: bytecode }]);
  };

  var renderOutputModifier = function (contractName, $contractOutput) {
    var contract = data.contracts[contractName];
    if (contract.bytecode) {
      $contractOutput.append(uiHelper.textRow('Bytecode', contract.bytecode));
    }

    $contractOutput.append(uiHelper.textRow('Interface', contract['interface']));

    if (contract.bytecode) {
      $contractOutput.append(uiHelper.textRow('Web3 deploy', uiHelper.gethDeploy(contractName.toLowerCase(), contract['interface'], contract.bytecode), 'deploy'));
    }
    return $contractOutput.append(uiHelper.getDetails(contract, source, contractName));
  };
  // //
  var self = this;

  var getAddress = function () { return $('#txorigin').val(); };

  var getValue = function () {
    var comp = $('#value').val().split(' ');
    return self.executionContext.web3().toWei(comp[0], comp.slice(1).join(' '));
  };

  var getGasLimit = function () { return $('#gasLimit').val(); };

  this.udapp.reset(udappContracts, getAddress, getValue, getGasLimit, renderOutputModifier);

  var $contractOutput = this.udapp.render();

  var $txOrigin = $('#txorigin');

  this.udapp.getAccounts(function (err, accounts) {
    if (err) {
      self.error(err.message);
    }
    if (accounts && accounts[0]) {
      $txOrigin.empty();
      for (var a in accounts) { $txOrigin.append($('<option />').val(accounts[a]).text(accounts[a])); }
      $txOrigin.val(accounts[0]);
    } else {
      $txOrigin.val('unknown');
    }
  });

  $contractOutput.find('.title').click(function (ev) { $(this).closest('.contract').toggleClass('hide'); });
  $('#output').append($contractOutput);
  $('.col2 input,textarea').click(function () { this.select(); });
};

module.exports = Renderer;
