Foundry
============

_(Supported since Remix IDE v0.25.0)_

Foundry Provider
------------------

 **Foundry Provider** is a plugin on Remix IDE which enables users to deploy the contract to the Foundry's built-in **Anvil** blockchain. `Foundry Provider` can be chosen from the list of environments in `Deploy & Run Transactions` plugin.

![](images/a-foundry-provider.png)

As soon as you select `Foundry Provider`, a modal is opened asking for the `Anvil JSON-RPC Endpoint`.

![](images/a-foundry-provider-modal.png)

If Foundry Anvil node is running with default options, the default endpoint value in modal will not need any change. In case, Anvil node host and port are different, JSON-RPC endpoint should be updated in the modal text box.

Once the correct endpoint is filled in the modal, just click on `OK` and the accounts from the Anvil node will be loaded in the `ACCOUNT` section. Network id will also be shown.

![](images/a-foundry-provider-connected.png)

Now, one can start deploying the contract from Remix IDE to the local Anvil node as usual.

Foundry Remappings
------------------

Foundry manages dependencies using git submodules and can remap dependencies to make them easier to import. So import defined by remappings can show issue in normal compilation on Remix IDE.

To support such compilation, Remix suggests to run compilation using compiler config file. Remix adds some default forge remappings in the compiler config file when a Foundry project is loaded in Remix IDE using remixd.

![](images/a-foundry-cc.png)

Further, more remappings can be added manually, if required.






