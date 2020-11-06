Running JS Scripts in Remix
===========================

Remix accepts async/await scripts to run web3.js or ethers.js commands. The script needs to be wrapped in a self executing function.

## Why run JavaScript Scripts in Remix?
* To mimic how the front-end of your dapp will use web3.js or ethers.js
* To quickly deploy and interact with a bunch of instances of a contract without going through the Remix GUI.
* To run some tests on a previous deployed contract.

## Setup
1. Make sure the **Generate contract metadata** option is **checked** in the settings module.
[Settings documentation](settings.html)  ( ROB TODO: and make sure to update Settings.md!!!)

2. **Async/await scripts do not currently work on the JSVM**  
    * Go to the Deploy and Run module to select Injected Web3 or Web3 Provider and NOT the JSVM. 

3. Compile a solidity file.

4. Write the script

5. To run the script - either have the script be the active file in the editor and run `remix.exeCurrent()` in the console or right click on the script in the files explorer to get the popup context menu and select the **run** option. (ROB TODO - update with an image of the context menu)

## An Example
The example below is to deploy a solidity contract named CustomERC20.sol.  That contract had been compiled and its metadata generated and put into the browser/artifacts folder. This example is using the web3.js library.  Ethers.js could also be used.

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

For more script examples, please see [Frequently Asked Scripts](fas.html)