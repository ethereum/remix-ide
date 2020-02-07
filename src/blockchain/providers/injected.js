const Web3 = require('web3')
const { stripHexPrefix } = require('ethereumjs-util')

class InjectedProvider {

  constructor (executionContext) {
    this.executionContext = executionContext
    this.web3 = new Web3(this.executionContext.internalWeb3().givenProvider)
  }

  getAccounts (cb) {
    return this.web3.eth.getAccounts(cb)
  }

  newAccount (passwordPromptCb, cb) {
    throw new Error("not allowed in an injected provider")
    // passwordPromptCb((passphrase) => {
      // this.executionContext.web3().personal.newAccount(passphrase, cb)
    // })
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

  signMessage (message, account, _passphrase, cb) {
    const hashedMsg = Web3.utils.sha3(message)

    this.web3.eth.sign(hashedMsg, account, (error, signedData) => {
      if (error) {
        return cb(error)
      }
      cb(null, hashedMsg, signedData)
    })
  }

  getProvider () {
    return 'injected'
  }
}

module.exports = InjectedProvider
