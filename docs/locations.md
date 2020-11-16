Remix URLs & Links with Parameters
==================================

- An online version is available at [https://remix.ethereum.org](https://remix.ethereum.org). This version is stable and is updated at almost every release.
- An alpha online version is available at [https://remix-alpha.ethereum.org](https://remix-alpha.ethereum.org). This is not a stable version.

- Github repo: [https://github.com/ethereum/remix-project](https://github.com/ethereum/remix-project). The README contains instructions for running Remix-IDE locally.

- Github release: [https://github.com/ethereum/remix-project/releases](https://github.com/ethereum/remix-project/releases). 


## Embedding & Linking to Remix

Remix-IDE's urls have parameters -so it is possible to specify:
* A **list of plugins to be activated** - as well as which plugin you want to be loaded in the side panel (so it gains the "focus").
* A **Command to be sent to a plugin** - once the plugin loads.
* **The theme** (Dark or Light). 
* The panels that should be **minimized**.
* The **version of the Solidity** compiler & the **optimize** option enabled or disabled.
* Which panels should be minimized.

### Activating a list of plugins
The following example contains the url parameter **activate** followed by **a list of plugins**. The last plugin will gain the focus.  

When you use the activate list, all other plugins that a user had loaded will be deactivated.  This does not apply to the file explorer, the plugin manager, and the settings modules because these are never deactivated.

```
https://remix.ethereum.org/?#activate=solidity,solidityUnitTesting,udapp,defiexplorer
```

### Deactiving a list of plugins
```
https://remix.ethereum.org/?#deactivate=udapp
```

Note: plugin are called by their name in their profile.  To check for a plugin's profile name - for plugins built by external teams, please go to [https://github.com/ethereum/remix-plugins-directory/tree/master/plugins](https://github.com/ethereum/remix-plugins-directory/tree/master/plugins)

### Minimizing Remix panels

The following URL will **close everything except the main panel & the icon panel** (the side and terminal are minimized).
```
https://remix.ethereum.org/?#embed=true
```

To minimize just the side panel, use this URL:
```
https://remix.ethereum.org/?#minimizesidepanel=true
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

## Passing commands to a plugin via a url param
It is also possible to pass a command to a plugin's api with a url parameter. 

**Here are some examples:**

### Load one of the default Remix files:
```
https://remix.ethereum.org/?#activate=udapp,solidity&call=fileManager//open//3_Ballot.sol
```

### Load a GIST
```
https://remix.ethereum.org/?gist=0fe90e825327ef313c88aedfe66ec142
```

### Load a GIST and have it be visible in the Editor:
```
https://remix.ethereum.org/?#activate=solidity,udapp&gist=0fe90e825327ef313c88aedfe66ec142&call=fileManager//open//browser/gists/0fe90e825327ef313c88aedfe66ec142/gridMix4.sol
```

### Load a GIST, have it be visible in the Editor & load a list of plugins:
```
https://remix.ethereum.org/?#activate=solidity,udapp&gist=0fe90e825327ef313c88aedfe66ec142&call=fileManager//open//browser/gists/0fe90e825327ef313c88aedfe66ec142/gridMix4.sol 
```

### Load a specific tutorial in the **LearnEth** plugin:
```
https://remix.ethereum.org/?#activate=udapp,solidity,LearnEth&call=LearnEth//startTutorial//ethereum/remix-workshops//master//proxycontract
```

### Load a specific version of the Solidity compiler:
```
https://remix.ethereum.org/?#version=soljson-v0.6.6+commit.6c089d02
```
**Note:** you need to specify both the Solidity version and the commit.
