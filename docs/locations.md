Remix URLs & Links with Parameters
==================================

## Main Remix URLs

- Remix IDE Online is located at [https://remix.ethereum.org](https://remix.ethereum.org). 

- The alpha version of remix is located at [https://remix-alpha.ethereum.org](https://remix-alpha.ethereum.org). This is not a stable version.

- Github repo: [https://github.com/ethereum/remix-project](https://github.com/ethereum/remix-project). The README contains instructions for running Remix-IDE locally.

- Remix Desktop is an Electron App. Here is the [release page](https://github.com/ethereum/remix-desktop/releases).

- Remix has a VSCode extension called [Ethereum Remix](https://marketplace.visualstudio.com/items?itemName=RemixProject.ethereum-remix). 

- The Remix twitter account is [EthereumRemix](https://twitter.com/EthereumRemix).

- The Remix Project Medium publication is: [https://medium.com/remix-ide](https://medium.com/remix-ide).

- The [Remix Project](https://remix-project.org) website introduces the different facets of our project.

- The [Remix Gitter Channel](https://gitter.im/ethereum/remix) is a forum to post your questions about Remix.

## Customize Remix with URL Parameters

There are many ways to customize Remix IDE by using url parameters. Here are some options:
* Activate or deactivate a **list of plugins to be activated** - and specify which plugin gains the "focus". [SEE MORE](#activating-a-list-of-plugins)
* Send **commands to a plugin** - once the plugin loads. [SEE MORE](#pass-commands-to-a-plugin-s-api-via-a-url-param)
* [Load a GIST](#load-a-gist), [a file via a url](#load-a-file-via-a-url-into-the-editor) or a [base64 encoded string](#load-an-encoded-base64-string-into-a-sol-file-in-the-editor) into Remix's Editor. 
* Specify **the theme** (Dark or Light). [SEE MORE](#specifying-a-theme)
* Specify which panels should be **minimized** - useful when embedding Remix in your site. [SEE MORE](#minimizing-remix-panels)
* Select the **version of the Solidity** compiler, enable/disable the **optimizer**, turn on auto compile or choose the language for the Solidity compiler. [SEE MORE](#load-a-specific-version-of-the-solidity-compiler)

### Activating a list of plugins
The following example contains the url parameter **activate** followed by **a comma separated list of plugins**. 

The last plugin in the list will gain the focus.  

When you use the activate list, all other plugins that a user had loaded will be deactivated.  This does not apply to the file explorer, the plugin manager, and the settings modules because these are never deactivated.

```
https://remix.ethereum.org/?#activate=solidity,solidityUnitTesting,defiexplorer
```

Note: a plugin is called by its **name** as specified in its profile.  There are 3 types of plugins: 
1. **Native Mandatory Plugins** that are always loaded (so you don't need to activate them using the url parameter **activate**). These include: **fileManager**, **settings**, **manager** (the plugin manager), and **udapp** (deploy & run).
2. **Native Optional Plugins** that are loaded on demand: **debugger**, **hardhat-provider**, **solidity**, **solidityStaticAnalysis**, **solidityUnitTesting**, and **vyper** 
3. **External Plugins** to get these plugins' names, please go to [https://github.com/ethereum/remix-plugins-directory/tree/master/plugins](https://github.com/ethereum/remix-plugins-directory/tree/master/plugins).

### Deactiving a list of plugins
```
https://remix.ethereum.org/?#deactivate=debugger
```

### Minimizing Remix panels

The following URL will **close everything except the main panel & the icon panel** (the side and terminal are minimized).
```
https://remix.ethereum.org/?#embed=true
```

To minimize just the side panel, use this URL:
```
https://remix.ethereum.org/?#minimizesidepanel=true
```

To minimize just the terminal, use this URL:
```
https://remix.ethereum.org/?#minimizeterminal=true
```

### Specifying a theme
To link to Remix with a theme specified use this url:
```
 **https://remix.ethereum.org/?#theme=Dark**
```

### A URL example combining multiple parameters
To link to Remix with the a list of plugins activated and with:

 * the Learneth gaining the side panel's focus (because it is the last in the list)
 * the Light theme loaded 
 * the terminal minimized
 * optimize off

 use this url:
```
 https://remix.ethereum.org/?#activate=solidity,solidityUnitTesting,LearnEth&theme=Light&minimizeterminal=true&optimize=false&evmVersion=null&version=soljson-v0.6.6+commit.6c089d02.js
```

## Pass commands to a plugin's API via a url param
The URL parameter to issue a command is `call`.  Following the `call` is a // (double slash) separated list of arguments.

```
call=plugin_name//function//parameter1//paremeter2
```

### An example using call
The URL below uses `activate` & `call`.  It **activates** a number of plugins and **calls** the File Explorers to tell it to load one of the default Remix files:
```
https://remix.ethereum.org/?#activate=defiexplorer,solidity&call=fileManager//open//contracts/3_Ballot.sol
```

### Load a specific tutorial in the **LearnEth** plugin:
```
https://remix.ethereum.org/?#activate=solidityUnitTesting,solidity,LearnEth&call=LearnEth//startTutorial//ethereum/remix-workshops//master//proxycontract
```

## Load a file via a URL into the Editor
The `url` parameter takes a URL, loads it into the Editor and saves it into the code-sample workspace of the File Explorer:
```
https://remix.ethereum.org/#url=https://github.com/ethereum/remix-project/blob/master/apps/remix-ide/contracts/app/solidity/mode.sol
```

## Load an encoded base64 string into a .sol file in the Editor
The `code` parameter takes an encoded base64 string and loads it into the Editor as a .sol file and saves to the code-sample workspace of the File Explorer:
```
https://remix.ethereum.org/?#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVAoKcHJhZ21hIHNvbGlkaXR5IDAuOC40OwoKLyoqCiAqIEB0aXRsZSBXb25kZXJmdWxDb2RlCiAqIEBkZXYgV2VsY29tZSB0byBSZW1peAogKi8KY29udHJhY3QgWW91IHsKCiAgICBhZGRyZXNzIHByaXZhdGUgb3duZXI7CiAgICAKICAgIC8qKgogICAgICogQGRldiBTZXQgY29udHJhY3QgZGVwbG95ZXIgYXMgeW91QW5kWW91cldvbmRlcmZ1bFNlbGYKICAgICAqLwogICAgY29uc3RydWN0b3IoKSB7CiAgICAgICAgeW91QW5kWW91cldvbmRlcmZ1bFNlbGYgPSBtc2cuc2VuZGVyOwoKICAgIH0KCiAgICAvKioKICAgICAqIEBkZXYgQ2hhbmdlIG1vb2QKICAgICAqIEBwYXJhbSBuZXdPd25lciBhZGRyZXNzIG9mIG5ldyBvd25lcgogICAgICovCiAgICBmdW5jdGlvbiBjaGFuZ2VNb29kKGFkZHJlc3MgbmV3TW9vZEFkZHIpIHB1YmxpYyB7CiAgICAgICAgb3duZXJNb29kID0gbmV3TW9vZEFkZHI7CiAgICB9Cn0=
```

## Load a GIST
The URL parameter here is `gist`.
```
https://remix.ethereum.org/?gist=0fe90e825327ef313c88aedfe66ec142
```

### Load a GIST and have it be visible in the Editor:
Using both `gist` & `call`
```
https://remix.ethereum.org/?#activate=solidity,debugger&gist=0fe90e825327ef313c88aedfe66ec142&call=fileManager//open//browser/gists/0fe90e825327ef313c88aedfe66ec142/gridMix4.sol
```

### Load a GIST, have it be visible in the Editor & load a list of plugins:
```
https://remix.ethereum.org/?#activate=solidity,LearnEth&gist=0fe90e825327ef313c88aedfe66ec142&call=fileManager//open//browser/gists/0fe90e825327ef313c88aedfe66ec142/gridMix4.sol 
```

## Load a specific version of the Solidity compiler:
```
https://remix.ethereum.org/?#version=soljson-v0.6.6+commit.6c089d02
```
**Note:** you need to specify both the Solidity version and the commit.

## Load a custom Solidity compiler:
```
https://remix.ethereum.org/#version=https://solidity-blog.s3.eu-central-1.amazonaws.com/data/08preview/soljson.js
```

## Turn on autoCompile:
```
https://remix.ethereum.org/#autoCompile=true
```

## Select the language for the Solidity Compiler
Choose YUL or Solidity with the language parameter.
```
https://remix.ethereum.org/#language=Yul
```