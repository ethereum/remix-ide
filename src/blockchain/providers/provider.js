const Web3 = require('web3')
const { BN, stripHexPrefix } = require('ethereumjs-util')

class Provider {

  constructor (executionContext) {
    this.executionContext = executionContext
    if (this.executionContext) {
      this.web3 = new Web3(this.executionContext.internalWeb3().givenProvider)
    }
  }

  getAccounts (cb) {
    return this.web3.eth.getAccounts(cb)
  }

  newAccount (passwordPromptCb, cb) {
    throw new Error("needs to be implemented");
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
  }

  getProvider () {
    return this.executionContext.getProvider()
  }
}

module.exports = Provider

