var name = 'Inline assembly: '
var desc = 'Use of Inline Assembly'
var categories = require('./categories')
var common = require('./staticAnalysisCommon')
var yo = require('yo-yo')

function inlineAssembly () {
  this.inlineAssNodes = []
}

inlineAssembly.prototype.visit = function (node) {
  if (common.isInlineAssembly(node)) this.inlineAssNodes.push(node)
}

inlineAssembly.prototype.report = function (compilationResults) {
  return this.inlineAssNodes.map((node) => {
    return {
      warning: yo`<span>CAUTION: The Contract uses inline assembly, this is only advised in rare cases. 
                Additionally static analysis modules do not parse inline Assembly, this can lead to wrong analysis results.</span>`,
      location: node.src,
      more: 'http://solidity.readthedocs.io/en/develop/assembly.html#solidity-assembly'
    }
  })
}

module.exports = {
  name: name,
  description: desc,
  category: categories.SECURITY,
  Module: inlineAssembly
}
