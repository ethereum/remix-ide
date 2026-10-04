---
myst:
  html_meta:
    "description": "Set up the Coinbase agentic wallet in Claude Desktop or Claude Code, then compile and analyze Solidity contracts with Remix's x402 services, paying per call in USDC."
    "keywords": "coinbase agentic wallet, payments mcp, claude desktop, claude code, x402, usdc, base, remix ide"
---

# Using x402 Services with Claude

Claude Desktop and Claude Code can call Remix's x402 services directly, once they have a wallet to pay with. You describe the contract you want in the chat, and Claude finds the service, pays for the call, and returns the result.

This page uses Claude as the worked example, but the services are not tied to it. Any MCP client that can make x402 payments reaches them the same way, and the wallet installer below supports other MCP clients too.

## The wallet

Payment goes through the **Coinbase agentic wallet**, provided by the `@coinbase/payments-mcp` server. It is a Model Context Protocol server that lets an AI agent pay for x402 services in USDC on Base, manage a wallet in natural language, and browse the x402 Bazaar.

Because Coinbase custodies the keys, there is no private key for you to manage. You sign in with a one-time passcode sent to your email, and the x402 payments themselves are gasless: a facilitator settles each one on chain and covers that transaction's gas. Spending limits, KYT screening, and OFAC compliance are built in.

### Before you start

- Claude Desktop, or the Claude Code CLI
- Node.js 18 or later
- An email address, for authentication
- USDC on Base, to pay for calls

## Setting up Claude Desktop

### Automatic installation

Run the interactive installer and choose **Claude Desktop** from the list of MCP clients. It configures your Claude Desktop settings for you.

```bash
npx @coinbase/payments-mcp
```

Then quit Claude Desktop completely and restart it.

### Manual configuration

If the installer fails, open your Claude Desktop configuration file and add the server:

```json
{
  "mcpServers": {
    "payments": {
      "command": "npx",
      "args": [
        "-y",
        "@coinbase/payments-mcp"
      ],
      "env": {
        "NETWORK": "base"
      }
    }
  }
}
```

`NETWORK` takes either `base` for Base mainnet, or `base-sepolia` for the Base Sepolia testnet. It has to match the network the service you are calling settles on: the hosted Remix service is on Base mainnet, so leave this as `base` unless you are pointing at a server of your own running on testnet.

Quit Claude Desktop completely and restart it, and the server initializes on its own.

### Verifying the installation

```bash
npx @coinbase/payments-mcp status
```

To reinstall, run `npx @coinbase/payments-mcp install --force`. To remove it, run `npx @coinbase/payments-mcp uninstall`.

## Setting up Claude Code

The quickest route installs the server and writes the configuration in one step:

```bash
npx @coinbase/payments-mcp --client claude-code --auto-config
```

To keep control of the configuration, install without it and register the server yourself:

```bash
npx @coinbase/payments-mcp --client claude-code --no-auto-config
claude mcp add --transport stdio payments-mcp -- node /Users/YOUR_USERNAME/.payments-mcp/bundle.js
```

Replace `YOUR_USERNAME` with your own home directory. The same registration can be done as JSON:

```bash
claude mcp add-json payments-mcp '{"type":"stdio","command":"node","args":["/Users/YOUR_USERNAME/.payments-mcp/bundle.js"]}'
```

Quit Claude Code completely, restart it, then confirm the server is registered and healthy:

```bash
claude mcp list
```

`payments-mcp` should appear in the list with its health status.

## Signing in

The first time you use the wallet, ask for it in the chat:

```text
show me my wallet
```

If you are not authenticated, the wallet interface opens automatically. Enter your email address, then the six-digit code that arrives in your inbox. Your wallet is created on first sign-in.

To confirm it worked:

```text
show me my wallet balance
```

Sessions stay active across Claude sessions. When one expires you are prompted to sign in again, and you can sign out at any time through the wallet interface.

## Using the services

Claude discovers the Remix services through the Bazaar, so you can ask for what you want in plain language rather than naming an endpoint.

```{note}
Compilation, Slither analysis, and the deployment tools are MCP tools, so Claude can call them directly. The {doc}`AI audit services </x402/audit>` are not MCP tools. They are published to the Bazaar with their input schemas, so Claude can still find them and describe them, but running one means a paid HTTP request rather than a tool call.
```

### Compiling a contract

Compilation costs 0.01 USDC per call.

```text
compile a simple storage contract using remix.live bazaar services
```

Claude finds the compile endpoint, writes the contract, pays the 0.01 USDC, and returns the bytecode and ABI. You can describe the contract you want in as much detail as you like:

```text
compile an ERC20 token contract with the following features:
- Name: MyToken
- Symbol: MTK
- Initial supply: 1,000,000
- Mintable by owner
- Burnable
```

Or paste your own:

````text
compile this contract using remix.live:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    mapping(address => bool) public hasVoted;
    mapping(uint256 => uint256) public votes;

    function vote(uint256 proposalId) public {
        require(!hasVoted[msg.sender], "Already voted");
        hasVoted[msg.sender] = true;
        votes[proposalId]++;
    }
}
```
````

The response carries `success`, the compiled `contracts` (each with an `abi` and `evm.bytecode.object`), the compiler `version`, and any `errors`. See the compiling page in this section for the full response reference.

### Analyzing a contract

Analysis costs 0.02 USDC per call. Slither is a static analysis tool that finds vulnerabilities and code quality problems without running the contract.

````text
analyze this contract for security vulnerabilities using remix.live bazaar service:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VulnerableBank {
    mapping(address => uint256) public balances;

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw() public {
        uint256 amount = balances[msg.sender];
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        balances[msg.sender] = 0;  // Reentrancy vulnerability!
    }
}
```
````

Claude sends the contract to the analyze endpoint, pays the 0.02 USDC, and explains what Slither found. In this case that is the reentrancy, since the balance is zeroed only after the external call returns.

### Example workflows

Chaining the services in one request works well:

```text
1. compile a simple ERC20 token using remix.live
2. analyze it for security issues
3. if it's safe, show me the deployment bytecode
```

```text
I have this contract [paste contract code].
Please:
1. compile it using remix.live
2. run security analysis
3. summarize the vulnerabilities found
4. suggest fixes
```

## Managing your wallet

Ask for your balance:

```text
what's my USDC balance?
```

```text
Your wallet balance on Base:
- USDC: 10.00 USDC
- ETH: 0.005 ETH
```

Ask for your address:

```text
what's my wallet address?
```

```text
Your wallet addresses:
- Base (EVM): 0x1234567890abcdef1234567890abcdef12345678
- Solana: AbC123...xyz
```

To add funds, send USDC on Base to that address, then ask Claude to check your balance again to confirm it arrived. The wallet also enforces spending limits, configured on the Coinbase side, which guard against unauthorized large transactions.

## Getting help

- [Coinbase agentic wallet documentation](https://docs.cdp.coinbase.com/agentic-wallet/welcome) for wallet-specific issues
- [x402 protocol documentation](https://docs.x402.org/introduction) for the protocol itself
- [The x402 server repository](https://github.com/remix-project-org/x402) for the Remix services themselves
