Remix URLs & Links with Parameters
==================================

## Remix URLs
- An online version is available at [https://remix.ethereum.org](https://remix.ethereum.org). This version is stable and is updated at almost every release.
- An alpha online version is available at [https://remix-alpha.ethereum.org](https://remix-alpha.ethereum.org). This is not a stable version.

- Github repo: [https://github.com/ethereum/remix-project](https://github.com/ethereum/remix-project) . The README contains instructions for running Remix-IDE locally.

- Github release: [https://github.com/ethereum/remix-project/releases](https://github.com/ethereum/remix-project/releases) . 


## Embedding & Linking to Remix

Remix-IDE's urls have parameters -so it is possible to specify:
* the list of plugins you want activated
* the theme (Dark or Light) 
* the panels that should be minimized
* if you want the Solidity compiler to have **optimize** enabled

In the following example, there is a list of plugins that follows the word **plugins** will be activated and the last plugin will gain the focus.
```
https://remix.ethereum.org/?#activate=solidity,solidityUnitTesting,udapp,defiexplorer
```

For the plugin are called by their name in their profile.  To check for a plugin's profile name - for plugins built by external teams, please go to [https://github.com/ethereum/remix-plugins-directory/tree/master/plugins](https://github.com/ethereum/remix-plugins-directory/tree/master/plugins)

## Further Customization with URL parameters

The following URL will close everything except the main panel & the icon panel (so the side and terminal are minimized)

**https://remix.ethereum.org/?#embed=true**

To link with the side panel minimized use this URL:

**https://remix.ethereum.org/?#minimizesidepanel=true**

To link to Remix with the dark theme or the light theme specified use this url:
 
 **https://remix.ethereum.org/?#theme=Dark**

To link to Remix with the Solidity compiler, the unit testing, and LearnEth plugins activated (with Learneth gaining the side panel's focus) & with the Light theme loaded & with the terminal minimized use this URL & with optimize off:

 https://remix.ethereum.org/?#activate=solidity,solidityUnitTesting,LearnEth&theme=Light&minimizeterminal=true&optimize=false&evmVersion=null&version=soljson-v0.6.6+commit.6c089d02.js
