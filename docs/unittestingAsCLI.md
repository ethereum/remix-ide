Command Line Interface
========================
remix-tests [![](https://badge.fury.io/js/%40remix-project%2Fremix-tests.svg)](https://www.npmjs.com/package/@remix-project/remix-tests)
------------------

`remix-tests` is a tool which can be used as a CLI (Command Line Interface) solution to run the solidity unit tests. This is the same tool which works as a library underneath Remix's `Solidity Unit Testing` plugin. It is available on NPM as `@remix-project/remix-tests`.

Get started
-------------

You can install it using NPM:

* As a dev dependency:

`npm install --save-dev @remix-project/remix-tests`

* As a global NPM module:

`npm install -g @remix-project/remix-tests`

To confirm installation, run:
```
$ remix-tests version
0.1.36
```
Version should be same as on NPM.

How to use
-------------

You can see all available options using `help` command.

```
$ remix-tests help           
Usage: remix-tests [options] [command]

Options:
  -V, --version            output the version number
  -c, --compiler <string>  set compiler version (e.g: 0.6.1, 0.7.1 etc)
  -e, --evm <string>       set EVM version (e.g: petersburg, istanbul etc)
  -o, --optimize <bool>    enable/disable optimization
  -r, --runs <number>      set runs (e.g: 150, 250 etc)
  -v, --verbose <level>    set verbosity level (0 to 5)
  -h, --help               output usage information

Commands:
  version                  output the version number
  help                     output usage information
```

General structure of a command is as:

`$ remix-tests <options> <file/directory path>`

To run all test files inside `examples` directory
```
$ remix-tests examples/
``` 
To run single test file named `simple_storage_test.sol` inside `examples` directory
```
$ remix-tests examples/simple_storage_test.sol
```
**NOTE:** `remix-tests` will assume that name of test(s) file ends with `"_test.sol"`. e.g `simple_storage_test.sol`

Example
--------
Consider for a simple storage contract named `simple_storage.sol`:

```
pragma solidity >=0.4.22 <=0.8.0;

contract SimpleStorage {
  uint public storedData;

  constructor() public {
    storedData = 100;
  }

  function set(uint x) public {
    storedData = x;
  }

  function get() public view returns (uint retVal) {
    return storedData;
  }
}
```

Test file `simple_storage_test.sol` can be as:


```
pragma solidity >=0.4.22 <=0.8.0;
import "remix_tests.sol"; // injected by remix-tests
import "./simple_storage.sol";

contract MyTest {
  SimpleStorage foo;

  function beforeAll() public {
    foo = new SimpleStorage();
  }

  function initialValueShouldBe100() public returns (bool) {
    return Assert.equal(foo.get(), 100, "initial value is not correct");
  }

  function initialValueShouldNotBe200() public returns (bool) {
    return Assert.notEqual(foo.get(), 200, "initial value is not correct");
  }

  function shouldTriggerOneFail() public {
    Assert.equal(uint(1), uint(2), "uint test 1 fails");
    Assert.notEqual(uint(1), uint(2), "uint test 2 passes");
  }

  function shouldTriggerOnePass() public {
    Assert.equal(uint(1), uint(1), "uint test 3 passes");
  }
}
```

Running `simple_storage_test.sol` file will output as:

```
$ remix-tests simple_storage_test.sol

	👁	:: Running remix-tests - Unit testing for solidity ::	👁

'creation of library remix_tests.sol:Assert pending...'

	◼  MyTest
	✓  Initial value should be100
	✓  Initial value should not be200
	✘  Should trigger one fail
	✓  Should trigger one pass


3 passing (0.282s)
1 failing

  1) MyTest: Should trigger one fail

	 error: uint test 1 fails
	 expected value to be equal to: 2
	 returned: 1
```

Custom compiler context
------------------------

Most of the `remix-tests` options are there to define a custom compiler context. With an extended custom compiler context, execution of above test file will go as:

```
$ remix-tests --compiler 0.7.4 --evm istanbul --optimize true --runs 300 simple_storage_test.sol

	👁	:: Running remix-tests - Unit testing for solidity ::	👁

[14:03:18] info: Compiler version set to 0.7.4. Latest version is 0.8.0
[14:03:18] info: EVM set to istanbul
[14:03:18] info: Optimization is enabled
[14:03:18] info: Runs set to 300
Loading remote solc version v0.7.4+commit.3f05b770 ...
'creation of library remix_tests.sol:Assert pending...'

	◼  MyTest
	✓  Initial value should be100
	✓  Initial value should not be200
	✘  Should trigger one fail
	✓  Should trigger one pass


3 passing (0.316s)
1 failing

  1) MyTest: Should trigger one fail

	 error: uint test 1 fails
	 expected value to be equal to: 2
	 returned: 1
```

Remember, custom compiler version will require internet connection to load compiler.

As a CI solution
-----------------

`remix-tests` can also be used for continuous integration (CI) testing. 

For implementation example, see [Su Squares contract](https://github.com/su-squares/ethereum-contract/tree/e542f37d4f8f6c7b07d90a6554424268384a4186) and [Travis build](https://travis-ci.org/su-squares/ethereum-contract/builds/446186067) that uses `remix-tests` for continuous integration.




