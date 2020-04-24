const Web3 = require('web3')
// const { stripHexPrefix, hashPersonalMessage } = require('ethereumjs-util')
// const Personal = require('web3-eth-personal')

const Provider = require('./provider.js')

class NodeProvider extends Provider {

  constructor (executionContext, config) {
    super(executionContext)
    this.executionContext = executionContext
    this.config = config
  }

  getAccounts (cb) {
    if (!this.web3.currentProvider) {
      this.web3 = new Web3(this.executionContext.internalWeb3().currentProvider)
    }
    if (this.config.get('settings/personal-mode')) {
      // return this.executionContext.web3().personal.getListAccounts(cb)
      return this.web3.eth.personal.getAccounts(cb)
    }
    // return this.executionContext.web3().eth.getAccounts(cb)
    return this.web3.eth.getAccounts(cb)
  }

  newAccount (passwordPromptCb, cb) {
    if (!this.config.get('settings/personal-mode')) {
      return cb('Not running in personal mode')
    }
    passwordPromptCb((passphrase) => {
      this.executionContext.web3().personal.newAccount(passphrase, cb)
    })
  }

  getProvider () {
    return this.executionContext.getProvider()
  }
}

module.exports = NodeProvider
