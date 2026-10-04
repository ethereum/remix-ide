Welcome to Remix's documentation!
=====================================

.. meta::
   :description: Official documentation for Remix IDE — the browser-based Ethereum development environment for writing, testing, and deploying Solidity smart contracts.
   :keywords: remix ide documentation, ethereum ide, solidity, smart contracts, blockchain development

**Remix IDE** is used for the entire journey of smart contract development by users at every knowledge level. 
It requires no setup, fosters a fast development cycle, and has a rich set of plugins with intuitive GUIs.  
The IDE comes in two flavors (web app or desktop app).

.. grid:: 2
   :gutter: 3

   .. grid-item-card:: Remix Online IDE
      :columns: 12 12 6 6
      :class-card: remix-start-card

      Run Remix in your browser. No setup required.

      .. button-link:: https://app.remix.live
         :color: primary

         Launch Remix

   .. grid-item-card:: Remix Desktop
      :columns: 12 12 6 6
      :class-card: remix-start-card

      Download the desktop app for macOS, Windows or Linux.

      .. button-link:: https://remix.live/desktop
         :color: primary
         :outline:

         Download

**Supported browsers:** **Firefox**, **Chrome**, **Brave**. 

.. important:: We do not support use of Remix on tablets or mobile devices.

Remix Project
~~~~~~~~~~~~~
Remix IDE is part of the `Remix Project <https://github.com/remix-project-org/remix-project>`__ which also includes the
`Remix Plugin Engine <https://github.com/remix-project-org/remix-plugin>`__ and `Remix Libraries <https://github.com/remix-project-org/remix-project/tree/master/libs#remix-libraries>`__, which are low-level tools for wider use.

Remix IDE is located at `app.remix.live <https://app.remix.live>`__ and more information can be found in these docs. The IDE's repository is at `GitHub <https://github.com/remix-project-org/remix-project>`__.

This set of documents covers instructions on how to use Remix.  
Additional information can be found on our `Substack blog <https://ethereumremix.substack.com>`__ (formerly on: `medium <https://medium.com/remix-ide>`__) and in our tutorial tool, `LearnEth <https://remix-learneth-plugin.readthedocs.io/en/latest/index.html>`__ located inside of Remix IDE.

Useful Links
------------

- `Remix Desktop <https://remix.live/desktop>`__ - Remix Desktop's download page. 

- `Remix on Github <https://github.com/remix-project-org/remix-project>`__

- `Remix on Substack <https://ethereumremix.substack.com>`__

- `Remix on X <https://x.com/EthereumRemix>`__

- `Remix Discord <https://discord.com/invite/qhpCQGWkmf>`__

- `Remix Alpha <https://alpha.remix.live>`__ - The version where we test new Remix release (not stable!).

- `Solidity Documentation <https://docs.soliditylang.org/en/latest/>`__

- `Ethereum.org's Developer resources <https://ethereum.org/developers/>`__


.. toctree::
   :hidden:
   :maxdepth: 2
   :caption: Introduction

   layout
   desktop
   security
   remix_tutorials_learneth
   locations
   FAQ

.. toctree::
   :hidden:
   :maxdepth: 2
   :caption: Core Modules

   file_explorer
   workspaces
   ai
   git
   search_in_fe
   plugin_manager
   settings
   solidity_editor
   run
   udapp
   run_proxy_contracts
   quickdapp
   deploy_dapp
   mini-app
   account-abstraction-7702
   terminal
   remixd

.. toctree::
   :hidden:
   :maxdepth: 2
   :caption: Solidity modules

   compile
   debugger
   tutorial_debug
   static_analysis

.. toctree::
   :hidden:
   :maxdepth: 2
   :caption: Other Compilers
   
   noir
   circom
   vyper

.. toctree::
   :hidden:
   :maxdepth: 2
   :caption: Unit Testing

   unittesting
   unittestingAsCLI
   assert_library
   unittesting_examples
   testing_using_Chai_&_Mocha

.. toctree::
   :hidden:
   :maxdepth: 2
   :caption: External Tool Integrations

   hardhat
   slither
   foundry

.. toctree::
   :hidden:
   :maxdepth: 2
   :caption: Guides
   
   create_deploy
   subgraph
   import
   contract_verification
   naming-contracts
   running_js_scripts

.. toctree::
   :hidden:
   :maxdepth: 2
   :caption: x402

   x402/x402-Guide
   x402/claude-setup
   x402/compile
   x402/compile-and-deploy
   x402/analyze
   x402/audit
   x402/http

.. toctree::
   :hidden:
   :maxdepth: 2
   :caption: Advanced

   contract_metadata
   remix_commands

.. toctree::
   :hidden:
   :maxdepth: 2
   :caption: Miscellaneous

   plugin_list
   remix_as_code_viewer
   code_contribution_guide
   community
