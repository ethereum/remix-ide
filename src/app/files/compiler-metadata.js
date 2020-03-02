'use strict'
var CompilerAbstract = require('../compiler/compiler-abstract')
import { Plugin } from '@remixproject/engine'
import * as packageJson from '../../../package.json'

const profile = {
  name: 'compilerMetadata',
  methods: ['deployMetadataOf'],
  events: [],
  version: packageJson.version
}

class CompilerMetadata extends Plugin {
  constructor (blockchain, fileManager, config) {
    super(profile)
    this.blockchain = blockchain
    this.fileManager = fileManager
    this.config = config
    this.networks = ['VM:-', 'main:1', 'ropsten:3', 'rinkeby:4', 'kovan:42', 'görli:5', 'Custom']
    this.innerPath = 'artifacts'
  }

  _JSONFileName (path, contractName) {
    return path + '/' + this.innerPath + '/' + contractName + '.json'
  }

  onActivation () {
    var self = this
    this.on('solidity', 'compilationFinished', (file, source, languageVersion, data) => {
      if (!self.config.get('settings/generate-contract-metadata')) return
      let compiler = new CompilerAbstract(languageVersion, data, source)
      var provider = self.fileManager.currentFileProvider()
      var path = self.fileManager.currentPath()
      if (provider && path) {
        compiler.visitContracts((contract) => {
          if (contract.file !== source.target) return

          var fileName = self._JSONFileName(path, contract.name)
          provider.get(fileName, (error, content) => {
            if (!error) {
              content = content || '{}'
              var metadata
              try {
                metadata = JSON.parse(content)
              } catch (e) {
                console.log(e)
              }

              var deploy = metadata.deploy || {}
              self.networks.forEach((network) => {
                deploy[network] = self._syncContext(contract, deploy[network] || {})
              })

              var data = {
                deploy,
                data: {
                  bytecode: contract.object.evm.bytecode,
                  deployedBytecode: contract.object.evm.deployedBytecode,
                  gasEstimates: contract.object.evm.gasEstimates,
                  methodIdentifiers: contract.object.evm.methodIdentifiers
                },
                abi: contract.object.abi
              }

              provider.set(fileName, JSON.stringify(data, null, '\t'))
            }
          })
        })
      }
    })
  }

  _syncContext (contract, metadata) {
    var linkReferences = metadata['linkReferences']
    var autoDeployLib = metadata['autoDeployLib']
    if (!linkReferences) linkReferences = {}
    if (autoDeployLib === undefined) autoDeployLib = true

    for (var libFile in contract.object.evm.bytecode.linkReferences) {
      if (!linkReferences[libFile]) linkReferences[libFile] = {}
      for (var lib in contract.object.evm.bytecode.linkReferences[libFile]) {
        if (!linkReferences[libFile][lib]) {
          linkReferences[libFile][lib] = '<address>'
        }
      }
    }
    metadata['linkReferences'] = linkReferences
    metadata['autoDeployLib'] = autoDeployLib
    return metadata
  }

  // TODO: is only called by dropdownLogic and can be moved there
  deployMetadataOf (contractName) {
    return new Promise((resolve, reject) => {
      var provider = this.fileManager.currentFileProvider()
      var path = this.fileManager.currentPath()
      if (provider && path) {
        this.blockchain.detectNetwork((err, { id, name } = {}) => {
          if (err) {
            console.log(err)
            reject(err)
          } else {
            var fileName = this._JSONFileName(path, contractName)
            provider.get(fileName, (error, content) => {
              if (error) return reject(error)
              if (!content) return resolve()
              try {
                var metadata = JSON.parse(content)
                metadata = metadata.deploy || {}
                return resolve(metadata[name + ':' + id] || metadata[name] || metadata[id] || metadata[name.toLowerCase() + ':' + id] || metadata[name.toLowerCase()])
              } catch (e) {
                reject(e.message)
              }
            })
          }
        })
      } else {
        reject(`Please select the folder in the file explorer where the metadata of ${contractName} can be found`)
      }
    })
  }
}

module.exports = CompilerMetadata
