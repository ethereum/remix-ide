module.exports = { analyze: analyze };

// source: just a big string of the current tab's source code.
//
// compiledResult: an object with different keys based on success/failure of compilation.
//   success keys: 'contracts' (contains opcodes, bytecode) and 'sources' (contains AST)
//   error key: 'error' (contains compile error string)

function analyze (source, compiledResult) {
  var messages = [];

  if (compiledResult) {
    if (compiledResult.contracts) {
      Object.keys(compiledResult.contracts).forEach(function (contractName) {
        // @TODO: use compiledResult.contracts[contractName].opcodes, interface, etc
      });
    }
    if (compiledResult.sources) {
      Object.keys(compiledResult.sources).forEach(function (tabName) {
        var ast = compiledResult.sources[tabName].AST;
        if (searchAST(ast, {member_name: 'send'})) {
          messages.push('Caution: You are using the send method.\nPlease read <a target="_blank" href="http://hackingdistributed.com/2016/06/16/scanning-live-ethereum-contracts-for-bugs/">this</a> before deploying your code.');
        }
      });
    }
  }

  if (source) {
    // If all else fails, you can inspect the raw source string
  }

  // @TODO: find and warn about more vulnerabilities

  return messages;
}

function searchAST (ast, attributeQuery) {
  var match = false;
  if (ast.children) {
    ast.children.forEach(function (child) {
      if (match) return;
      if (child.attributes) {
        Object.keys(attributeQuery).forEach(function (attrKey) {
          if (match) return;
          match = (child.attributes[attrKey] === attributeQuery[attrKey]);
        });
      }
      if (!match && child.children) {
        match = searchAST(child, attributeQuery);
      }
    });
  }
  return match;
}
