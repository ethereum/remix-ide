var test = require('tape');
var solc = require('solc');

var solWarnings = require('../src/app/sol-warnings');

test('no warnings on simple contract', function (t) {
  t.plan(1);

  var source = 'contract foo {}';
  var compiledResult = solc.compile(source);

  var warnings = solWarnings.find(source, compiledResult);
  t.equal(warnings.length, 0);
});

test('send', function (t) {
  t.plan(2);

  var source = 'contract foo {\n' +
    'address bar;\n' +
    'function baz() {\n' +
      'bar.send(1 ether);\n' +
    '}\n' +
  '}';
  var compiledResult = solc.compile(source);

  var warnings = solWarnings.find(source, compiledResult);
  t.equal(warnings.length, 1);
  t.ok(warnings[0] && warnings[0].match(/send/i));
});
