'use strict'

var $ = require('jquery')
var yo = require('yo-yo')

var utils = require('./utils')
var helper = require('../lib/helper.js')

// -------------- styling ----------------------
var csjs = require('csjs-inject')
var styleGuide = require('./style-guide')
var styles = styleGuide()

var css = csjs`
  .crow extends ${styles.infoTextBox}{
    overflow: auto;
    padding: .5em;
    font-size: .9em;
    cursor: default;
    background-color: ${styles.colors.lightBlue};
  }
  .col2 extends ${styles.textBoxL} {
      width: 70%;
      float: left;
      color: ${styles.colors.black};
      background-color: ${styles.colors.white};
  }
  .col1 extends ${styles.titleL} {
      width: 30%;
      float: left;
  }
  .toggleText  {
    text-decoration: underline;
    margin-left: 2px;
    font-size: .9em;
    cursor: pointer;
  }
  .toggle  {
    font-size: 1.1em;
    color: ${styles.colors.blue};
    margin: 1em;
    font-weight: 400;
    display: flex;
    align-items: center;
  }
  .toggle:hover {
    opacity: .8;
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
      $('#header #menu .compileView').css('color', '')
    } else {
      $('#header #menu .compileView').css('color', '#FF8B8B')
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
    $pre = $(opt.useSpan ? '<span />' : '<pre />').html(message)
  } else {
    $pre = $(opt.useSpan ? '<span />' : '<pre />').text(message)
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
  var self = this
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
      "\n     gas: '" + self.appAPI.currentblockGasLimit() + "'" +
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

  var detailsOpen = false
  var getDetails = function (contract, source, contractName) {
    var button = yo`<div class="${css.toggle}" onclick=${toggleDetails}><i class="fa fa-info-circle" aria-hidden="true"></i><div class="${css.toggleText}">Contract details (bytecode, interface etc.)</div></div>`
    var details = yo`<div style="display: none;"></div>`

    if (contract.bytecode) {
      details.appendChild(yo`<div class="${css.crow}"><div class="${css.col1}">Bytecode</div><div class="${css.col2}">${contract.bytecode}</div></div>`)
    }

    details.appendChild(yo`<div class="${css.crow}"><div class="${css.col1}">Interface</div><div class="${css.col2}">${contract['interface']}</div></div>`)

    if (contract.bytecode) {
      var deploy = gethDeploy(contractName.toLowerCase(), contract['interface'], contract.bytecode)
      details.appendChild(yo`<div class="${css.crow}"><div class="${css.col1}">Web3 deploy</div><div class="${css.col2}">${deploy}</div></div>`)

      // check if there's a metadata hash appended
      var metadataHash = retrieveMetadataHash(contract.bytecode)
      if (metadataHash) {
        var location = 'bzzr://' + metadataHash
        details.appendChild(yo`<div class="${css.crow}"><div class="${css.col1}">Metadata location</div><div class="${css.col2}">${location}</div></div>`)
      }
    }

    if (contract.metadata) {
      details.appendChild(yo`<div class="${css.crow}"><div class="${css.col1}">Metadata</div><div class="${css.col2}">${contract.metadata}</div></div>`)
    }

    var funHashes = ''
    for (var fun in contract.functionHashes) {
      funHashes += contract.functionHashes[fun] + ' ' + fun + '\n'
    }
    if (funHashes.length > 0) {
      details.appendChild(yo`<div class="${css.crow}"><div class="${css.col1}">Functions</div><div class="${css.col2}">${funHashes}</div></div>`)
    }

    var gasEstimates = formatGasEstimates(contract.gasEstimates)
    if (gasEstimates) {
      details.appendChild(yo`<div class="${css.crow}"><div class="${css.col1}">Gas Estimates</div><div class="${css.col2}">${gasEstimates}</div></div>`)
    }

    if (contract.runtimeBytecode && contract.runtimeBytecode.length > 0) {
      details.appendChild(yo`<div class="${css.crow}"><div class="${css.col1}">Runtime Bytecode</div><div class="${css.col2}">${contract.runtimeBytecode}</div></div>`)
    }

    if (contract.opcodes !== undefined && contract.opcodes !== '') {
      details.appendChild(yo`<div class="${css.crow}"><div class="${css.col1}">Opcodes</div><div class="${css.col2}">${contract.opcodes}</div></div>`)
    }

    if (contract.assembly !== null) {
      var assembly = formatAssemblyText(contract.assembly, '', source)
      details.appendChild(yo`<div class="${css.crow}"><div class="${css.col1}">Assembly</div><div class="${css.col2}">${assembly}</div></div>`)
    }

    function toggleDetails () {
      if (detailsOpen === false) {
        details.style.display = 'block'
        detailsOpen = true
      } else {
        details.style.display = 'none'
        detailsOpen = false
      }
    }
    var contractDetails = yo`<div class="contractDetails"></div>`
    contractDetails.appendChild(button)
    contractDetails.appendChild(details)

    return contractDetails
  }

  var renderOutputModifier = function (contractName, contractOutput) {
    var contract = data.contracts[contractName]
    var ctrSource = self.appAPI.currentCompiledSourceCode()
    if (ctrSource) {
      contractOutput.appendChild(getDetails(contract, ctrSource, contractName))
    }
    return contractOutput
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
