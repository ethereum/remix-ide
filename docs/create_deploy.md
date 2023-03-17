Creating and Deploying a Contract
================================

This page contains the process of creating a contract, compiling it, deploying and then interacting with it.

A sample contract
---------------
This contract is very basic. The goal is to quickly start to create and
to interact with a sample contract.

![](images/a-file-explorer-new-file2.png)

Go to the File Explorer, create a new file, name it and in the editor paste the contract below.

``` 
// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.7.6;

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

Compile the Contract
--------------------
With the contract above as the active tab in the Editor, compile the contract.  

For more information, see the docs on the ([Solidity Compiler](compile.html)).

Deploy the contract
-------------------
Go to the **Deploy & Run Transactions** plugin.

There are 3 type of environments Remix can be plugged to:
* Javascript VM
* Injected Provider
* Custom - External HTTP Provider

---

**Javascript VM**

The **JavaScript VM** is convenient because it is a blockchain that runs in
your browser and you don't need any other software or Ethereum node to run it. 

Two notes: 
- When you are in the **Javascript VM** and you reload the browser - the **Javascript VM** will restart to its fresh & default state.
- For performance purposes (i.e., for testing in an environment that is closest to the mainnet), it can be better to use an external node via **Injected Provider** or **Custom - External HTTP Provider**

---

**Injected Provider** 

Both **Injected Provider** and **Custom - External HTTP Provider** require the use of an external tool -- most of the time, developers will use a connected wallet like Metamask.

High level, these are the steps for deployed via an **Injected Provider**. This method allows you to deploy via an external rpc node provider of your choice: 

(1) Add your RPC's network to Metamask. For example, if you were using Alchemy as the node provider, you'd add your Alchemy API key from your preferred chain to Metamask. You should add the etherscan URL to your Metamask network to be able to check your deployment status in step (6)

(2) Make sure your Metamask wallet had enough funds to cover deployment. For example, if you were deploying to the Sepolia testnet, you'd get Sepolia testETH from a [Sepolia faucet](https://sepoliafaucet.com)

(3) Select "Injected Provider" as your Remix deployment environment

(4) Connect your Metamask to Remix. You should see your Metamask network account # appear in the "account" box in Remix. This is underneath "Environment" box

(5) Hit "deploy" in Remix

(6) Check the status of your deployment via the etherscan URL

For more details on how to deploy an **Injected Provider**, [this tutorial](https://betterprogramming.pub/how-to-create-your-own-nft-smart-contract-tutorial-1b90978bd7a3) shows how to deploy a NFT token with the Remix IDE

---

**Custom - External HTTP Provider**

Some external tools used with **Custom - External HTTP Provider** are a Truffle Ganache-CLI, Hardhat node, or an Ethereum node itself.


(For more details on deploying, see [Running transactions](https://remix-ide.readthedocs.io/en/latest/run.html))


Notes about the VM environment
-------------------------

Make sure the VM mode is selected. All accounts displayed in **ACCOUNT** should have 100 ether.

![](images/a-run-jsvm-accounts.png)

Notes about deploying a contract
---------------------

![](images/a-run-testContract.png)

The constructor of `testContract` needs a parameter (of type `uint256`).
Input a uint256 and click on `Deploy`.

The transaction is created which deploys the instance of `testContract` .

In a "normal" blockchain, you would have to wait for the transaction to be mined. However, because we are using the `JavaScript VM`, our execution is immediate.

The terminal will give information about the transaction.

The newly created instance is displayed in the **Deployed Contracts** section.

![](images/a-jvm-instance.png)

Interacting with an instance
----------------------------
Clicking on the caret to the left of the instance of TESTCONTRACT will open it up so you can see its function.

This new instance contains 3 actions which corresponds to the 3
functions (`setP`, `setPN`, `get`). Clicking on `setP` or `setPN` will
create a new transaction.

Note that `setP` is `payable` (red button) : it is possible to send
value (Ether) to the contract.

`setPN` is not payable (orange button - depending on the theme) : it is not possible to send value (Ether) to the contract.

Clicking on `get` will not execute a transaction (usually its a blue button - depending on the theme). It doesn't execute a transaction because a `get` does not modify the state (the variable `value`) of this instance.

Because `get` is a **view function**, you can see the return value just below the
`get` button.

![](images/a-jvm-calling-instance.png)
