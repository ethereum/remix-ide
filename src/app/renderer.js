'use strict'

var $ = require('jquery')

var utils = require('./utils')
var helper = require('../lib/helper.js')

// -------------- styling ----------------------
var csjs = require('csjs-inject')
var styleGuide = require('./style-guide')
var styles = styleGuide()

var css = csjs`
  .col2 {
      width: 70%;
      float: left;
  }
  .col1 extends ${styles.titleL} {
      width: 30%;
      float: left;
  }
  .toggleText  {
    text-decoration: underline;
    margin-left: 2px;
    font-size: .9em;
  }
  .toggle  {
    font-size: 1.1em;
    color: ${styles.colors.blue};
    margin: 1em;
    cursor: pointer;
    font-weight: 400;
    display: flex;
    align-items: center;
  }
  .toggle:hover {
    opacity: .8;
  }
  .pre {
    padding: 8px 15px;
    background: #f8f8f8;
    border-radius: 5px;
    border: 1px solid #e5e5e5;
    overflow-x: auto;
    font-family: Monaco, Bitstream Vera Sans Mono, Lucida Console, Terminal, monospace;
    color: #333;
    font-size: 12px;
    margin: 0 0 20px;
  }
  @media print, screen and (max-width: 720px) {
    pre {
      word-wrap: normal;
    }
  }
`
// ----------------------------------------------

function Renderer (appAPI, compilerEvent) {
  this.appAPI = appAPI
  var self = this
  compilerEvent.register('compilationFinished', this, function (success, data, source) {
    $('#output').empty()
    if (success) {
      self.contracts(data, source)
      $('#header #menu .envView').css('color', '')
    } else {
      // envView is the `Contract` tab, as a refactor the entire envView should have his own module
      $('#header #menu .envView').css('color', '#FF8B8B')
    }

    // NOTE: still need to display as there might be warnings
    if (data['error']) {
      self.error(data['error'])
    }
    if (data['errors']) {
      data['errors'].forEach(function (err) {
        self.error(err)
      })
    }
  })
  setInterval(() => { updateAccountBalances(self, appAPI) }, 1000)
}

Renderer.prototype.clear = function () {
  $('#output').empty()
}

Renderer.prototype.error = function (message, container, options) {
  var self = this
  var opt = options || {}
  if (!opt.type) {
    opt.type = utils.errortype(message)
  }
  var $pre
  if (opt.isHTML) {
    $pre = $(opt.useSpan ? '<span />' : '<pre class="' + css.pre + '" />').html(message)
  } else {
    $pre = $(opt.useSpan ? '<span />' : '<pre class="' + css.pre + '" />').text(message)
  }
  var $error = $('<div class="sol ' + opt.type + '"><div class="close"><i class="fa fa-close"></i></div></div>').prepend($pre)
  if (container === undefined) {
    container = $('#output')
  }
  container.append($error)
  var err = message.match(/^([^:]*):([0-9]*):(([0-9]*):)? /)
  if (err) {
    var errFile = err[1]
    var errLine = parseInt(err[2], 10) - 1
    var errCol = err[4] ? parseInt(err[4], 10) : 0
    if (!opt.noAnnotations) {
      self.appAPI.error(errFile, {
        row: errLine,
        column: errCol,
        text: message,
        type: opt.type
      })
    }
    $error.click(function (ev) {
      self.appAPI.errorClick(errFile, errLine, errCol)
    })
  }
  $error.find('.close').click(function (ev) {
    ev.preventDefault()
    $error.remove()
    return false
  })
}

