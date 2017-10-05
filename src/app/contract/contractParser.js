'use strict'

var $ = require('jquery')
var txHelper = require('../execution/txHelper')

module.exports = (contractName, contract) => {
  return getDetails(contractName, contract)
}

var getDetails = function (contractName, contract) {
  var detail = {}
  detail.name = contractName
  detail.metadata = contract.metadata
  if (contract.evm.bytecode.object) {
    detail.bytecode = contract.evm.bytecode.object
  }

  detail.abi = contract.abi

  if (contract.bytecode) {
    detail.bytecode = contract.evm.bytecode.object
    detail.web3Deploy = gethDeploy(contractName.toLowerCase(), contract.abi, contract.bytecode)

    detail.metadataHash = retrieveMetadataHash(contract.bytecode)
    if (detail.metadataHash) {
      detail.swarmLocation = 'bzz://' + detail.metadataHash
    }
  }

  detail.functionHashes = {}
  for (var fun in contract.functionHashes) {
    detail.functionHashes[contract.functionHashes[fun]] = fun
  }

  detail.gasEstimates = formatGasEstimates(contract.evm.gasEstimates)

  if (contract.runtimeBytecode && contract.runtimeBytecode.length > 0) {
    detail['Runtime Bytecode'] = contract.runtimeBytecode
  }

  if (contract.opcodes !== undefined && contract.opcodes !== '') {
    detail['Opcodes'] = contract.opcodes
  }

  return detail
}

var retrieveMetadataHash = function (bytecode) {
  var match = /a165627a7a72305820([0-9a-f]{64})0029$/.exec(bytecode)
  if (match) {
    return match[1]
  }
}

var gethDeploy = function (contractName, jsonInterface, bytecode) {
  var code = ''
  var funABI = txHelper.getConstructorInterface(JSON.parse(jsonInterface))

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

  var ret = {}
  var fun
  if ('creation' in data) {
    ret['Creation'] = gasToText(data.creation[0]) + ' + ' + gasToText(data.creation[1]) + '\n'
  }

  if ('external' in data) {
    ret['External'] = {}
    for (fun in data.external) {
      ret['External'][fun] = gasToText(data.external[fun])
    }
  }

  if ('internal' in data) {
    ret['Internal'] = {}
    for (fun in data.internal) {
      ret['Internal'][fun] = gasToText(data.internal[fun])
    }
  }
  return ret
}
