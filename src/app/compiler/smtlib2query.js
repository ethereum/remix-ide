'use strict'
var $ = require('jquery')

module.exports = function (query, cb) {
  // TODO make this configurable.
  // Currently, just use ` docker run --rm -it -p "8001:80" evdb/z3-http `
  return $.post('http://localhost:8001', query)
    .done(function (data) {
      cb(null, data)
    })
    .fail(function (xhr, text, err) {
      // NOTE: on some browsers, err equals to '' for certain errors (such as offline browser)
      cb('Error invoking SMT solver.\n' +
        'You have to run `docker run --rm -it -p "8001:80" evdb/z3-http` for now\n' +
        'or remove the `pragma experimental SMTChecker;`.\n' +
        (err || 'Unknown transport error querying SMT solver.'))
    })
}
