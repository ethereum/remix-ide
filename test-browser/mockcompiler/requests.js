'use strict'

var examples = require('../../src/app/example-contracts')

module.exports = {
  'testSimpleContract': {
    'sources': {
      'Untitled': 'contract test1 {} contract test2 {}'
    }
  },
  'ballot': {
    'sources': {
      'Untitled': examples.ballot.content
    }
  }
}
