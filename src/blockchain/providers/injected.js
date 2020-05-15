// const Web3 = require('web3')
// const { stripHexPrefix, hashPersonalMessage } = require('ethereumjs-util')

const Provider = require('./provider.js')

class InjectedProvider extends Provider {

  // constructor (executionContext) {
  //   this.executionContext = executionContext
  // }

  newAccount (passwordPromptCb, cb) {
    throw new Error('not allowed in injected provider')
  }

  getProvider () {
    return 'injected'
  }
}

module.exports = InjectedProvider
