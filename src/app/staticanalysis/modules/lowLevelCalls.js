var name = 'Low level calls: '
var desc = 'Semantics maybe unclear'
var categories = require('./categories')
var common = require('./staticAnalysisCommon')
var yo = require('yo-yo')

function lowLevelCalls () {
  this.llcNodes = []
}

lowLevelCalls.prototype.visit = function (node) {
  if (common.isLowLevelCallInst(node)) {
    this.llcNodes.push({node: node, type: common.lowLevelCallTypes.CALL})
  } else if (common.isLowLevelCallcodeInst(node)) {
    this.llcNodes.push({node: node, type: common.lowLevelCallTypes.CALLCODE})
  } else if (common.isLowLevelDelegatecallInst(node)) {
    this.llcNodes.push({node: node, type: common.lowLevelCallTypes.DELEGATECALL})
  } else if (common.isLowLevelSendInst(node)) {
    this.llcNodes.push({node: node, type: common.lowLevelCallTypes.SEND})
  }
}

lowLevelCalls.prototype.report = function (compilationResults) {
  return this.llcNodes.map(function (item, i) {
    var text = ''
    var morehref = null
    switch (item.type) {
      case common.lowLevelCallTypes.CALL:
        text = yo`<span>use of "call":  the use of low level "call" should be avoided whenever possible. 
                It can lead to unexpected behavior if return value is not handled properly. 
                Please use Direct Calls via specifying the called contract's interface.<br /></span>`
        morehref = 'http://solidity.readthedocs.io/en/develop/control-structures.html?#external-function-calls'
        // http://solidity.readthedocs.io/en/develop/frequently-asked-questions.html?#why-is-the-low-level-function-call-less-favorable-than-instantiating-a-contract-with-a-variable-contractb-b-and-executing-its-functions-b-dosomething
        break
      case common.lowLevelCallTypes.CALLCODE:
        text = yo`<span>use of "callcode":  the use of low level "callcode" should be avoided whenever possible. 
                External code that is called can change the state of the calling contract and send ether form the caller's balance. 
                If this is wantend behaviour use the Solidity library feature if possible.<br /></span>`
        morehref = 'http://solidity.readthedocs.io/en/develop/contracts.html#libraries'
        break
      case common.lowLevelCallTypes.DELEGATECALL:
        text = yo`<span>use of "delegatecall": the use of low level "delegatecall" should be avoided whenever possible. 
                External code that is called can change the state of the calling contract and send ether form the caller's balance. 
                If this is wantend behaviour use the Solidity library feature if possible.<br /></span>`
        morehref = 'http://solidity.readthedocs.io/en/develop/contracts.html#libraries'
        break
      case common.lowLevelCallTypes.SEND:
        text = yo`<span>use of "send": "send" does not throw an exception when not successful, make sure you deal with the failure case accordingly. 
                Use "transfer" whenever failure of the ether transfer should rollback the whole transaction. 
                Note: if you "send/transfer" ether to a contract the fallback function is called, the callees fallback function is very limited due to the limited amount of gas provided by "send/transfer". 
                No state changes are possible but the callee can log the event or revert the transfer. "send/transfer" is syntactic sugar for a "call" to the fallback function with 2300 gas and a specified ether value. <br /></span>`
        morehref = 'http://solidity.readthedocs.io/en/develop/security-considerations.html#sending-and-receiving-ether'
        break
    }
    return { warning: text, more: morehref, location: item.node.src }
  })
}

module.exports = {
  name: name,
  description: desc,
  category: categories.SECURITY,
  Module: lowLevelCalls
}

