'use strict'
var init = require('../helpers/init')
var sauce = require('./sauce')

module.exports = {

  before: function (browser, done) {
    init(browser, done)
  },

  '@sources': function () {
    return sources
  },

  'Should launch solidity unit test plugin': function (browser) {
    browser.waitForElementPresent('*[data-id="verticalIconsKindfileExplorers"]')
    .clickLaunchIcon('fileExplorers')
    .addFile('simple_storage.sol', sources[0]['browser/simple_storage.sol'])
    .addFile('ks2a.sol', sources[0]['browser/ks2a.sol'])
    .clickLaunchIcon('pluginManager')
    .scrollAndClick('*[data-id="pluginManagerComponentActivateButtonsolidityUnitTesting"]')
    .click('*[data-id="verticalIconsKindsolidityUnitTesting"]')
    .waitForElementPresent('*[data-id="sidePanelSwapitTitle"]')
    .assert.containsText('*[data-id="sidePanelSwapitTitle"]', 'SOLIDITY UNIT TESTING')
  },

  'Should generate test file': function (browser) {
    browser.waitForElementPresent('*[data-id="verticalIconsKindfileExplorers"]')
    .clickLaunchIcon('fileExplorers')
    .switchFile('browser/simple_storage.sol')
    .click('*[data-id="verticalIconsKindsolidityUnitTesting"]')
    .waitForElementPresent('*[data-id="testTabGenerateTestFile"]')
    .click('*[data-id="testTabGenerateTestFile"]')
    .waitForElementPresent('*[title="browser/test_test.sol"]')
    .clickLaunchIcon('fileExplorers')
    .removeFile('browser/test_test.sol')
  },

  'Should run simple unit test `simple_storage_test.sol` ': function (browser) {
    browser.waitForElementPresent('*[data-id="verticalIconsKindfileExplorers"]')
    .addFile('simple_storage_test.sol', sources[0]['browser/simple_storage_test.sol'])
    .click('*[data-id="verticalIconsKindsolidityUnitTesting"]')
    .waitForElementPresent('*[data-id="testTabCheckAllTests"]')
    .click('*[data-id="testTabCheckAllTests"]')
    .click('.singleTestLabel:nth-of-type(2)')
    .scrollAndClick('*[data-id="testTabRunTestsTabRunAction"]')
    .pause(15000)
    .assert.containsText('*[data-id="testTabSolidityUnitTestsOutput"]', 'browser/simple_storage_test.sol (MyTest)')
    .assert.containsText('*[data-id="testTabSolidityUnitTestsOutput"]', '✓ (Initial value should be100)')
    .assert.containsText('*[data-id="testTabSolidityUnitTestsOutput"]', '✓ (Value is set200)')
    .assert.containsText('*[data-id="testTabSolidityUnitTestsOutput"]', '✘ (Should fail for wrong value200)')
    .assert.containsText('*[data-id="testTabSolidityUnitTestsSummary"]', '1 failing')
    .assert.containsText('*[data-id="testTabSolidityUnitTestsSummary"]', '2 passing')
  },

  'Should run advance unit test using natspec and experimental ABIEncoderV2 `ks2b_test.sol` ': function (browser) {
    browser.waitForElementPresent('*[data-id="verticalIconsKindfileExplorers"]')
    .clickLaunchIcon('fileExplorers')
    .addFile('ks2b_test.sol', sources[0]['browser/ks2b_test.sol'])
    .click('*[data-id="verticalIconsKindsolidityUnitTesting"]')
    .waitForElementPresent('*[data-id="testTabCheckAllTests"]')
    .click('*[data-id="testTabCheckAllTests"]')
    .click('.singleTestLabel:nth-of-type(3)')
    .scrollAndClick('*[data-id="testTabRunTestsTabRunAction"]')
    .pause(15000)
    .assert.containsText('*[data-id="testTabSolidityUnitTestsOutput"]', 'browser/ks2b_test.sol (kickstarterTest)')
    .assert.containsText('*[data-id="testTabSolidityUnitTestsOutput"]', '✓ (Check project exists)')
    .assert.containsText('*[data-id="testTabSolidityUnitTestsOutput"]', '✓ (Check project is fundable)')
  },

  'Should fail on compilation': function (browser) {
    browser.waitForElementPresent('*[data-id="verticalIconsKindfileExplorers"]')
    .addFile('compilationError_test.sol', sources[0]['browser/compilationError_test.sol'])
    .clickLaunchIcon('fileExplorers')
    .switchFile('browser/compilationError_test.sol')
    .clickLaunchIcon('solidityUnitTesting')
    .click('*[data-id="testTabCheckAllTests"]')
    .click('.singleTestLabel:nth-of-type(4)')
    .scrollAndClick('*[data-id="testTabRunTestsTabRunAction"]')
    .pause(5000)
    .waitForElementPresent('*[data-id="testTabSolidityUnitTestsSummary"]')
    .assert.containsText('*[data-id="testTabSolidityUnitTestsSummary"]', 'SyntaxError: No visibility specified')
  },

  'Should fail on deploy': function (browser) {
    browser.waitForElementPresent('*[data-id="verticalIconsKindfileExplorers"]')
    .addFile('deployError_test.sol', sources[0]['browser/deployError_test.sol'])
    .clickLaunchIcon('fileExplorers')
    .switchFile('browser/deployError_test.sol')
    .clickLaunchIcon('solidityUnitTesting')
    .click('*[data-id="testTabCheckAllTests"]')
    .click('.singleTestLabel:nth-of-type(5)')
    .scrollAndClick('*[data-id="testTabRunTestsTabRunAction"]')
    .pause(10000)
    .waitForElementPresent('*[data-id="testTabSolidityUnitTestsSummary"]')
    .assert.containsText('*[data-id="testTabSolidityUnitTestsSummary"]', 'contract deployment failed after trying twice')
  },

  'Solidity Unittests': function (browser) {
    runTests(browser)
  },

  tearDown: sauce
}

