'use strict'
var executionContext = require('../../execution-context')

/*
  Defines available API. `key` / `type`
*/
module.exports = (app, opts, tabbedMenu) => {
  return {
    app: {
      getExecutionContextProvider: (mod, cb) => {
        cb(null, executionContext.getProvider())
      },
      updateTitle: (mod, title, cb) => {
        tabbedMenu.updateTabTitle(mod, title)
      }
    },
    config: {
      setConfig: (mod, path, content, cb) => {
        opts.app._api.filesProviders['config'].set(mod + '/' + path, content)
        cb()
      },
      getConfig: (mod, path, cb) => {
        cb(null, opts.app._api.filesProviders['config'].get(mod + '/' + path))
      },
      removeConfig: (mod, path, cb) => {
        cb(null, opts.app._api.filesProviders['config'].remove(mod + '/' + path))
        if (cb) cb()
      }
    },
    compiler: {
      getCompilationResult: (mod, cb) => {
        cb(null, opts.compiler.lastCompilationResult)
      }
    },
    udapp: {
      runTx: (mod, tx, cb) => {
        if (executionContext.getProvider() !== 'vm') return cb('plugin API does not allow sending a transaction through a web3 connection. Only vm mode is allowed')
        opts.udapp.silentRunTx(tx, (error, result) => {
          if (error) return cb(error)
          cb(null, {
            transactionHash: result.transactionHash,
            status: result.result.status,
            gasUsed: '0x' + result.result.gasUsed.toString('hex'),
            error: result.result.vm.exceptionError,
            return: result.result.vm.return ? '0x' + result.result.vm.return.toString('hex') : '0x',
            createdAddress: result.result.createdAddress ? '0x' + result.result.createdAddress.toString('hex') : undefined
          })
        })
      },
      getAccounts: (mod, cb) => {
        if (executionContext.getProvider() !== 'vm') return cb('plugin API does not allow retrieving accounts through a web3 connection. Only vm mode is allowed')
        opts.udapp.getAccounts(cb)
      },
      createVMAccount: (mod, privateKey, balance, cb) => {
        if (executionContext.getProvider() !== 'vm') return cb('plugin API does not allow creating a new account through web3 connection. Only vm mode is allowed')
        opts.udapp.createVMAccount(privateKey, balance, (error, address) => {
          cb(error, address)
        })
      }
    }
  }
}
