Welcome to Remix's documentation!
=====================================

**Remix IDE** is used for the entire journey of smart contract development by users at every knowledge level. 
It requires no setup, fosters a fast development cycle and has a rich set of plugins with intuitive GUIs.  
The IDE comes in 2 flavors (web app or desktop app) and as a VSCode extension.

**Remix Online IDE**, see: `https://remix.ethereum.org <https://remix.ethereum.org>`__

Supported browsers: Firefox, Chrome, Brave. We do not support Remix's use on tablets or mobile devices.

**Remix Desktop IDE**, see releases: `https://github.com/ethereum/remix-desktop/releases <https://github.com/ethereum/remix-desktop/releases>`__

**Ethereum-Remix** a VSCode extension, see `here <https://marketplace.visualstudio.com/items?itemName=RemixProject.ethereum-remix>`__.  
The documentation for the VSCode extension is located `here <https://github.com/ethereum/remix-vscode#ethereum-remix-project-extension-for-visual-studio-code>`__.

Remix Project
~~~~~~~~~~~~~
Remix IDE is part of the `Remix Project <https://github.com/ethereum/remix-project>`__ which also includes the
`Remix Plugin Engine <https://github.com/ethereum/remix-plugin>`__ and `Remix Libraries <https://github.com/ethereum/remix-project/tree/master/libs#remix-libraries>`__: low-level tools for wider use.

Remix-IDE is available
at `remix.ethereum.org <https://remix.ethereum.org>`__ and more information can be found in these
docs.  Our IDE tool is available at `our GitHub repository
<https://github.com/ethereum/remix-project>`__.

This set of documents covers instructions on how to use Remix.  
Additional information can be found in our `blog <https://medium.com/remix-ide>`__ and in our tutorial tool, `LearnEth <https://remix-alpha.ethereum.org/?#activate=solidity,solidityUnitTesting,LearnEth&call=LearnEth//startTutorial//ethereum/remix-workshops//master//solidityintroduction&deactivate=home&minimizeterminal=true->`__ located inside of Remix IDE.

Useful links:

- `Solidity documentation <https://solidity.readthedocs.io>`__

- `Remix alpha <https://remix-alpha.ethereum.org>`__ - The version where we test new Remix release (not stable!).

- `Remix Desktop <https://github.com/ethereum/remix-desktop/releases>`__ - Remix Desktop's release page. 

- `Remix on Github <https://github.com/ethereum/remix-project>`__

- `Remix on Medium <https://medium.com/remix-ide>`__

- `Remix on Twitter <https://twitter.com/EthereumRemix>`__

- `Our Gitter support channel <https://gitter.im/ethereum/remix>`__

- `Ethereum.org's Developer resources <https://ethereum.org/en/developers/>`__


.. toctree::
   :maxdepth: 2
   :caption: New Layout Intro

   layout

.. toctree::
   :maxdepth: 2
   :caption: Tour of default modules

   file_explorer
   plugin_manager
   settings
   solidity_editor
   terminal

.. toctree::
   :maxdepth: 2
   :caption: Tour of typical solidity modules

   compile
   run
   udapp
   debugger
   static_analysis

.. toctree::
   :maxdepth: 2
   :caption: Solidity Unit Testing

   unittesting
   unittestingAsCLI
   assert_library
   unittesting_examples

.. toctree::
   :maxdepth: 2
   :caption: Native External Integrations

   hardhat
   truffle
   slither
   hardhat_console

.. toctree::
   :maxdepth: 2
   :caption: Using Remix
   
   contract_metadata
   create_deploy
   tutorial_debug
   import
   plugin_list
   remix_commands
   running_js_scripts
   testing_using_Chai_&_Mocha
   FAS
   remixd
   FAQ

.. toctree::
   :maxdepth: 2
   :caption: Miscellaneous

   locations
   remix_tutorials_learneth
   code_contribution_guide
   community
