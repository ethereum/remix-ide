# Plugin List

Here is the list of Remix plugins that you will see in the Plugin Manager:

## Core Plugins

**File Explorer** &nbsp; ![](images/pi-fe.png)<br>
The File Explorers is where you can see the files.<br>
profile name: **fileManager**
<br>[Documentation](file_explorer.html)

**Remixd** &nbsp; (No UI)
<br>Remixd (with an npm package running locally) connects a folder on your filesystem to the Remix website. Please see the docs for instructions.
<br>profile name: **remixd**
<br>[Documentation](https://remix-ide.readthedocs.io/en/latest/remixd.html)

**Solidity Compiler** &nbsp; ![](images/pi-sol.png)<br>
Compiles Solidity & YUL.
<br>profile name: **solidity**
<br>[Documentation](compile.html)

**Deploy & Run** &nbsp; ![](images/pi-deploy.png)<br>
Deploy & interact with smart contracts on the in-browser chain (JSVM), local nodes, and public networks.
<br>profile name: **udapp**
<br>[Documentation](run.html)

**Debugger** &nbsp; ![](images/pi-debug.png)<br>
Insert breakpoints, step through a contract, check high level and low level parameters, and fetch & debug a transaction of a verified contract.
<br>profile name: **debugger**
<br>[Documentation](debugger.html)

**Solidity Unit Testing** &nbsp; ![](images/pi-sut.png)<br>
Run unit test written in Solidity.
<br>profile name: **solidityUnitTesting**
<br>[Documentation](unittesting.html)

**Solidity Static Analysis** &nbsp; ![](images/pi-static.png)<br>
Static code analysis is a process to debug the code by examining it and without actually executing the code. This plugin also has integrations with [Slither](slither.html).
<br>profile name: **solidityStaticAnalysis**
<br>[Documentation](static_analysis.html)


## Additional Plugins

(sorted alphabetically)

**Celo Compiler / Deployer** &nbsp; ![](images/pi-celo.png)<br>
Compile & Deploy to the Celo blockchain. 
<br>[profile name](https://github.com/ethereum/remix-plugins-directory/blob/master/plugins/celo/profile.json): celo-remix-plugin
<br>[Documentation](https://github.com/dexfair/celo-remix-plugin)
<br>[Make an issue](https://github.com/dexfair/celo-remix-plugin/issues)

**Contract Deployer** &nbsp; ![](images/pi-deployer.png)<br>
Deploy a contract to multiple chains (1 at a time) with the same address. 
<br>[profile name](https://github.com/ethereum/remix-plugins-directory/blob/master/plugins/celo/profile.json): celo-remix-plugin
<br>[Documentation](https://github.com/hexdivision/remix-contract-deployer-plugin)
<br>[Make an issue](https://github.com/hexdivision/remix-contract-deployer-plugin/issues)

**Debug Tools for Remix** &nbsp;   ![](images/pi-remix-debug-tools.png) &nbsp; <br>
Not to be confused with the Debugger, this tool is for plugin devs to help test their plugins & their plugin's API.
<br>[profile name](https://github.com/ethereum/remix-plugins-directory/blob/master/plugins/remix-plugin-debug/profile.json): debugPlugin
<br>[Documentation](https://github.com/pldespaigne/remix-debug-plugin#-instalation)

**Defi Explorer**  &nbsp; ![](images/pi-defi-exp.png) &nbsp; <br>
The Defi Explorer loads the Uniswap V2 Protocol into the File Explorers.
<br>[profile name](https://github.com/ethereum/remix-plugins-directory/blob/master/plugins/defi-explorer/profile.json): defiexplorer
<br>[Documentation](https://remix-defi-explorer-plugin.readthedocs.io/en/latest/)
<br>[Make an issue](https://github.com/Machinalabs/remix-defi-explorer-plugin/issues)

**Defi Tutorials**  &nbsp; (main panel) &nbsp; ![](images/pi-defi-tut.png) <br>
Learn about UMA. This plugin works with the UMA tutorials plugin. 
<br>[profile name](https://github.com/ethereum/remix-plugins-directory/blob/master/plugins/defi-tutorials/profile.json): defiTutorials
<br>[Make an issue](https://github.com/Machinalabs/remix-defi-tutorials-plugin/issues)

**DGIT**  &nbsp; ![](images/pi-dgit.png) &nbsp;  Version Control  <br>
Clone repos from github & create GIT repos & use standard git commands. Also export/import to IPFS.
<br>[profile name](https://github.com/ethereum/remix-plugins-directory/blob/master/plugins/dgit/profile.json): dgit
<br>[Documentation](https://github.com/bunsenstraat/remix-storage-plugin)
<br>[Make an issue](https://github.com/bunsenstraat/remix-storage-plugin/issues)

**EthDoc Documentation Generator** &nbsp; ![](images/pi-ethdoc.png) &nbsp;  
<br>Creates the documentation of a soldity contract - generated from the Natspec comments in the code. The generated doc is placed in EthDoc viewer - which will be visible in an tab in the editor.
<br>[profile name](https://github.com/ethereum/remix-plugins-directory/blob/master/plugins/ethdoc/profile.json): ethdoc
<br>[Documentation](https://remix-ethdoc-plugin.readthedocs.io/en/latest/)
<br>[Make an issue](https://github.com/Machinalabs/remix-ethdoc-plugin/issues)

**EthDoc Viewer** &nbsp; (main panel) &nbsp;  
<br>This plugin work with EthDoc Generator.  It is automatically activated.
<br>[profile name](https://github.com/ethereum/remix-plugins-directory/blob/master/plugins/ethdoc-viewer/profile.json): ethdoc-viewer
<br>[Documentation](https://remix-ethdoc-plugin.readthedocs.io/en/latest/)
<br>[Make an issue](https://github.com/Machinalabs/remix-ethdoc-viewer-plugin/issues)

**Etherscan Contract Verifier** &nbsp; ![](images/pi-etherscan.png) &nbsp;
<br>Verify a contract on Etherscan.
<br>[profile name](https://github.com/ethereum/remix-plugins-directory/blob/master/plugins/etherscan/profile.json): etherscan
<br>[Documentation](https://remix-etherscan-plugin.readthedocs.io/en/latest/)
<br>[Make an issue](https://github.com/Machinalabs/remix-etherscan-plugin/issues)

**Flattener** &nbsp; ![](images/pi-flattener.png)
<br>Flattens compiled contracts
<br>[profile name](https://github.com/ethereum/remix-plugins-directory/blob/master/plugins/flattener/profile.json): flattener
<br>[Make an issue](https://github.com/bunsenstraat/flattener/issues)

**Gas Profiler** &nbsp; ![](images/pi-gas-profiler.png)
<br>Profile gas costs for every transaction you execute.  Total execution costs as well as per line costs are displayed.
<br>[profile name](https://github.com/ethereum/remix-plugins-directory/blob/master/plugins/gas-profiler/profile.json): gasProfiler
<br>[Documentation](https://github.com/EdsonAlcala/remix-gas-profiler)
<br>[Make an issue](/issues)  EDIT

**Learneth** &nbsp; ![](images/pi-learneth.png) &nbsp; Remix & Solidity Tutorials
<br>Tutorials that contain quizes that teach users Solidity and Remix features.
<br>[profile name](https://github.com/ethereum/remix-plugins-directory/blob/master/plugins/learneth/profile.json): learnEth
<br>[Documentation](https://remix-learneth-plugin.readthedocs.io/en/latest/index.html)
<br>[Make an issue](https://github.com/bunsenstraat/remix-learneth-plugin/issues)

**Lexon** &nbsp; ![](images/pi-lexon.png) &nbsp;
<br>Lexon is a language that reads like a legal contract and compile into Solidity (and then bytecode). This plugin allow you to take Lexon code and to
<br>[profile name](https://github.com/ethereum/remix-plugins-directory/blob/master/plugins/lexon/profile.json): lexon
<br>[Documentation](https://gitlab.com/lexon-foundation/lexon-remix)
<br>[Make an issue](https://gitlab.com/lexon-foundation/lexon-remix/-/issues)

**Moonbeam** &nbsp; ![](images/pi-moonbeam.png)
<br>Compile and Deploy to the Moonbeam network
<br>[profile name](https://github.com/ethereum/remix-plugins-directory/blob/master/plugins/moonbeam/profile.json): moonbeam-remix-plugin
<br>[Documentation](https://github.com/purestake/moonbeam-remix-plugin)
<br>[Make an issue](https://github.com/PureStake/moonbeam-remix-plugin/issues)

**Mythx Security Verification** &nbsp; ![](images/pi-mythx.png) 
<br>Free version and paid version for Mythx analysis.
<br>[profile name](https://github.com/ethereum/remix-plugins-directory/blob/master/plugins/mythx/profile.json): mythx
<br>[Documentation](https://docs.mythx.io/tools-integrations/remix)
<br>[Make an issue](https://github.com/aquiladev/remix-mythx-plugin/issues)

**Nahmii compiler** &nbsp; ![](images/pi-moonbeam.png)
<br>Compile solidity contracts for the Nahmii network
<br>[profile name](https://github.com/ethereum/remix-plugins-directory/blob/master/plugins/nahmii/profile.json): nahmii-compiler
<br>[Make an issue](https://github.com/nahmii-community/remix-nahmii-compiler-plugin/issues)

**One Click Dapp** &nbsp; ![](images/pi-1click.png) 
<br>Makes a basic front end for your contract once it is deployed on a public testnet.  
[profile name](https://github.com/ethereum/remix-plugins-directory/blob/master/plugins/one-click-dapp/profile.json): oneClickDapp
<br>[Documentation](https://github.com/oneclickdapp/remix-plugin-one-click-dapp)
<br>[Make an issue](https://github.com/oneclickdapp/remix-plugin-one-click-dapp/issues)

**Proveable Oracle Services** &nbsp; ![](images/pi-proveable.png) 
<br>An oracle for the JavaScript VM environment.
<br>[profile name](https://github.com/ethereum/remix-plugins-directory/blob/master/plugins/provable/profile.json): provable
<br>[Documentation](https://docs.provable.xyz/#development-tools-remix-ide-provable-plugin)

**Quorum Network** &nbsp; ![](images/pi-quorum.png)
<br>A Connection to Quorum 
<br>[profile name](https://github.com/ethereum/remix-plugins-directory/blob/master/plugins/quorum/profile.json): quorum
<br>[Documentation](https://medium.com/remix-ide/quorum-plugin-for-remix-ee232ebca64c)
<br>[Make an issue](https://github.com/ConsenSys/quorum-remix/issues)

**Solhint Linter** &nbsp; ![](images/pi-solhint.png)
<br>Solidity Linter providing both Security and Style Guide validations.
<br>[profile name](https://github.com/ethereum/remix-plugins-directory/blob/master/plugins/solhint/profile.json): solhint
<br>[Documentation](https://protofire.github.io/solhint/docs/rules.html)
<br>[Make an issue](https://github.com/protofire/remix-solhint-plugin)

**Solidity 2 UML** &nbsp; ![](images/pi-sol2uml.png) 
<br>Generate UML diagrams from a compiled Solidity file
<br>[profile name](https://github.com/ethereum/remix-plugins-directory/blob/master/plugins/sol2uml/profile.json): sol2uml
<br>[Documentation](https://github.com/aquiladev/remix-sol2uml)
<br>[Make an issue](https://github.com/aquiladev/remix-sol2uml)

**Sourcify** &nbsp; ![](images/pi-sourcify.png) &nbsp; 
<br>Verify you contracts and fetch verified contracts
<br>[profile name](https://github.com/ethereum/remix-plugins-directory/blob/master/plugins/source-verifier/profile.json): sourcify
<br>[Documentation](https://github.com/ethereum/sourcify)
<br>[Make an issue](https://github.com/sourcifyeth/remix-sourcify/issues)

**Starknet** &nbsp; ![](images/pi-starknet.png) &nbsp; 
<br>Compile contracts written in Cairo to Starknet
<br>[profile name](https://github.com/ethereum/remix-plugins-directory/blob/master/plugins/starkNet_compiler/profile.json): starkNet_compiler
<br>[Documentation](https://github.com/hexdivision/starkware-remix-plugin)
<br>[Make an issue](https://github.com/hexdivision/starkware-remix-plugin/issues)

**Tenderly** &nbsp; ![](images/pi-tenderly.png) 
<br>Verify Contracts. Import To Remix From your Tenderly project.
<br>[profile name](https://github.com/ethereum/remix-plugins-directory/blob/master/plugins/tenderly/profile.json): tenderly
<br>[Documentation](https://docs.tenderly.co/monitoring/integrations#remix)
<br>[Make an issue](/issues)

**UMA Playground** &nbsp; (main panel) 
<br>Learn about the UMA protocol.  This plugin is loaded from the DEFI Tutorial plugin.
<br>[profile name](https://github.com/ethereum/remix-plugins-directory/blob/master/plugins/uma-playground/profile.json): umaPlayground
<br>[Make an issue](https://github.com/Machinalabs/remix-uma-playground/issues)

**UMA Tutorials** &nbsp; (main panel) 
<br>This plugin is activated by the DEFI Tutorials
<br>[profile name](https://github.com/ethereum/remix-plugins-directory/blob/master/plugins/uma-tutorials/profile.json): umaTutorials
<br>[Make an issue](https://github.com/Machinalabs/remix-uma-tutorials-plugin/issues)

**Vyper Compiler** &nbsp; ![](images/pi-vyper.png) &nbsp; 
<br>Compile vyper code using local or remote Vyper compiler.
<br>[profile name](https://github.com/ethereum/remix-plugins-directory/blob/master/plugins/vyper/profile.json): vyper
<br>[Documentation](https://github.com/GrandSchtroumpf/vyper-remix)
<br>[Make an issue](https://github.com/GrandSchtroumpf/vyper-remix)

**Wallet Connect** &nbsp; (main panel) 
<br>Approve transactions on your mobile device
<br>[profile name](https://github.com/ethereum/remix-plugins-directory/blob/master/plugins/wallet-connect/profile.json): walletconnect
<br>[Make an issue](https://github.com/yann300/remix-walletconnect/issues)

**YUL++** &nbsp; ![](images/pi-yul-p.png) &nbsp; 
<br>A low level language for Ethereum.
<br>[profile name](https://github.com/ethereum/remix-plugins-directory/blob/master/plugins/yulp/profile.json): yulp
<br>[Make an issue](https://github.com/loredanacirstea/remix-yulp-plugin/issues)

**Zokrates** &nbsp; ![](images/pi-zok.png)  &nbsp; 
<br>ZoKrates is a toolbox for zkSNARKs on Ethereum.
<br>[profile name](https://github.com/ethereum/remix-plugins-directory/blob/master/plugins/zokrates/profile.json): ZoKrates
<br>[Documentation](https://zokrates.github.io/)
<br>[Make an issue](https://github.com/Zokrates/zokrates-remix-plugin/issues)



