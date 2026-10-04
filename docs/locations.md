---
myst:
  html_meta:
    "description": "Find Remix IDE URLs, deep links, and URL parameters for loading workspaces, files, and plugins directly."
    "keywords": "remix ide url, remix links, remix parameters, remix ethereum org"
---

# Remix URLs & Links with Parameters

## Main Remix URLs

- Remix IDE Online is located at [https://app.remix.live](https://app.remix.live).

- The alpha version of Remix is located at [https://alpha.remix.live](https://alpha.remix.live). This is not a stable version.

- GitHub repository: [https://github.com/remix-project-org](https://github.com/remix-project-org). The README contains instructions for running Remix-IDE locally.

- Remix Desktop is an Electron App. Here is the [download page](https://remix.live/desktop).

- The Remix X account is [EthereumRemix](https://x.com/EthereumRemix).

- The Remix Project Blog for release notes and articles is: [https://ethereumremix.substack.com](https://ethereumremix.substack.com).

- Remix blog used to be: [https://medium.com/remix-ide](https://medium.com/remix-ide). Older release notes are here.

- The [Remix Project](https://remix.live) is our info site about the tool and the project.

Remix is an open source project. Other projects have forked our codebase. The forked versions of Remix sites will look like Remix but are not Remix. So be careful! Forked sites are not maintained by us nor endorsed by us.

## Remix with URL parameters

Using Remix with URL parameters will load the tool in the following ways:

Remix URL parameters follow these conventions:

- **`?#param=value`**: a query string (`?`) immediately followed by a hash fragment (`#`). `value` can be a plugin name, a comma-separated list of plugin names, a boolean (`true`/`false`), a theme name, a base64-encoded string, or a compiler version string. Used to activate or deactivate plugins, set a theme, minimize panels, load a base64-encoded file, and set a specific compiler build version.
- **`#param=value`**: a hash fragment only, with no preceding query string. `value` can be a URL, an Ethereum address, a boolean, or a language name. Used to load a file via URL, load a verified contract from Etherscan, enable auto-compile, select the compiler language, and load a custom compiler from a URL.
- **`?param=value`**: a plain query string with no hash fragment. `value` is a Gist ID. Used to load a GitHub Gist into the File Explorer.
- **`//`**: a double slash delimiter used within `call` and `calls` values to separate a plugin's name, function, and arguments (e.g. `fileManager//open//contracts/3_Ballot.sol`).
- **`///`**: a triple slash delimiter used within `calls` to separate multiple plugin API calls from one another.

### Plugin management

#### Activate a list of plugins

The following example contains the URL parameter **activate** followed by **a comma separated list of plugins**.

```text
https://app.remix.live/?#activate=LearnEth,noir-compiler
```

**The last plugin in the list will gain the focus.**

When you use the activate list, all other plugins that a user had loaded will be deactivated. This does not apply to the File Explorer, Solidity Compiler, Deploy & Run, the Plugin Manager, and the Settings modules.

```{note}
In a Remix URL parameter, a plugin is referred to by its **name** as specified in its profile in the [Remix Plugins Directory repository](https://github.com/remix-project-org/remix-plugins-directory). To quickly get a plugin's name go to {doc}`Plugin List page <plugin_list>` of the docs and search for the plugin you want. There will be a link with the urls to activate the plugin.

```

To deactivate a list of plugins:

```text
https://app.remix.live/?#deactivate=debugger
```

#### Pass commands to a plugin's API via a URL param

The URL parameter to issue a command is `call`. Following the `call` is a // (double slash) separated list of arguments.

```text
call=plugin_name//function//parameter1//parameter2
```

The URL below uses `activate` & `call`. It **activates** a number of plugins and **calls** the File Explorer to tell it to load one of the default Remix files:

```text
https://app.remix.live/?#activate=defiexplorer,solidity&call=fileManager//open//contracts/3_Ballot.sol
```

To load a specific tutorial in the LearnEth plugin:

```text
https://app.remix.live/?#activate=solidityUnitTesting,solidity,LearnEth&call=LearnEth//startTutorial//ethereum/remix-workshops//master//proxycontract
```

#### Make calls to a number of different plugins' APIs

Use `calls` instead of `call` when you need to issue commands to multiple plugins in sequence. Where `call` targets a single plugin, `calls` chains multiple commands together, each separated by `///`.

For example, the URL below activates a list of plugins, then calls the LearnEth plugin's API and the File Explorer's API in sequence:

```text
https://app.remix.live/?#activate=solidityUnitTesting,solidity,LearnEth&calls=LearnEth//startTutorial//ethereum/remix-workshops//master//proxycontract///fileManager//open//contracts/3_Ballot.sol
```

### Loading content

#### Load a file via a URL param into the Editor

The `url` parameter takes a URL, loads it into the Editor and saves it in a Workspace called **code-sample**:

```text
https://app.remix.live/#url=https://github.com/remix-project-org/remix-project/blob/master/apps/remix-ide/contracts/app/solidity/mode.sol
```

```{important}
The **code-sample** workspaces are ephemeral and will not be persisted on a reload. To save a loaded **code-sample** workspace, rename the workspace.
```

#### Load a Solidity file in the Editor via an encoded base64 string

The `code` parameter takes a base64-encoded string of Solidity source code and loads it into the Editor as a `.sol` file, saving it in a Workspace called **code-sample**. To generate the base64 string, use `btoa()` in the browser console or any online base64 encoder.

```text
https://app.remix.live/?#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVAoKcHJhZ21hIHNvbGlkaXR5IDAuOC40OwoKLyoqCiAqIEB0aXRsZSBXb25kZXJmdWxDb2RlCiAqIEBkZXYgV2VsY29tZSB0byBSZW1peAogKi8KY29udHJhY3QgWW91IHsKCiAgICBhZGRyZXNzIHByaXZhdGUgb3duZXI7CiAgICAKICAgIC8qKgogICAgICogQGRldiBTZXQgY29udHJhY3QgZGVwbG95ZXIgYXMgeW91QW5kWW91cldvbmRlcmZ1bFNlbGYKICAgICAqLwogICAgY29uc3RydWN0b3IoKSB7CiAgICAgICAgeW91QW5kWW91cldvbmRlcmZ1bFNlbGYgPSBtc2cuc2VuZGVyOwoKICAgIH0KCiAgICAvKioKICAgICAqIEBkZXYgQ2hhbmdlIG1vb2QKICAgICAqIEBwYXJhbSBuZXdPd25lciBhZGRyZXNzIG9mIG5ldyBvd25lcgogICAgICovCiAgICBmdW5jdGlvbiBjaGFuZ2VNb29kKGFkZHJlc3MgbmV3TW9vZEFkZHIpIHB1YmxpYyB7CiAgICAgICAgb3duZXJNb29kID0gbmV3TW9vZEFkZHI7CiAgICB9Cn0=
```

#### Load contracts from Etherscan via address

The `address` parameter takes an address and loads the **verified contract** found for the address on Ethereum mainnet and saves it into the `etherscan-code-sample` workspace of the File Explorer:

```text
https://app.remix.live/#address=0xdac17f958d2ee523a2206206994597c13d831ec7
```

#### Load a Solidity contract from GitHub

With a GitHub URL of a Solidity contract like this one:

```text
https://github.com/remix-project-org/remix-project/blob/master/apps/remix-ide/contracts/app/solidity/mode.sol
```

Then delete the **GitHub** part and type `app.remix.live` in its place, like this:

```text
https://app.remix.live/ethereum/remix-project/blob/master/apps/remix-ide/contracts/app/solidity/mode.sol
```

Remix will fetch the Solidity file and open it up in the File Explorer in a Workspace named **code-sample**.

#### Load a GIST

The `gist` parameter fetches all files from a GitHub Gist and saves them into a workspace named `gist-<gist-id>` in the File Explorer.

```text
https://app.remix.live/?gist=0fe90e825327ef313c88aedfe66ec142
```

To also have the GIST visible in the Editor, use both `gist` & `call`:

```text
https://app.remix.live/?#activate=solidity,fileManager&gist=0fe90e825327ef313c88aedfe66ec142&call=fileManager//open//gist-0fe90e825327ef313c88aedfe66ec142/gridMix4.sol
```

To load the GIST, have it visible in the Editor, and activate a list of plugins:

```text
https://app.remix.live/?#activate=solidity,LearnEth&gist=0fe90e825327ef313c88aedfe66ec142&call=fileManager//open//gist-0fe90e825327ef313c88aedfe66ec142/gridMix4.sol
```

### Compiler settings

#### Load a specific version of the Solidity Compiler

The `version` parameter pins the compiler to a specific build, which is useful for reproducibility or working with contracts that require a particular version. The version string follows the format `soljson-v<version>+commit.<hash>`, where both the version number and commit hash are required.

```text
https://app.remix.live/?#version=soljson-v0.6.6+commit.6c089d02
```

```{note}
You need to specify both the Solidity version and the commit.
```

To load a custom compiler from a URL instead:

```text
https://app.remix.live/#version=https://solidity-blog.s3.eu-central-1.amazonaws.com/data/08preview/soljson.js
```

To enable autoCompile:

```text
https://app.remix.live/#autoCompile=true
```

#### Select the language for the Solidity Compiler

The `language` parameter sets the compiler language. Valid values are `Solidity` (the default) and `Yul`. Yul is an intermediate language used for low-level EVM programming and compiler development.

```text
https://app.remix.live/#language=Yul
```

### UI / Appearance

#### Minimize Remix panels

The following URL will **close everything except the Main Panel & the icon panel** (the side and terminal are minimized).

```text
https://app.remix.live/?#embed=true
```

To minimize just the Side Panel, use this URL:

```text
https://app.remix.live/?#minimizesidepanel=true
```

To minimize just the terminal, use this URL:

```text
https://app.remix.live/?#minimizeterminal=true
```

#### Specify a theme

The `theme` parameter accepts `Dark` or `Light`. To link to Remix with a theme specified, use this URL:

```text
https://app.remix.live/?#theme=Dark
```

### Combine multiple parameters

Multiple parameters can be combined in a single URL by chaining them with `&`. The example below uses the following parameters:

- `activate=solidity,solidityUnitTesting,LearnEth` — activates three plugins; LearnEth gains the Side Panel focus as the last in the list
- `theme=Light` — sets the Light theme
- `minimizeterminal=true` — minimizes the terminal panel
- `optimize=false` — disables compiler optimization
- `evmVersion=null` — uses the default EVM version
- `version=soljson-v0.6.6+commit.6c089d02.js` — loads a specific compiler version

```text
https://app.remix.live/?#activate=solidity,solidityUnitTesting,LearnEth&theme=Light&minimizeterminal=true&optimize=false&evmVersion=null&version=soljson-v0.6.6+commit.6c089d02.js
```
