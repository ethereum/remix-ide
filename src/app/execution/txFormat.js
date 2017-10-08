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
    var bytecode = contract.evm.bytecode.object
    if (bytecode.indexOf('_') < 0) {
      return callback(null, bytecode)
    }
    var libraryRefMatch = bytecode.match(/__([^_]{1,36})__/)
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
    var library = contracts[libRef[1]][libRef[2]]
    if (!library) {
      return callback('Library ' + libraryName + ' not found.')
    }
    this.deployLibrary(libraryName, library, contracts, udapp, (err, address) => {
      if (err) {
        return callback(err)
      }
      var libLabel = '__' + libraryName + Array(39 - libraryName.length).join('_')
      var hexAddress = address.toString('hex')
      if (hexAddress.slice(0, 2) === '0x') {
        hexAddress = hexAddress.slice(2)
      }
      hexAddress = Array(40 - hexAddress.length + 1).join('0') + hexAddress
      while (bytecode.indexOf(libLabel) >= 0) {
        bytecode = bytecode.replace(libLabel, hexAddress)
      }
      contract.evm.bytecode.object = bytecode
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
