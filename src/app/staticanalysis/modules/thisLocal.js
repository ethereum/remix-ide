var name = 'this on local calls'
var desc = 'Invocation of local functions via this'
var categories = require('./categories')
var common = require('./staticAnalysisCommon')

function thisLocal () {
  this.warningNodes = []
}

thisLocal.prototype.visit = function (node) {
  if (common.isThisLocalCall(node)) this.warningNodes.push(node)
}

thisLocal.prototype.report = function (compilationResults) {
  return this.warningNodes.map(function (item, i) {
    return {
      warning: `Use of "this" for local functions: Never use this to call functions in the same contract, it only consumes more gas than normal local calls.`,
      location: item.src,
      more: 'http://solidity.readthedocs.io/en/develop/control-structures.html#external-function-calls'
    }
  })
}

module.exports = {
  name: name,
  description: desc,
  category: categories.GAS,
  Module: thisLocal
}
