'use strict'
var executionContext = require('../../execution-context')

/*
  Defines available API. `key` / `type`
*/
module.exports = (app, compiler, udapp) => {
  return {
    app: {
      getExecutionContextProvider: () => {
        return executionContext.getProvider()
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
      getCompilationResult: () => {
        return compiler.lastCompilationResult
      }
    },
    udapp: {
      runTx: (tx, cb) => {
        if (executionContext.getProvider() !== 'vm') return cb('plugin API does not allow sending a transaction through a web3 connection. Only vm mode is allowed')
        udapp.runTx(tx, cb)
      },
      getAccounts: (cb) => {
        if (executionContext.getProvider() !== 'vm') return cb('plugin API does not allow retrieving accounts through a web3 connection. Only vm mode is allowed')
        udapp.getAccounts(cb)
      }
    }
  }
}
