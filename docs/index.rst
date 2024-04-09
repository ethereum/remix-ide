Welcome to Remix's documentation!
=====================================

**Remix IDE** is used for the entire journey of smart contract development by users at every knowledge level. 
It requires no setup, fosters a fast development cycle, and has a rich set of plugins with intuitive GUIs.  
The IDE comes in two flavors (web app or desktop app).

**Remix Online IDE**, see: `https://remix.ethereum.org <https://remix.ethereum.org>`__

**Supported browsers:** Firefox, Chrome, Brave. We do not support use of Remix on tablets or mobile devices.

**Translations of the Remix Documentation**: currently available in `English <https://remix-ide.readthedocs.io/en/latest/>`__, `Simplified Chinese <https://remix-ide.readthedocs.io/zh_CN/latest/>`__, `Spanish <https://remix-ide.readthedocs.io/es/latest/>`__, `Italian <https://remix-ide.readthedocs.io/it/latest/>`__, and `French <https://remix-ide.readthedocs.io/fr/latest/>`__.  More languages are on the way.

Remix Project
~~~~~~~~~~~~~
Remix IDE is part of the `Remix Project <https://github.com/ethereum/remix-project>`__ which also includes the
`Remix Plugin Engine <https://github.com/ethereum/remix-plugin>`__ and `Remix Libraries <https://github.com/ethereum/remix-project/tree/master/libs#remix-libraries>`__, which are low-level tools for wider use.

Remix IDE is located at `remix.ethereum.org <https://remix.ethereum.org>`__ and more information can be found in these docs. The IDE's repo is at `GitHub <https://github.com/ethereum/remix-project>`__.

This set of documents covers instructions on how to use Remix.  
Additional information can be found in our `blog <https://medium.com/remix-ide>`__ and in our tutorial tool, `LearnEth <https://remix-alpha.ethereum.org/?#activate=solidity,solidityUnitTesting,LearnEth&call=LearnEth//startTutorial//ethereum/remix-workshops//master//solidityintroduction&deactivate=home&minimizeterminal=true->`__ located inside of Remix IDE.

Useful links:

- `Solidity Documentation <https://solidity.readthedocs.io>`__

- `Remix Alpha <https://remix-alpha.ethereum.org>`__ - The version where we test new Remix release (not stable!).

- `Remix Desktop <https://github.com/ethereum/remix-desktop/releases>`__ - Remix Desktop's release page. 

- `Remix on Github <https://github.com/ethereum/remix-project>`__

- `Remix on Medium <https://medium.com/remix-ide>`__

- `Remix on Twitter <https://twitter.com/EthereumRemix>`__

- `Our Discord support channel <https://discord.gg/ZZSGegD7jm>`__

- `Ethereum.org's Developer resources <https://ethereum.org/en/developers/>`__


.. toctree::
   :maxdepth: 2
   :caption: Introduction

   layout
   security
   remix_tutorials_learneth
   locations
   FAQ

.. toctree::
   :maxdepth: 2
   :caption: Core Modules

   file_explorer
   search_in_fe
   plugin_manager
   settings
   solidity_editor
   run
   udapp
   run_proxy_contracts
   terminal
   remixd

.. toctree::
   :maxdepth: 2
   :caption: Solidity modules

   compile
   ai
   debugger
   static_analysis

.. toctree::
   :maxdepth: 2
   :caption: Unit Testing

   unittesting
   unittestingAsCLI
   assert_library
   unittesting_examples
   testing_using_Chai_&_Mocha

.. toctree::
   :maxdepth: 2
   :caption: External Tool Integrations

   hardhat
   truffle
   slither
   foundry

.. toctree::
   :maxdepth: 2
   :caption: Guides
   
   create_deploy
   tutorial_debug
   import
   contract_verification
   running_js_scripts
   FAS

.. toctree::
   :maxdepth: 2
   :caption: Advanced

   contract_metadata
   remix_commands

.. toctree::
   :maxdepth: 2
   :caption: Miscellaneous

   plugin_list
   vyper
   remix_as_code_viewer
   code_contribution_guide
   community
