'use strict'
var ENS = require('ethereum-ens')
var ethJSABI = require('ethereumjs-abi')

module.exports = {
  ownerOf: function (targetAddress, web3, cb) {
    var ens = new ENS(web3)
    ens.owner(targetAddress.toLowerCase().replace('0x', '') + '.addr.reverse').then(function (owner) {
      cb(null, owner)
    }).catch((error) => {
      cb(error)
    })
  },

  setABI: function (abi, targetAddress, sender, web3, estimate, cb) {
    var ens = new ENS(web3)
    resolver(ens, targetAddress, (error, res) => {
      if (error) return cb(error)
      setABI(ens, res, targetAddress.toLowerCase().replace('0x', '') + '.addr.reverse', 1, abi, sender, web3, estimate, (error, result) => {
        cb(error, result)
      })
    })
  }
}

function setABI (ens, resolver, nodehash, contentType, abi, sender, web3, estimate, cb) {
  var types = ['bytes32', 'uint256', 'bytes']
  abi = JSON.stringify(abi).replace(/\s+/g, '')
  var input = [nodehash, contentType, JSON.stringify(abi)]
  var data = '0x' + Buffer.concat([ ethJSABI.methodID('setABI', types), ethJSABI.rawEncode(types, input) ]).toString('hex')
  var tx = { from: sender, to: resolver, gas: 470000, data: data }
  if (estimate) {
    web3.eth.estimateGas(tx, (error, gasEstimation) => {
      cb(error, gasEstimation)
    })
  } else {
    web3.eth.sendTransaction(tx, (error, result) => {
      cb(error, result)
    })
  }
}

function resolver (ens, targetAddress, cb) {
  ens.resolver(targetAddress.toLowerCase().replace('0x', '') + '.addr.reverse').resolverAddress().then((resolver) => { cb(null, resolver) }).catch((error) => { cb(error) })
}

/*
function reverseRegistrar (ens, cb) {
  ens.owner('addr.reverse').then((reverseRegistrar) => {
    cb(null, reverseRegistrar)
  }).catch((error) => {
    cb(error)
  })
}
*/
