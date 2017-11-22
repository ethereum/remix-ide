var name = 'Block timestamp: '
var desc = 'Semantics maybe unclear'
var categories = require('./categories')
var common = require('./staticAnalysisCommon')
var yo = require('yo-yo')

function blockTimestamp () {
  this.warningNowNodes = []
  this.warningblockTimestampNodes = []
}

blockTimestamp.prototype.visit = function (node) {
  if (common.isNowAccess(node)) this.warningNowNodes.push(node)
  else if (common.isBlockTimestampAccess(node)) this.warningblockTimestampNodes.push(node)
}

blockTimestamp.prototype.report = function (compilationResults) {
  return this.warningNowNodes.map(function (item, i) {
    return {
      warning: yo`<span>use of "now": "now" does not mean current time. Now is an alias for block.timestamp. 
                Block.timestamp can be influenced by miners to a certain degree, be careful.</span>`,
      location: item.src,
      more: 'http://solidity.readthedocs.io/en/develop/frequently-asked-questions.html#are-timestamps-now-block-timestamp-reliable'
    }
  }).concat(this.warningblockTimestampNodes.map(function (item, i) {
    return {
      warning: yo`<span>use of "block.timestamp": "block.timestamp" can be influenced by miners to a certain degree. 
                That means that a miner can "choose" the block.timestamp, to a certain degree, to change the outcome of a transaction in the mined block.</span>`,
      location: item.src,
      more: 'http://solidity.readthedocs.io/en/develop/frequently-asked-questions.html#are-timestamps-now-block-timestamp-reliable'
    }
  }))
}

module.exports = {
  name: name,
  description: desc,
  category: categories.SECURITY,
  Module: blockTimestamp
}

