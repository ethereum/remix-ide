const Web3 = require('web3')
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
      return this.web3.eth.personal.getAccounts(cb)
    }
    return this.web3.eth.getAccounts(cb)
  }

  newAccount (passwordPromptCb, cb) {
    if (!this.config.get('settings/personal-mode')) {
      return cb('Not running in personal mode')
    }
    passwordPromptCb((passphrase) => {
      this.web3.eth.personal.newAccount(passphrase, cb)
    })
  }

  getProvider () {
    // return "web3"
    return this.executionContext.getProvider()
  }
}

module.exports = NodeProvider
