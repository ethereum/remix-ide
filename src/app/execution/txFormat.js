'use strict'
var $ = require('jquery')
var ethJSABI = require('ethereumjs-abi')
var ethJSUtil = require('ethereumjs-util')
var BN = ethJSUtil.BN
var helper = require('./txHelper')
var TreeView = require('ethereum-remix').ui.TreeView
var executionContext = require('../../execution-context')

module.exports = {
  /**
    * build the transaction data
    *
    * @param {Object} contract    - abi definition of the current contract.
    * @param {Object} contracts    - map of all compiled contracts.
    * @param {Bool} isConstructor    - isConstructor.
    * @param {Object} funAbi    - abi definition of the function to call. null if building data for the ctor.
    * @param {Object} params    - input paramater of the function to call
    * @param {Object} udapp    - udapp
    * @param {Function} callback    - callback
    * @param {Function} callbackStep  - callbackStep
    */
  buildData: function (contract, contracts, isConstructor, funAbi, params, udapp, callback, callbackStep) {
    var funArgs = ''
    try {
      funArgs = $.parseJSON('[' + params + ']')
    } catch (e) {
      callback('Error encoding arguments: ' + e)
      return
    }
    var data = ''
    var dataHex = ''
    if (!isConstructor || funArgs.length > 0) {
      try {
        data = helper.encodeParams(funAbi, funArgs)
        dataHex = data.toString('hex')
      } catch (e) {
        callback('Error encoding arguments: ' + e)
        return
      }
    }
    if (data.slice(0, 9) === 'undefined') {
      dataHex = data.slice(9)
    }
    if (data.slice(0, 2) === '0x') {
      dataHex = data.slice(2)
    }
    if (isConstructor) {
      var bytecodeToDeploy = contract.evm.bytecode.object
      if (bytecodeToDeploy.indexOf('_') >= 0) {
        this.linkBytecode(contract, contracts, udapp, (err, bytecode) => {
          if (err) {
            callback('Error deploying required libraries: ' + err)
          } else {
            bytecodeToDeploy = bytecode + dataHex
            return callback(null, bytecodeToDeploy)
          }
        }, callbackStep)
        return
      } else {
        dataHex = bytecodeToDeploy + dataHex
      }
    } else {
      dataHex = Buffer.concat([helper.encodeFunctionId(funAbi), data]).toString('hex')
    }
    callback(null, dataHex)
  },

  atAddress: function () {},

  linkBytecode: function (contract, contracts, udapp, callback, callbackStep) {
    if (contract.evm.bytecode.object.indexOf('_') < 0) {
      return callback(null, contract.evm.bytecode.object)
    }
    var libraryRefMatch = contract.evm.bytecode.object.match(/__([^_]{1,36})__/)
    if (!libraryRefMatch) {
      return callback('Invalid bytecode format.')
    }
    var libraryName = libraryRefMatch[1]
    // file_name:library_name
    var libRef = libraryName.match(/(.*):(.*)/)
    if (!libRef) {
      return callback('Cannot extract library reference ' + libraryName)
    }
    if (!contracts[libRef[1]] || !contracts[libRef[1]][libRef[2]]) {
      return callback('Cannot find library reference ' + libraryName)
    }
    var libraryShortName = libRef[2]
    var library = contracts[libRef[1]][libraryShortName]
    if (!library) {
      return callback('Library ' + libraryName + ' not found.')
    }
    this.deployLibrary(libraryName, library, contracts, udapp, (err, address) => {
      if (err) {
        return callback(err)
      }
      var hexAddress = address.toString('hex')
      if (hexAddress.slice(0, 2) === '0x') {
        hexAddress = hexAddress.slice(2)
      }
      contract.evm.bytecode.object = this.linkLibraryStandard(libraryShortName, hexAddress, contract)
      contract.evm.bytecode.object = this.linkLibrary(libraryName, hexAddress, contract.evm.bytecode.object)
      this.linkBytecode(contract, contracts, udapp, callback, callbackStep)
    }, callbackStep)
  },

  deployLibrary: function (libraryName, library, contracts, udapp, callback, callbackStep) {
    var address = library.address
    if (address) {
      return callback(null, address)
    }
    var bytecode = library.evm.bytecode.object
    if (bytecode.indexOf('_') >= 0) {
      this.linkBytecode(libraryName, contracts, udapp, (err, bytecode) => {
        if (err) callback(err)
        else this.deployLibrary(libraryName, library, contracts, udapp, callback, callbackStep)
      }, callbackStep)
    } else {
      callbackStep(`creation of library ${libraryName} pending...`)
      udapp.runTx({ data: bytecode, useCall: false }, (err, txResult) => {
        if (err) {
          return callback(err)
        }
        var address = executionContext.isVM() ? txResult.result.createdAddress : txResult.result.contractAddress
        library.address = address
        callback(err, address)
      })
    }
  },

  linkLibraryStandard: function (libraryName, address, contract) {
    var bytecode = contract.evm.bytecode.object
    for (var file in contract.evm.bytecode.linkReferences) {
      for (var libName in contract.evm.bytecode.linkReferences[file]) {
        if (libraryName === libName) {
          bytecode = this.setLibraryAddress(address, bytecode, contract.evm.bytecode.linkReferences[file][libName])
        }
      }
    }
    return bytecode
  },

  setLibraryAddress: function (address, bytecodeToLink, positions) {
    if (positions) {
      for (var pos of positions) {
        var regpos = bytecodeToLink.match(new RegExp(`(.{${2 * pos.start}})(.{${2 * pos.length}})(.*)`))
        if (regpos) {
          bytecodeToLink = regpos[1] + address + regpos[3]
        }
      }
    }
    return bytecodeToLink
  },

  linkLibrary: function (libraryName, address, bytecodeToLink) {
    var libLabel = '__' + libraryName + Array(39 - libraryName.length).join('_')
    if (bytecodeToLink.indexOf(libLabel) === -1) return bytecodeToLink

    address = Array(40 - address.length + 1).join('0') + address
    while (bytecodeToLink.indexOf(libLabel) >= 0) {
      bytecodeToLink = bytecodeToLink.replace(libLabel, address)
    }
    return bytecodeToLink
  },

  decodeResponseToTreeView: function (response, fnabi) {
    var treeView = new TreeView({
      extractData: (item, parent, key) => {
        var ret = {}
        if (BN.isBN(item)) {
          ret.self = item.toString(10)
          ret.children = []
        } else {
          ret = treeView.extractDataDefault(item, parent, key)
        }
        return ret
      }
    })
    return treeView.render(this.decodeResponse(response, fnabi))
  },

  decodeResponse: function (response, fnabi) {
    // Only decode if there supposed to be fields
    if (fnabi.outputs && fnabi.outputs.length > 0) {
      try {
        var i

        var outputTypes = []
        for (i = 0; i < fnabi.outputs.length; i++) {
          outputTypes.push(fnabi.outputs[i].type)
        }

        // decode data
        var decodedObj = ethJSABI.rawDecode(outputTypes, response)

        // format decoded data
        decodedObj = ethJSABI.stringify(outputTypes, decodedObj)
        var json = {}
        for (i = 0; i < outputTypes.length; i++) {
          var name = fnabi.outputs[i].name
          json[i] = outputTypes[i] + ': ' + (name ? name + ' ' + decodedObj[i] : decodedObj[i])
        }

        return json
      } catch (e) {
        return { error: 'Failed to decode output: ' + e }
      }
    }
    return {}
  }
}
