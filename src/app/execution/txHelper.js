'use strict'
var ethJSABI = require('ethereumjs-abi')
var $ = require('jquery')

module.exports = {
  encodeParams: function (funABI, args) {
    var types = []
    if (funABI.inputs && funABI.inputs.length) {
      for (var i = 0; i < funABI.inputs.length; i++) {
        var type = funABI.inputs[i].type
        types.push(type)
        if (args.length < types.length) {
          args.push('')
        }
      }
    }

    // NOTE: the caller will concatenate the bytecode and this
    //       it could be done here too for consistency
    return ethJSABI.rawEncode(types, args)
  },

  encodeFunctionId: function (funABI) {
    var types = []
    if (funABI.inputs && funABI.inputs.length) {
      for (var i = 0; i < funABI.inputs.length; i++) {
        types.push(funABI.inputs[i].type)
      }
    }

    return ethJSABI.methodID(funABI.name, types)
  },

  sortAbiFunction: function (contract) {
    var abi = contract.abi.sort(function (a, b) {
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
    var funABI = { 'name': '', 'inputs': [], 'type': 'constructor', 'outputs': [] }
    if (typeof abi === 'string') {
      try {
        abi = JSON.parse(abi)
      } catch (e) {
        console.log('exception retrieving ctor abi ' + abi)
        return funABI
      }
    }

    for (var i = 0; i < abi.length; i++) {
      if (abi[i].type === 'constructor') {
        funABI.inputs = abi[i].inputs || []
        break
      }
    }

    return funABI
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

  /**
    * return the contract obj of the given @arg name. Uses last compilation result.
    * return null if not found
    * @param {String} name    - contract name
    * @returns contract obj and associated file: { contract, file } or null
    */
  getContract: (contractName, contracts) => {
    for (var file in contracts) {
      if (contracts[file][contractName]) {
        return { object: contracts[file][contractName], file: file }
      }
    }
    return null
  },

  /**
    * call the given @arg cb (function) for all the contracts. Uses last compilation result
    * stop visiting when cb return true
    * @param {Function} cb    - callback
    */
  visitContracts: (contracts, cb) => {
    for (var file in contracts) {
      for (var name in contracts[file]) {
        if (cb({ name: name, object: contracts[file][name], file: file })) return
      }
    }
  },

  inputParametersDeclarationToString: function (abiinputs) {
    var inputs = ''
    if (abiinputs) {
      $.each(abiinputs, function (i, inp) {
        if (inputs !== '') {
          inputs += ', '
        }
        inputs += inp.type + ' ' + inp.name
      })
    }
    return inputs
  }
}