Renderer.prototype.contracts = function (data, source) {
  var retrieveMetadataHash = function (bytecode) {
    var match = /a165627a7a72305820([0-9a-f]{64})0029$/.exec(bytecode)
    if (match) {
      return match[1]
    }
  }

  var udappContracts = []
  for (var contractName in data.contracts) {
    var contract = data.contracts[contractName]
    udappContracts.push({
      name: contractName,
      interface: contract['interface'],
      bytecode: contract.bytecode,
      metadata: contract.metadata,
      metadataHash: contract.bytecode && retrieveMetadataHash(contract.bytecode)
    })
  }

  var tableRowItems = function (first, second, cls) {
    second.get(0).classList.add(styles.textBoxL) // replace <pre> styling with textBoxL
    return $('<div class="crow"/>')
      .addClass(cls)
      .append($(`<div class="${css.col1}">`).append(first))
      .append($(`<div class="${css.col2}">`).append(second))
  }

  var tableRow = function (description, data) {
    return tableRowItems(
      $('<span/>').text(description),
      $(`<input class="${css.col2} ${styles.textBoxL}" readonly="readonly"/>`).val(data))
  }

  var preRow = function (description, data) {
    return tableRowItems(
      $('<span/>').text(description),
      $('<pre class="' + css.pre + '" />').text(data)
    )
  }

  var formatAssemblyText = function (asm, prefix, source) {
    if (typeof asm === typeof '' || asm === null || asm === undefined) {
      return prefix + asm + '\n'
    }
    var text = prefix + '.code\n'
    $.each(asm['.code'], function (i, item) {
      var v = item.value === undefined ? '' : item.value
      var src = ''
      if (item.begin !== undefined && item.end !== undefined) {
        src = source.slice(item.begin, item.end).replace('\n', '\\n', 'g')
      }
      if (src.length > 30) {
        src = src.slice(0, 30) + '...'
      }
      if (item.name !== 'tag') {
        text += '  '
      }
      text += prefix + item.name + ' ' + v + '\t\t\t' + src + '\n'
    })
    text += prefix + '.data\n'
    if (asm['.data']) {
      $.each(asm['.data'], function (i, item) {
        text += '  ' + prefix + '' + i + ':\n'
        text += formatAssemblyText(item, prefix + '    ', source)
      })
    }
    return text
  }

  var getConstructorInterface = function (abi) {
    var funABI = { 'name': '', 'inputs': [], 'type': 'constructor', 'outputs': [] }
    for (var i = 0; i < abi.length; i++) {
      if (abi[i].type === 'constructor') {
        funABI.inputs = abi[i].inputs || []
        break
      }
    }
    return funABI
  }

  var gethDeploy = function (contractName, jsonInterface, bytecode) {
    var code = ''
    var funABI = getConstructorInterface(JSON.parse(jsonInterface))

    funABI.inputs.forEach(function (inp) {
      code += 'var ' + inp.name + ' = /* var of type ' + inp.type + ' here */ ;\n'
    })

    contractName = contractName.replace(/[:./]/g, '_')
    code += 'var ' + contractName + 'Contract = web3.eth.contract(' + jsonInterface.replace('\n', '') + ');' +
      '\nvar ' + contractName + ' = ' + contractName + 'Contract.new('

    funABI.inputs.forEach(function (inp) {
      code += '\n   ' + inp.name + ','
    })

    code += '\n   {' +
      '\n     from: web3.eth.accounts[0], ' +
      "\n     data: '0x" + bytecode + "', " +
      "\n     gas: '4700000'" +
      '\n   }, function (e, contract){' +
      '\n    console.log(e, contract);' +
      "\n    if (typeof contract.address !== 'undefined') {" +
      "\n         console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);" +
      '\n    }' +
      '\n })'

    return code
  }

  var formatGasEstimates = function (data) {
    // FIXME: the whole gasEstimates object should be nil instead
    if (data.creation === undefined && data.external === undefined && data.internal === undefined) {
      return
    }

    var gasToText = function (g) {
      return g === null ? 'unknown' : g
    }

    var text = ''
    var fun
    if ('creation' in data) {
      text += 'Creation: ' + gasToText(data.creation[0]) + ' + ' + gasToText(data.creation[1]) + '\n'
    }

    if ('external' in data) {
      text += 'External:\n'
      for (fun in data.external) {
        text += '  ' + fun + ': ' + gasToText(data.external[fun]) + '\n'
      }
    }

    if ('internal' in data) {
      text += 'Internal:\n'
      for (fun in data.internal) {
        text += '  ' + fun + ': ' + gasToText(data.internal[fun]) + '\n'
      }
    }
    return text
  }

  var detailsOpen = {}
  var getDetails = function (contract, source, contractName) {
    var button = $(`<div class="${css.toggle}"><i class="fa fa-info-circle" aria-hidden="true"></i><div class="${css.toggleText}">Contract details (bytecode, interface etc.)</div></div>`)
    var details = $('<div style="display: none;"/>')

    if (contract.bytecode) {
      details.append(preRow('Bytecode', contract.bytecode))
    }

    details.append(preRow('Interface', contract['interface']))

    if (contract.bytecode) {
      details.append(preRow('Web3 deploy', gethDeploy(contractName.toLowerCase(), contract['interface'], contract.bytecode), 'deploy'))

      // check if there's a metadata hash appended
      var metadataHash = retrieveMetadataHash(contract.bytecode)
      if (metadataHash) {
        details.append(preRow('Metadata location', 'bzzr://' + metadataHash))
      }
    }

    if (contract.metadata) {
      details.append(preRow('Metadata', contract.metadata))
    }

    var funHashes = ''
    for (var fun in contract.functionHashes) {
      funHashes += contract.functionHashes[fun] + ' ' + fun + '\n'
    }
    if (funHashes.length > 0) {
      details.append(preRow('Functions', funHashes))
    }

    var gasEstimates = formatGasEstimates(contract.gasEstimates)
    if (gasEstimates) {
      details.append(preRow('Gas Estimates', gasEstimates))
    }

    if (contract.runtimeBytecode && contract.runtimeBytecode.length > 0) {
      details.append(tableRow('Runtime Bytecode', contract.runtimeBytecode))
    }

    if (contract.opcodes !== undefined && contract.opcodes !== '') {
      details.append(tableRow('Opcodes', contract.opcodes))
    }

    if (contract.assembly !== null) {
      details.append(preRow('Assembly', formatAssemblyText(contract.assembly, '', source)))
    }

    button.click(function () {
      detailsOpen[contractName] = !detailsOpen[contractName]
      details.toggle()
    })
    if (detailsOpen[contractName]) {
      details.show()
    }
    return $('<div class="contractDetails"/>').append(button).append(details)
  }

  var self = this
  var renderOutputModifier = function (contractName, $contractOutput) {
    var contract = data.contracts[contractName]
    var ctrSource = self.appAPI.currentCompiledSourceCode()
    if (ctrSource) {
      $contractOutput.append(getDetails(contract, ctrSource, contractName))
    }
    return $contractOutput
  }

  this.appAPI.resetDapp(udappContracts, renderOutputModifier)

  var $contractOutput = this.appAPI.renderDapp()

  var $txOrigin = $('#txorigin')

  this.appAPI.getAccounts(function (err, accounts) {
    if (err) {
      self.error(err.message)
    }
    if (accounts && accounts[0]) {
      $txOrigin.empty()
      for (var a in accounts) { $txOrigin.append($('<option />').val(accounts[a]).text(accounts[a])) }
      $txOrigin.val(accounts[0])
    } else {
      $txOrigin.val('unknown')
    }
  })

  $('#output').append($contractOutput)
  $('.' + css.col2 + ' input,textarea').click(function () { this.select() })
}

function updateAccountBalances (self, appAPI) {
  var accounts = $('#txorigin').children('option')
  accounts.each(function (index, value) {
    (function (acc) {
      appAPI.getBalance(accounts[acc].value, function (err, res) {
        if (!err) {
          accounts[acc].innerText = helper.shortenAddress(accounts[acc].value, res)
        }
      })
    })(index)
  })
}

module.exports = Renderer
