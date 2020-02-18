const Web3 = require('web3')
const { privateToAddress } = require('ethereumjs-util')
const RemixSimulator = require('remix-simulator')
const Provider = require('./provider.js')

class VMProvider extends Provider {

  constructor (executionContext) {
    super(executionContext)
    this.executionContext = executionContext
    this.RemixSimulatorProvider = new RemixSimulator.Provider({executionContext: this.executionContext})
    this.RemixSimulatorProvider.init()
    this.web3 = new Web3(this.RemixSimulatorProvider)
    this.accounts = {}
  }

  resetEnvironment () {
    this.RemixSimulatorProvider.Accounts.resetAccounts()
    this.accounts = {}
  }

  // TODO: is still here because of the plugin API
  // can be removed later when we update the API
  createVMAccount (newAccount) {
    const { privateKey, balance } = newAccount
    this.RemixSimulatorProvider.Accounts._addAccount(privateKey, balance)
    const privKey = Buffer.from(privateKey, 'hex')
    return '0x' + privateToAddress(privKey).toString('hex')
  }

  newAccount (_passwordPromptCb, cb) {
    this.RemixSimulatorProvider.Accounts.newAccount(cb)
  }

  getProvider () {
    return 'vm'
  }
}

module.exports = VMProvider
