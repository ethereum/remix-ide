Running JS Scripts in Remix
===========================

Remix accepts async/await scripts to run [web3.js](https://web3js.readthedocs.io/)  or [ethers.js](https://docs.ethers.io/) commands. The script needs to be wrapped in a self executing function.

## Why run JavaScript Scripts in Remix?
* To mimic how the front-end of your dapp will use web3.js or ethers.js
* To quickly deploy and interact with a bunch of instances of a contract without going through the Remix GUI.
* To run some tests on a previous deployed contract.

## Setup
1. These scripts will need to access the contract's ABI.  The ABI is located in the contract's metadata file. Make sure that this metadata file will be created by going to the **Settings** module and checking that the **Generate contract metadata** option is indeed **checked**.

2. Compile a Solidity file - to generate the contract metadata.

3. In the Deploy & Run plugin, choose the Environment. 
    * Async/await scripts work on in all of the Environments: the JavascriptVM, Injected Web3, and Web3 Provider. 

4. Write the script - see below for an example.

5. To run the script - either **(a)** make the script the **active file in the editor** and run `remix.exeCurrent()` in the console OR **(b)** right click on the script **in the files explorer** to get the popup context menu (see the image below) and select the **run** option. 

  ![](images/a-running-scripts-run.png)

## JS Scripts in the File Explorers
In the **scripts** folder of a **workspace** in the File Explorers, there 2 example files: one using **web3.js** and the other using **ethers.js**.


## An Example Script
The example below deploys a solidity contract named **CustomERC20.sol**. This example is using the web3.js library.  Ethers.js could also be used.

For more information about this example, please see: [running async/await scripts](https://medium.com/remix-ide/running-js-async-await-scripts-in-remix-ide-3115b5dd7687?source=friends_link&sk=04e650dfa65905fdab0ecd5b10513d41)

```
(async () => {
  try {
    console.log('deploy...')

    // Note that the script needs the ABI which is generated from the compilation artifact.
    const metadata = JSON.parse(await remix.call('fileManager', 'getFile', 'browser/artifacts/CustomERC20.json'))
    const accounts = await web3.eth.getAccounts()

    let contract = new web3.eth.Contract(metadata.abi)

    contract = contract.deploy({
      data: metadata.data.bytecode.object,
      arguments: ["Mask", "N95"]
    })

    newContractInstance = await contract.send({
      from: accounts[0],
      gas: 1500000,
      gasPrice: '30000000000'
    })
    console.log(newContractInstance.options.address)
  } catch (e) {
    console.log(e.message)
  }
})()
```

For more script examples, please see [Frequently Asked Scripts](FAS.html).
