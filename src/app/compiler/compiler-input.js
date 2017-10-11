'use strict'

/*
  opts:
   - optimize
   - { file_name: { library_name: address } }
*/
module.exports = (sources, opts) => {
  return JSON.stringify({
    language: 'Solidity',
    sources: sources,
    settings: {
      optimizer: {
        enabled: opts.optimize === true,
        runs: 500
      }
    },
    libraries: opts.libraries,
    outputSelection: {
      '*': {
        '*': [ 'metadata', 'evm.bytecode', 'abi', 'legacyAST', 'metadata', 'evm.assembly', 'evm.methodIdentifiers', 'evm.gasEstimates' ]
      }
    }
  })
}
