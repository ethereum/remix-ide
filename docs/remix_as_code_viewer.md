---
myst:
  html_meta:
    "description": "Use Remix IDE as a code viewer to inspect verified smart contracts from Etherscan or any GitHub repository."
    "keywords": "remix code viewer, etherscan contracts, github contracts, view contracts, remix ide"
---

# Remix as code viewer

## Through Etherscan

Verified contracts on Etherscan can be viewed in Remix by making a simple change to the URL. Mostly for a multiple part contract verification, Remix provides a quick way to load all the contracts.

A typical Etherscan URL for a contract address looks like this:

`https://etherscan.io/address/0xdac17f958d2ee523a2206206994597c13d831ec7`

In the URL, change `etherscan.io` to `app.remix.live`

`https://app.remix.live/address/0xdac17f958d2ee523a2206206994597c13d831ec7`

and reload. It will fetch the contracts verified on Etherscan.

Contracts verified on Ethereum mainnet and on other test networks (Ropsten, Rinkeby, Kovan & Goerli) will be loaded in respective directories under `etherscan-code-sample` workspace.

![Remix IDE showing contracts loaded from Etherscan in the Etherscan-code-sample workspace](images/code-viewer/a-code-viewer-etherscan.png)

This works for Etherscan testnet URLs `https://ropsten.etherscan.io`, `https://goerli.etherscan.io/` etc. If they are similarly updated, contracts will be loaded in Remix.

## Through GitHub

Solidity files in GitHub can be loaded on Remix with a similar tweak. For a file with URL like:

`https://github.com/remix-project-org/remix-project/blob/master/apps/remix-ide/contracts/app/solidity/mode.sol`

change `github.com` to `app.remix.live` like:

`https://app.remix.live/ethereum/remix-project/blob/master/apps/remix-ide/contracts/app/solidity/mode.sol`

and reload. It will open the same file in Remix IDE.

![Remix IDE showing a Solidity file loaded from a GitHub URL](images/code-viewer/a-code-viewer-github.png)
