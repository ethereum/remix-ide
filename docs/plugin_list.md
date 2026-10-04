---
myst:
  html_meta:
    "description": "Complete list of plugins available in Remix IDE's Plugin Manager for extending the IDE with additional tools and functionality."
    "keywords": "remix plugins list, remix ide plugins, plugin manager, solidity tools"
---

<!-- vale off -->

# Plugin List

Here is the list of Remix plugins that you will see in the Plugin Manager.

```{tip}
Click a card to open the Remix IDE with the plugin enabled.
```

## Internal plugins

These are plugins that are managed by the Remix team.

::::{grid} 3
:gutter: 4

:::{grid-item-card} Contract Verification
:columns: 12 6 4 4
:class-card: plugin-card sd-border-1 sd-rounded-2
:link-type: url
:link: https://app.remix.live/?#activate=contract-verification
:img-top: images/plugin-list/contractVerification.webp

Verify contract code on Sourcify, Etherscan and Blockscout at the same time.

- [Documentation](https://remix-ide.readthedocs.io/en/latest/contract_verification.html)
- Profile name: **contract-verification**
  :::

:::{grid-item-card} Debugger
:columns: 12 6 4 4
:class-card: plugin-card sd-border-1 sd-rounded-2
:link-type: url
:link: https://app.remix.live/?#activate=debugger
:img-top: images/plugin-list/debuggerLogo.webp

Insert breakpoints, step through a contract, and debug transactions.

- [Documentation](https://remix-ide.readthedocs.io/en/latest/debugger.html)
- Profile name: **debugger**
  :::

:::{grid-item-card} Deploy & Run
:columns: 12 6 4 4
:class-card: plugin-card sd-border-1 sd-rounded-2
:link-type: url
:link: https://app.remix.live/?#activate=udapp
:img-top: images/plugin-list/deployAndRun.webp

Deploy & interact with smart contracts on the in-browser chain (JSVM), local nodes, and public networks.

- [Documentation](https://remix-ide.readthedocs.io/en/latest/run.html)
- Profile name: **udapp**
  :::

:::{grid-item-card} File Explorer
:columns: 12 6 4 4
:class-card: plugin-card sd-border-1 sd-rounded-2
:link-type: url
:link: https://app.remix.live/?#activate=fileManager
:img-top: images/plugin-list/fileManager.webp

The File Explorer is where you can see the files.

- [Documentation](https://remix-ide.readthedocs.io/en/latest/file_explorer.html)
- Profile name: **fileManager**
  :::

:::{grid-item-card} Git plugin
:columns: 12 6 4 4
:class-card: plugin-card sd-border-1 sd-rounded-2
:link-type: url
:link: https://app.remix.live/?#activate=dgit
:img-top: images/plugin-list/Git-logo-black.png

Enables version control using Git.

- [Documentation](https://remix-ide.readthedocs.io/en/latest/git.html)
- Profile name: **dgit**
  :::

:::{grid-item-card} Solidity Compiler
:columns: 12 6 4 4
:class-card: plugin-card sd-border-1 sd-rounded-2
:link-type: url
:link: https://app.remix.live/?#activate=solidity
:img-top: images/plugin-list/solidity.webp

Compiles Solidity & Yul.

- [Documentation](https://remix-ide.readthedocs.io/en/latest/compile.html)
- Profile name: **solidity**
  :::

:::{grid-item-card} Solidity Static Analysis
:columns: 12 6 4 4
:class-card: plugin-card sd-border-1 sd-rounded-2
:link-type: url
:link: https://app.remix.live/?#activate=solidityStaticAnalysis
:img-top: images/plugin-list/staticAnalysis.webp

Static code analysis with integrations for **Slither** and **Solhint**.

- [Documentation](https://remix-ide.readthedocs.io/en/latest/static_analysis.html)
- Profile name: **solidityStaticAnalysis**
  :::

:::{grid-item-card} Solidity Unit Testing
:columns: 12 6 4 4
:class-card: plugin-card sd-border-1 sd-rounded-2
:link-type: url
:link: https://app.remix.live/?#activate=solidityUnitTesting
:img-top: images/plugin-list/pi-sut.png

Run unit tests written in Solidity.

- [Documentation](https://remix-ide.readthedocs.io/en/latest/unittesting.html)
- Profile name: **solidityUnitTesting**
  :::

:::{grid-item-card} Vyper Compiler
:columns: 12 6 4 4
:class-card: plugin-card sd-border-1 sd-rounded-2
:link-type: url
:link: https://app.remix.live/?#activate=vyper
:img-top: images/plugin-list/vyperLogo2.webp

Compile Vyper code using local or remote Vyper compiler.

- [Documentation](https://remix-ide.readthedocs.io/en/latest/vyper.html)
- Profile name: **vyper**
  :::

:::{grid-item-card} Workspace Templates
:columns: 12 6 4 4
:class-card: plugin-card sd-border-1 sd-rounded-2
:link-type: url
:link: https://app.remix.live/?#activate=templateSelection
:img-top: images/plugin-list/bgRemi.webp

Create workspaces from existing templates like the OpenZeppelin ERC20 template.

- Profile name: **templateSelection**
  :::

:::{grid-item-card} Plugin Manager
:columns: 12 6 4 4
:class-card: plugin-card sd-border-1 sd-rounded-2
:link-type: url
:img-top: images/plugin-list/pluginManager.webp
:link: https://app.remix.live/?#activate=pluginManager

Displays a list of all available plugins.

Profile name: **pluginManager**
:::

:::{grid-item-card} Slither
:columns: 12 6 4 4
:class-card: plugin-card sd-border-1 sd-rounded-2
:link-type: url
:img-top: images/plugin-list/slither-logo.png
:link: https://app.remix.live/?#activate=solidityStaticAnalysis

This plugin is now part of the Solidity Analyzers plugin.
:::

:::{grid-item-card} Solhint
:columns: 12 6 4 4
:class-card: plugin-card sd-border-1 sd-rounded-2
:link-type: url
:img-top: images/plugin-list/solhint.png
:link: https://app.remix.live/?#activate=solidityStaticAnalysis

This plugin is now part of the Solidity Analyzers plugin.
:::

:::{grid-item-card} LearnEth
:columns: 12 6 4 4
:class-card: plugin-card sd-border-1 sd-rounded-2
:link-type: url
:link: https://app.remix.live/?#activate=LearnEth
:img-top: images/plugin-list/learnEthLogo.webp

Remix, Solidity, & blockchain tutorials with quizzes teaching Solidity and Remix features.

- Profile name: **LearnEth**
  :::

:::{grid-item-card} Circom Compiler
:columns: 12 6 4 4
:class-card: plugin-card sd-border-1 sd-rounded-2
:link-type: url
:link: https://app.remix.live/?#activate=circuit-compiler
:img-top: images/plugin-list/circom-compiler-logo.png

Write, compile, and generate proofs for Zero-Knowledge (ZK) circuits using the Circom language.

- [Documentation](https://iden3.io/circom)
- Profile name: **circuit-compiler**
  :::

:::{grid-item-card} Noir Compiler
:columns: 12 6 4 4
:class-card: plugin-card sd-border-1 sd-rounded-2
:link-type: url
:link: https://app.remix.live/?#activate=noir-compiler
:img-top: images/plugin-list/noir-compiler.png

Enables support for Noir circuit compilation.

- [Documentation](https://noir-lang.org/docs/)
- Profile name: **noir-compiler**
  :::
  ::::

## External plugins

These are the plugins that are managed by external teams.

::::{grid} 3
:gutter: 4

:::{grid-item-card} Arbitrum Stylus
:columns: 12 6 4 4
:class-card: plugin-card sd-border-1 sd-rounded-2
:link-type: url
:link: https://app.remix.live/?#activate=remix-plugin-arbitrum
:img-top: images/plugin-list/arbitrum-arb-logo.png

Deployment and execution of smart contracts via Arbitrum Stylus.

- [Website](https://docs.welldonestudio.io/code)
- Profile name: **remix-plugin-arbitrum**
  :::

:::{grid-item-card} BuildBear
:columns: 12 6 4 4
:class-card: plugin-card sd-border-1 sd-rounded-2
:link-type: url
:link: https://app.remix.live/?#activate=buildbear
:img-top: images/plugin-list/build_bear.jpg

Create private, forked testnets from any EVM chain with explorer, faucet, and RPC.

- [Documentation](https://www.buildbear.io/resources/guides-and-tutorials/remix_plugin)
- Profile name: **buildbear**
  :::

:::{grid-item-card} Cookbook.dev — Find any contract
:columns: 12 6 4 4
:class-card: plugin-card sd-border-1 sd-rounded-2
:link-type: url
:link: https://app.remix.live/?#activate=cookbook.dev
:img-top: images/plugin-list/cookbook.svg

Find any smart contract, build your project faster.

- [Website](https://github.com/CookbookDev/cookbook-remix-plugin)
- Profile name: **cookbook.dev**
  :::

:::{grid-item-card} COTI Plugin
:columns: 12 6 4 4
:class-card: plugin-card sd-border-1 sd-rounded-2
:link-type: url
:link: https://app.remix.live/?#activate=coti-remix-plugin
:img-top: images/plugin-list/coti-logo.webp

Develop and test privacy-preserving smart contracts on the COTI network.

- [Documentation](https://docs.coti.io/coti-documentation)
- Profile name: **coti-remix-plugin**
  :::

:::{grid-item-card} Contract Deployer
:columns: 12 6 4 4
:class-card: plugin-card sd-border-1 sd-rounded-2
:link-type: url
:link: https://app.remix.live/?#activate=contract_deployer
:img-top: images/plugin-list/contract-deployer.webp

Deploy a contract to multiple chains (one at a time) with the same address.

- [Documentation](https://github.com/groksmith/remix-contract-deployer-plugin)
- Profile name: **contract_deployer**
  :::

:::{grid-item-card} Defender Deploy
:columns: 12 6 4 4
:class-card: plugin-card sd-border-1 sd-rounded-2
:link-type: url
:link: https://app.remix.live/?#activate=defender-deploy

Deploy smart contracts using OpenZeppelin Defender from Remix IDE.

- [Documentation](https://docs.openzeppelin.com/defender/remix-plugin)
- Profile name: **defender-deploy**
  :::

:::{grid-item-card} Klaytn
:columns: 12 6 4 4
:class-card: plugin-card sd-border-1 sd-rounded-2
:link-type: url
:link: https://app.remix.live/?#activate=klaytn-remix-plugin
:img-top: images/plugin-list/klatyn-logo.webp

Deploy and interact with smart contracts on the Klaytn public network and local nodes.

- [Website](https://github.com/klaytn-ozys/plug-and-klay)
- Profile name: **klaytn-remix-plugin**
  :::

:::{grid-item-card} Nahmii compiler
:columns: 12 6 4 4
:class-card: plugin-card sd-border-1 sd-rounded-2
:link-type: url
:link: https://app.remix.live/?#activate=nahmii-compiler
:img-top: images/plugin-list/nahi-compiler-logo.png

Compile Solidity contracts for the Nahmii network.

- [Documentation](https://docs.n3.nahmii.io/docs/category/nahmii-30)
- [Open an issue](https://github.com/nahmii-community/remix-nahmii-compiler-plugin/issues)
- Profile name: **nahmii-compiler**
  :::

:::{grid-item-card} Sentio
:columns: 12 6 4 4
:class-card: plugin-card sd-border-1 sd-rounded-2
:link-type: url
:link: https://app.remix.live/?#activate=sentio
:img-top: images/plugin-list/sentio-logo.png

Monitor and analyze your smart contracts inside Remix using Sentio.

- [Documentation](https://docs.sentio.xyz/docs/remix-ide-plugin)
- Profile name: **sentio**
  :::

:::{grid-item-card} SolidityScan
:columns: 12 6 4 4
:class-card: plugin-card sd-border-1 sd-rounded-2
:link-type: url
:link: https://app.remix.live/?#activate=solidityscan

Real-time security analysis of your Solidity smart contracts.

- [Documentation](https://docs.solidityscan.com/remix/)
- Profile name: **solidityscan**
  :::

:::{grid-item-card} Starknet
:columns: 12 6 4 4
:class-card: plugin-card sd-border-1 sd-rounded-2
:link-type: url
:link: https://app.remix.live/?#activate=Starknet
:img-top: images/plugin-list/starknetlogo.webp

Compile contracts written in Cairo to Starknet.

- [Website](https://github.com/NethermindEth/starknet-remix-plugin)
- Profile name: **Starknet**
  :::

:::{grid-item-card} Tenderly
:columns: 12 6 4 4
:class-card: plugin-card sd-border-1 sd-rounded-2
:link-type: url
:link: https://app.remix.live/?#activate=tenderly
:img-top: images/plugin-list/tenderly-logo.png

Verify contracts and import from your Tenderly project.

- [Documentation](https://docs.tenderly.co/introduction)
- Profile name: **tenderly**
  :::

:::{grid-item-card} Wallet Connect (Main Panel)
:columns: 12 6 4 4
:class-card: plugin-card sd-border-1 sd-rounded-2
:link-type: url
:link: https://app.remix.live/?#activate=walletconnect

Approve transactions on your mobile device.

- [Website](https://github.com/yann300/remix-walletconnect/issues)
- Profile name: **walletconnect**
  :::

:::{grid-item-card} Zokrates
:columns: 12 6 4 4
:class-card: plugin-card sd-border-1 sd-rounded-2
:link-type: url
:link: https://app.remix.live/?#activate=ZoKrates
:img-top: images/plugin-list/zokrates-logo.png

Zokrates is a toolbox for zkSNARKs on Ethereum.

- [Website](https://zokrates.github.io/)
- Profile name: **ZoKrates**
  :::
  ::::
