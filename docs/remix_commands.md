Remix Commands
==============

In the console, you can run the commands listed below.  Once you start to type a command, there is *auto completion*.  These commands are using the following libraries:

+ *remix*: See the remix commands below that can be run from the console. 

+ *ethers*: The [ethers.js](https://docs.ethers.io) library is a compact and complete JavaScript library for Ethereum. Please visit the Ethers.js documentation site for a full list of commands.
 
+ *web3*: The [web3.js](https://web3js.readthedocs.io) library is a collection of modules which contain specific functionality for the ethereum ecosystem. Please visit the Web3.js documentation site for a full list of commands.

+ *swarmgw*: This library can be used to upload/download files to Swarm via https://swarm-gateways.net.  For more info on this library see: [https://github.com/axic/swarmgw](https://github.com/axic/swarmgw).

If you want a command (other than a remix command) to return something in the console - you need to wrap it in a console.log() - like this: `console.log(ethers.utils.formatBytes32String(‘remix'))`

Generally **web3** & **ethers** commands are run in scripts. 
For more information about running scripts in Remix IDE please go [here](running_scripts.html).


#### Here's the list of Remix & Swarm commands.  

**remix.execute(filepath)**: Run the script specified by file path. If filepath is empty, script currently displayed in the editor is executed.

**remix.exeCurrent()**: Run the script currently displayed in the editor.

**remix.loadgist(id)**: Load a gist in the file explorer.

**remix.loadurl(url)**: Load the given url in the file explorer. The url can be of type github, swarm or ipfs.

**remix.help()**: Display this help message.

**swarmgw.get(url, cb)**: Download files from Swarm via https**://swarm-gateways.net/

**swarmgw.put(content, cb)**: Upload files to Swarm via https**://swarm-gateways.net/
