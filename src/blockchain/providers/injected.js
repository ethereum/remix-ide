const Provider = require('./provider.js')

class InjectedProvider extends Provider {

  constructor (executionContext) {
    super(executionContext)
  }

  newAccount (passwordPromptCb, cb) {
    throw new Error("not allowed in an injected provider")
  }

  getProvider () {
    return 'injected'
  }
}

module.exports = InjectedProvider
