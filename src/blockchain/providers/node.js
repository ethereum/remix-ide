const Web3 = require('web3')
const { stripHexPrefix } = require('ethereumjs-util')
// const Personal = require('web3-eth-personal')

class NodeProvider {

  constructor (executionContext, config) {
    this.executionContext = executionContext
    this.web3 = new Web3(this.executionContext.internalWeb3().givenProvider)
    this.config = config
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

  resetEnvironment () {
  }

  getBalanceInEther (address, cb) {
    address = stripHexPrefix(address)
    this.web3.eth.getBalance(address, (err, res) => {
      if (err) {
        return cb(err)
      }
      // cb(null, Web3.utils.fromWei(res.toString(10), 'ether'))
      cb(null, Web3.utils.fromWei(new BN(res).toString(10), 'ether'))
    })
  }

  getGasPrice (cb) {
    this.web3.eth.getGasPrice(cb)
  }

  signMessage (message, account, passphrase, cb) {
    const hashedMsg = Web3.utils.sha3(message)

    this.web3.eth.sign(hashedMsg, account, (error, signedData) => {
      if (error) {
        return cb(error)
      }
      cb(null, hashedMsg, signedData)
    })

    // try {
      // const personal = new Personal(this.executionContext.web3().currentProvider)
      // personal.sign(hashedMsg, account, passphrase, (error, signedData) => {
        // cb(error, hashedMsg, signedData)
      // })
    // } catch (e) {
      // cb(e.message)
    // }
  }

  getProvider () {
    return this.executionContext.getProvider()
  }
}

module.exports = NodeProvider
