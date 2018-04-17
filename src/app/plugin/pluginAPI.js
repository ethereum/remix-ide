'use strict'
var executionContext = require('../../execution-context')

/*
  Defines available API. `key` / `type`
*/
module.exports = (app, compiler, udapp) => {
  return {
    app: {
      getExecutionContextProvider: (mod, cb) => {
        cb(null, executionContext.getProvider())
      }
    },
    config: {
      setConfig: (mod, path, content, cb) => {
        app._api.filesProviders['config'].set(mod + '/' + path, content)
        cb()
      },
      getConfig: (mod, path, cb) => {
        cb(null, app._api.filesProviders['config'].get(mod + '/' + path))
      },
      removeConfig: (mod, path, cb) => {
        cb(null, app._api.filesProviders['config'].remove(mod + '/' + path))
        if (cb) cb()
      }
    },
    compiler: {
      getCompilationResult: (mod, cb) => {
        cb(null, compiler.lastCompilationResult)
      }
    },
    udapp: {
      runTx: (mod, tx, cb) => {
        if (executionContext.getProvider() !== 'vm') return cb('plugin API does not allow sending a transaction through a web3 connection. Only vm mode is allowed')
        udapp.runTx(tx, cb)
      },
      getAccounts: (mod, cb) => {
        if (executionContext.getProvider() !== 'vm') return cb('plugin API does not allow retrieving accounts through a web3 connection. Only vm mode is allowed')
        udapp.getAccounts(cb)
      },
      createVMAccount: (mod, privateKey, balance, cb) => {
        if (executionContext.getProvider() !== 'vm') return cb('plugin API does not allow creating a new account through web3 connection. Only vm mode is allowed')
        udapp.createVMAccount(privateKey, balance, (error, address) => {
          cb(error, address)
        })
      }
    }
  }
}
