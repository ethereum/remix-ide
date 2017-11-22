'use strict'

<<<<<<< HEAD
/*
  opts:
   - optimize
   - { file_name: { library_name: address } }
*/
=======
>>>>>>> 57a496aa1f3a3f66c485f84651dbac671d0f6225
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
<<<<<<< HEAD
        '*': [ 'metadata', 'evm.bytecode', 'abi', 'legacyAST', 'metadata', 'evm.assembly', 'evm.methodIdentifiers', 'evm.gasEstimates' ]
=======
        '*': [ 'metadata', 'evm.bytecode', 'evm.deployedBytecode', 'abi', 'legacyAST', 'metadata', 'evm.assembly', 'evm.methodIdentifiers', 'evm.gasEstimates' ]
>>>>>>> 57a496aa1f3a3f66c485f84651dbac671d0f6225
      }
    }
  })
}
