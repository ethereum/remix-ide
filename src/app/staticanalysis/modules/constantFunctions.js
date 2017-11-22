var name = 'Constant functions: '
var desc = 'Check for potentially constant functions'
var categories = require('./categories')
var common = require('./staticAnalysisCommon')
var fcallGraph = require('./functionCallGraph')
var AbstractAst = require('./abstractAstView')
var yo = require('yo-yo')

function constantFunctions () {
  this.abstractAst = new AbstractAst()

  this.visit = this.abstractAst.build_visit(
    (node) => common.isLowLevelCall(node) || common.isTransfer(node) || common.isExternalDirectCall(node) || common.isEffect(node) || common.isLocalCallGraphRelevantNode(node) || common.isInlineAssembly(node) || common.isNewExpression(node)
  )

  this.report = this.abstractAst.build_report(report)
}

constantFunctions.prototype.visit = function () { throw new Error('constantFunctions.js no visit function set upon construction') }

constantFunctions.prototype.report = function () { throw new Error('constantFunctions.js no report function set upon construction') }

function report (contracts, multipleContractsWithSameName) {
  var warnings = []
  var hasModifiers = contracts.some((item) => item.modifiers.length > 0)

  var callGraph = fcallGraph.buildGlobalFuncCallGraph(contracts)

  contracts.forEach((contract) => {
    contract.functions.forEach((func) => {
      func.potentiallyshouldBeConst = checkIfShouldBeConstant(common.getFullQuallyfiedFuncDefinitionIdent(contract.node, func.node, func.parameters),
                                                              getContext(callGraph, contract, func))
    })

    contract.functions.filter((func) => common.hasFunctionBody(func.node)).forEach((func) => {
      if (common.isConstantFunction(func.node) !== func.potentiallyshouldBeConst) {
        var funcName = common.getFullQuallyfiedFuncDefinitionIdent(contract.node, func.node, func.parameters)
        var comments = (hasModifiers) ? '<br/><i>Note:</i> Modifiers are currently not considered by this static analysis.' : ''
        comments += (multipleContractsWithSameName) ? '<br/><i>Note:</i> Import aliases are currently not supported by this static analysis.' : ''
        if (func.potentiallyshouldBeConst) {
          warnings.push({
            warning: yo`<span><i>${funcName}</i>: Potentially should be constant but is not. ${comments}</span>`,
            location: func.src,
            more: 'http://solidity.readthedocs.io/en/develop/contracts.html#constant-functions'
          })
        } else {
          warnings.push({
            warning: yo`<span><i>${funcName}</i>: Is constant but potentially should not be. ${comments}</span>`,
            location: func.src,
            more: 'http://solidity.readthedocs.io/en/develop/contracts.html#constant-functions'
          })
        }
      }
    })
  })

  return warnings
}

function getContext (callGraph, currentContract, func) {
  return { callGraph: callGraph, currentContract: currentContract, stateVariables: getStateVariables(currentContract, func) }
}

function getStateVariables (contract, func) {
  return contract.stateVariables.concat(func.localVariables.filter(common.isStorageVariableDeclaration))
}

function checkIfShouldBeConstant (startFuncName, context) {
  return !fcallGraph.analyseCallGraph(context.callGraph, startFuncName, context, isConstBreaker)
}

function isConstBreaker (node, context) {
  return common.isWriteOnStateVariable(node, context.stateVariables) ||
        common.isLowLevelCall(node) ||
        common.isTransfer(node) ||
        isCallOnNonConstExternalInterfaceFunction(node, context) ||
        common.isCallToNonConstLocalFunction(node) ||
        common.isInlineAssembly(node) ||
        common.isNewExpression(node)
}

function isCallOnNonConstExternalInterfaceFunction (node, context) {
  if (common.isExternalDirectCall(node)) {
    var func = fcallGraph.resolveCallGraphSymbol(context.callGraph, common.getFullQualifiedFunctionCallIdent(context.currentContract, node))
    return !func || (func && !common.isConstantFunction(func.node.node))
  }
  return false
}

module.exports = {
  name: name,
  description: desc,
  category: categories.MISC,
  Module: constantFunctions
}