function runTests (browser) {
  browser
    .waitForElementPresent('*[data-id="verticalIconsKindfileExplorers"]')
    .clickLaunchIcon('fileExplorers')
    .switchFile('browser/3_Ballot.sol')
    .clickLaunchIcon('solidityUnitTesting')
    .scrollAndClick('#runTestsTabRunAction')
    .waitForElementPresent('#solidityUnittestsOutput div[class^="testPass"]')
    .pause(10000)
    .assert.containsText('#solidityUnittestsOutput', 'browser/4_Ballot_test.sol (BallotTest)')
    .assert.containsText('#solidityUnittestsOutput', '✓ (Check winning proposal)')
    .assert.containsText('#solidityUnittestsOutput', '✓ (Check winnin proposal with return value)')
    .end()
}

var sources = [
  {
    'browser/simple_storage.sol': {
      content: `
      pragma solidity >=0.4.22 <0.7.0;

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
        `
    },
    'browser/simple_storage_test.sol': {
      content: `
      pragma solidity >=0.4.22 <0.7.0;
      import "remix_tests.sol";
      import "./simple_storage.sol";

      contract MyTest {
        SimpleStorage foo;

        function beforeEach() public {
          foo = new SimpleStorage();
        }

        function initialValueShouldBe100() public returns (bool) {
          return Assert.equal(foo.get(), 100, "initial value is not correct");
        }

        function valueIsSet200() public returns (bool) {
          foo.set(200);
          return Assert.equal(foo.get(), 200, "value is not 200");
        }

        function shouldFailForWrongValue200() public returns (bool) {
          foo.set(300);
          return Assert.equal(foo.get(), 200, "value is not 200");
        }
      }
        `
    },
    'browser/ks2a.sol': {
      content: `
      pragma solidity >=0.4.22 <0.6.0;
      contract Kickstarter {
          enum State { Started, Completed }
      
          struct Project {
              address owner;
              string name;
              uint goal;
              uint fundsAvailable; // added
              uint amountContributed; // added
              State state;
              mapping(address => uint) funders; // added
          }
      
          Project[] public projects;
      
          constructor() public {
          }
      
          function createProject(string memory name, uint goal) public {
              projects.length++; // new line
              Project storage project = projects[projects.length - 1];
              project.name = name;
              project.goal = goal;
              project.owner = msg.sender;
              project.state = State.Started;
          }
          
          function fundProject(uint projectId) payable public {
          Project storage project = projects[projectId];
              // require project exists
              // PLEASE CHECK / or erase
              // not this: require(projects[projectId].exists, "the project must exist to be funded");
      
              // require for... underflow/overflow protection
              project.funders[msg.sender] += msg.value;
              project.amountContributed += msg.value;
              project.fundsAvailable += msg.value;
      
              if (project.amountContributed >= project.goal) {
                  project.state = State.Completed;
              }
          }
          
          // this function is here because we can't use web3 when using the VM
          function getContractBalance() public view returns(uint balance) {
              return address(this).balance;
          }
            
      }
        `
    },
    'browser/ks2b_test.sol': {
      content: `
      pragma solidity >=0.4.22 <0.6.0;
      pragma experimental ABIEncoderV2;

      import "remix_tests.sol"; // this import is automatically injected by Remix.
      import "remix_accounts.sol";
      import "./ks2a.sol";

      contract kickstarterTest {
          enum State { Started, Completed }

          Kickstarter kickstarter;
          /// #sender: account-0
          function beforeAll () public {
            kickstarter = new Kickstarter();
            kickstarter.createProject("ProjectA", 123000);
            kickstarter.createProject("ProjectB", 100);
          }
      
          /// #sender: account-0
          /// #value: 10000000
          function checkProjectExists () public payable {
              (address owner, string memory name, uint goal, uint fundsAvailable, uint amountContributed, Kickstarter.State state) = kickstarter.projects(0);
              Assert.equal(name, "ProjectA", "project name is incorrect");
              Assert.equal(owner, address(this), "owner is incorrect");
              Assert.equal(goal, 123000, "funding goal is incorrect");
          }

          function checkProjectIsFundable () public {
              kickstarter.fundProject.value(120000)(0);
              (address owner, string memory name, uint goal, uint fundsAvailable, uint amountContributed, Kickstarter.State state) = kickstarter.projects(0);
              Assert.equal(amountContributed, 120000, "contributed amount is incorrect");
          }
      }
        `
    },
    'browser/compilationError_test.sol': {
      content: `
      pragma solidity ^0.6.1;
      
      contract failOnCompilation {
        fallback() {

        }
      }
        `
    },
    'browser/deployError_test.sol': {
      content: `
      pragma solidity ^0.6.0;

      contract failingDeploy {
          constructor() public {
              revert('Deploy Failed');
          }
      }
        `
    }
  }
]
