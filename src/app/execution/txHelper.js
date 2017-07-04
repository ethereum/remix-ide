'use strict'
var ethJSABI = require('ethereumjs-abi')

module.exports = {
  encodeParams: function (funABI, args) {
    var types = []
    for (var i = 0; i < funABI.inputs.length; i++) {
      types.push(funABI.inputs[i].type)
    }

    // NOTE: the caller will concatenate the bytecode and this
    //       it could be done here too for consistency
    return ethJSABI.rawEncode(types, args).toString('hex')
  },

  encodeFunctionId: function (funABI) {
    var types = []
    for (var i = 0; i < funABI.inputs.length; i++) {
      types.push(funABI.inputs[i].type)
    }

    return ethJSABI.methodID(funABI.name, types)
  },

  sortAbiFunction: function (contract) {
    var abi = JSON.parse(contract.interface).sort(function (a, b) {
      if (a.name > b.name) {
        return -1
      } else {
        return 1
      }
    }).sort(function (a, b) {
      if (a.constant === true) {
        return -1
      } else {
        return 1
      }
    })
    return abi
  },

  getConstructorInterface: function (abi) {
    for (var i = 0; i < abi.length; i++) {
      if (abi[i].type === 'constructor') {
        return abi[i]
      }
    }

    return { 'type': 'constructor', 'payable': false, 'inputs': [] }
  },

  getFunction: function (abi, fnName) {
    for (var i = 0; i < abi.length; i++) {
      if (abi[i].name === fnName) {
        return abi[i]
      }
    }
    return null
  },

  getFallbackInterface: function (abi) {
    for (var i = 0; i < abi.length; i++) {
      if (abi[i].type === 'fallback') {
        return abi[i]
      }
    }
  },

  getContractByName: function (contractName, contracts) {
    for (var c in contracts) {
      if (contracts[c].name === contractName) {
        return contracts[c]
      }
    }
    return null
  }
}
