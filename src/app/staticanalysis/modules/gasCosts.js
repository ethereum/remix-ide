var name = 'Gas costs: '
var desc = 'Warn if the gas requirements of functions are too high.'
var categories = require('./categories')
var txHelper = require('../../execution/txHelper')

function gasCosts () {
}

gasCosts.prototype.report = function (compilationResults) {
  var report = []
  txHelper.visitContracts(compilationResults.contracts, (contract) => {
    if (
      !contract.object.evm.gasEstimates ||
      !contract.object.evm.gasEstimates.external
    ) {
      return
    }
    var fallback = contract.object.evm.gasEstimates.external['']
    if (fallback !== undefined) {
      if (fallback === null || fallback >= 2100 || fallback === 'infinite') {
        report.push({
          warning: `Fallback function of contract ${contract.name} requires too much gas (${fallback}).<br />
          If the fallback function requires more than 2300 gas, the contract cannot receive Ether.`
        })
      }
    }

    for (var functionName in contract.object.evm.gasEstimates.external) {
      if (functionName === '') {
        continue
      }
      var gas = contract.object.evm.gasEstimates.external[functionName]
      var gasString = gas === null ? 'unknown or not constant' : 'high: ' + gas
      if (gas === null || gas >= 3000000 || gas === 'infinite') {
        report.push({
          warning: `Gas requirement of function ${contract.name}.${functionName} ${gasString}.<br />
          If the gas requirement of a function is higher than the block gas limit, it cannot be executed.
          Please avoid loops in your functions or actions that modify large areas of storage
          (this includes clearing or copying arrays in storage)`
        })
      }
    }
  })
  return report
}

module.exports = {
  name: name,
  description: desc,
  category: categories.GAS,
  Module: gasCosts
}
