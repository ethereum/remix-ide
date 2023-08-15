Creating and Deploying a Contract
=================================

Let's go through a basic workflow:
- create a new file
- paste some code into it
- compile the contract
- deploy it to the local simpulated blockchain 
- interact with the deployed contract's functions.

Creating a new file
-------------------
![](images/a-file-explorer-new-file2.png)

In the File Explorer, create a new file by clicking on the new file icon, and name it and add a .sol extension.

**NOTE:** this page does not go into templates or workspaces - for info about these topics, see the [File Explorer docs](file_explorer.html)

Then in the editor, paste in the following contract into the empty file:

``` 
// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.18;

contract testContract {

    uint256 value;

    constructor (uint256 _p) {
        value = _p;
    }

    function setP(uint256 _n) payable public {
        value = _n;
    }

    function setNP(uint256 _n) public {
        value = _n;
    }

    function get () view public returns (uint256) {
        return value;
    }
}

```

There are inherent dangers in copying code that you don't understand into Remix.

There are many scams that have tell people to copy some malicious code into Remix.  See the docs about [security](security.html).

Compile the Contract
--------------------
With the contract above as the active tab in the Editor, compile the contract.  
A quick way to compile is to by hitting **ctrl + s**. You can also compile by going to the Solidity compiler and clicking the compile button, or by right clicking a file in the File Explorer, or by clicking the play button at the top of the Editor.

**For More Info** see the docs on the [Solidity Compiler](compile.html).

Deploy the contract
-------------------
Go to the **Deploy & Run** plugin.

At the top of this plugin is the Environment select box.  Here you can choose where you want to deploy your contract.  There are many choices.  For more info about these options see [this section](run.html#environment) of the docs.

For a brief synopsis:

**Injected Provider** is used to connect Remix with a Browser Wallet (e.g. Metamask) which is generally for deploying to a public network.

**Remix VM** is a test blockchain in the browser.  There are quite a few flavors of the Remix VM. For this guide, choose the first version of the RemixVM.

**Dev** is for connecting Remix to a local chain running on your computer.

**L2** is for connecting Remix to Optimism or Abritrum via a browser wallet.  Its essentially the same as Injected Provider, but it sets the wallet with the configuration of the specified L2.

(For details see [Running transactions](https://remix-ide.readthedocs.io/en/latest/run.html))

The **Remix VM** is convenient because it is a blockchain that runs in
the browser and nothing else needs to be installed to run it. 

**NOTE:** When you are in the **Remix VM** and you reload the browser - the **Remix VM** will restart to its fresh & default state.

For a more realistic testing environment, it can be better to use a public testnet.

Select the VM environment
-------------------------

Make sure the VM mode is selected. All accounts displayed in **ACCOUNT** should have 100 ether.

![](images/a-run-jsvm-accounts.png)

Deploying a contract
---------------------

![](images/a-run-testContract.png)

The constructor of `testContract` needs a parameter (of type `uint256`).
Input a uint256 and click on `Deploy`.

The transaction is created which deploys the instance of `testContract` .

In a "normal" blockchain, you would have to wait for the transaction to be mined. However, because we are using the `Remix VM`, the execution is immediate.

The terminal will give information about the transaction.

The newly created instance is displayed in the **Deployed Contracts** section.

![](images/a-jvm-instance.png)

Interacting with the deployed instance
--------------------------------------
Clicking on the caret to the left of the instance of TESTCONTRACT will expand it so its functions are visible.

This new instance contains 3 actions which corresponds to the 3
functions (`setP`, `setPN`, `get`). Clicking on `setP` or `setPN` will
create a new transaction.

Note that `setP` is `payable` (red button) : it is possible to send
value (Ether) to the contract.

`setPN` is not payable (orange button - depending on the theme) : it is not possible to send value (Ether) to the contract.

Clicking on `get` will not execute a transaction (usually it's a blue button - depending on the theme). It doesn't execute a transaction because a `get` does not modify the state (the variable `value`) of this instance.

Because `get` is a **view function**, you can see the return value just below the
`get` button.

![](images/a-jvm-calling-instance.png)
