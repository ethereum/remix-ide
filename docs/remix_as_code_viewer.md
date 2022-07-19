Remix as code viewer
=============================

Through Etherscan
------------------

If there is a contract verified on Etherscan and some one wants to have a look on it in an IDE, mostly for a mutiple part contract verification, Remix provides a quick way to load the contract.

Usually, contract is shown on Etherscan on a URL like this:

`https://etherscan.io/address/0xdac17f958d2ee523a2206206994597c13d831ec7`

In URL, just update `etherscan.io` with `remix.ethereum.org` and reload.

`https://remix.ethereum.org/address/0xdac17f958d2ee523a2206206994597c13d831ec7`

It will fetch the contracts verified on Ethereum mainnnet and on other testnets (Ropsten, Rinkeby, Kovan & Goerli).

![](images/a-code-viewer-etherscan.png)

This works for Etherscan testnet URLs like `https://ropsten.etherscan.io` etc.

Loaded contracts will be stored under `etherscan-code-sample` workspace. 