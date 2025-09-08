# Remix Commands

In the console, you can run the commands listed below. Once you start to type a command, there is _auto complete_. These commands are using the following libraries:

**remix**: Remix has a number of CLI commands for loading & executing file in a workspace. See the list below.

**ethers**: Remix IDE enables the use of ethersjs commands. See the [Ethers docs](https://docs.ethers.org/v6/) for the full list.

**web3**: Remix IDE enables the use of web3js commands. See the [Web3js docs](https://web3js.readthedocs.io/) for the full list.

**swarmgw**: This library can be used to upload/download files to Swarm via https://swarm-gateways.net/.

## Remix Commands

**remix.execute(filepath)**: Run the script specified by file path. If filepath is empty, script currently displayed in the editor is executed.

**remix.exeCurrent()**: Run the script currently displayed in the editor.

**remix.getFile(path)**: Returns the content of the file located at the given path

**remix.help()**: Display this help message.

**remix.loadgist(id)**: Load a gist in the file explorer.

**remix.loadurl(url)**: Load the given url in the file explorer. The url can be of type github, swarm or ipfs.

### A few Ethers JS examples

**ethers.providers**: A Provider abstracts a connection to the Ethereum blockchain, for issuing queries and sending state changing transactions.

**ethers.utils**: The utility functions exposed in both the ethers umbrella package and the ethers-utils. eg ethers.utils.formatBytes32String( text )

### A few Web3 JS examples

**web3.eth.abi**: The web3.eth.abi functions let you de- and encode parameters to ABI (Application Binary Interface) for function calls to the EVM (Ethereum Virtual Machine).

**web3.providers**: Contains the current available providers.

**web3.utils**: This package provides utility functions for Ethereum dapps and other \*\*web3.js packages.

### A few Swarm examples (these will be updated soon)

**swarmgw.get(url, cb)**: Download files from Swarm via https\*\*://swarm-gateways.net/

**swarmgw.put(content, cb)**: Upload files to Swarm via https\*\*://swarm-gateways.net/
