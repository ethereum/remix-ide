const Provider = require('./provider.js')

class NodeProvider extends Provider {

  constructor (executionContext, config) {
    // this.config = config
    super(executionContext)
  }

  getAccounts (cb) {
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
