---
myst:
  html_meta:
    "description": "Call the Remix x402 HTTP endpoints directly with the x402 payment protocol, using @x402/fetch for automatic payment or handling the 402 flow yourself."
    "keywords": "x402 http, x402 fetch, eip-3009, facilitator, cdp facilitator, usdc, base sepolia, ai audit, remix ide"
---

# Using the HTTP Endpoints

Alongside the MCP tools, Remix's compilation, analysis, and AI audit services are available as plain REST endpoints that implement the x402 payment protocol. Use these when you are integrating from your own code rather than through an AI agent. The two audit endpoints are available here only, and have no MCP equivalent.

Payment settlement runs through a facilitator service, which means you pay no gas for the payment: you sign an authorization rather than sending a transaction, and the facilitator pays the fee to settle it on chain. You pay the quoted service fee and nothing more.

## Available endpoints

| Method | Endpoint | Price |
|--------|----------|-------|
| POST | `/compile` | 0.01 USDC |
| POST | `/analyze` | 0.02 USDC |
| POST | `/get_audit_checklist` | 0.05 USDC |
| POST | `/do_audit` | 0.10 USDC |
| GET | `/info` | Free |
| GET | `/health` | Free |

The two audit endpoints run an AI security review of your sources and are covered on the {doc}`AI audit </x402/audit>` page.

The hosted service is at `https://api.remix.live/mcp/x402-http/`, so the compile endpoint is `https://api.remix.live/mcp/x402-http/compile`.

The two free endpoints can be called from here:

```{only} html
<div data-api-console data-method="GET" data-endpoint="https://api.remix.live/mcp/x402-http/health"></div>

<div data-api-console data-method="GET" data-endpoint="https://api.remix.live/mcp/x402-http/info"></div>
```

## Before you start

- 1-5 USDC on the network the server settles on, to pay for calls
- An HTTP client, such as `curl`, Postman, or any HTTP library
- An x402 client library, if you want payment handled for you

```bash
npm install @x402/fetch @x402/evm viem dotenv
```

Put the key for the wallet you are paying from in a `.env` file:

```bash
PRIVATE_KEY=0xYourPrivateKeyHere
```

## How payment works

An x402 request is made twice. The first attempt carries no payment, so the server answers `402 Payment Required` and describes what it wants. The client then signs an EIP-3009 authorization and repeats the request with that signature attached. That authorization is an EIP-712 signature rather than a transaction, so signing it costs no gas. The server verifies the signature with the facilitator, has the facilitator settle it on chain, and only then runs the tool.

![Sequence diagram of the x402 HTTP payment flow](../images/x402/remix-x402.png)

The practical consequence is the cost. Paying for a service on chain yourself means the service fee plus gas. Here you pay the service fee only, and the facilitator covers the gas.

## Paying automatically

The `@x402/fetch` library wraps `fetch` and runs the whole exchange for you. It catches the 402, reads the requirements, signs, and retries:

```javascript
import { wrapFetchWithPayment, x402Client } from "@x402/fetch";
import { ExactEvmScheme } from "@x402/evm/exact/client";
import { privateKeyToAccount } from "viem/accounts";
import dotenv from "dotenv";

dotenv.config();

// Setup wallet
const privateKey = process.env.PRIVATE_KEY;
const evmSigner = privateKeyToAccount(privateKey);

// Create x402 client
const client = new x402Client();
const exactScheme = new ExactEvmScheme(evmSigner);
client.register("eip155:8453", exactScheme); // Base mainnet

// Wrap fetch with payment handling
const x402Fetch = wrapFetchWithPayment(fetch, client);

// Make request - payment happens automatically!
const response = await x402Fetch("https://api.remix.live/mcp/x402-http/compile", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    sources: {
      "SimpleStorage.sol": {
        content: `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {
    uint256 public value;

    function set(uint256 _value) public {
        value = _value;
    }

    function get() public view returns (uint256) {
        return value;
    }
}
        `
      }
    }
  })
});

const result = await response.json();
console.log("Compilation result:", result);
```

The request body is the same as the `compile_solidity` tool takes, and the response is the same shape it returns. See the compiling page in this section for the full reference.

## Paying manually

If you would rather drive the exchange yourself, start with an unpaid request:

```bash
curl -X POST https://api.remix.live/mcp/x402-http/compile \
  -H "Content-Type: application/json" \
  -d '{"sources":{"Test.sol":{"content":"pragma solidity ^0.8.0; contract Test {}"}}}'
```

The server replies `402 Payment Required` with what it accepts. Read the values out of that response rather than hardcoding them, since the asset, amount, network, and recipient all come from the server. Sending that unpaid request costs nothing, so you can see the real answer here:

```{only} html
<div data-api-console data-method="POST" data-expect="402"
     data-endpoint="https://api.remix.live/mcp/x402-http/compile"
     data-body='{"sources":{"Test.sol":{"content":"pragma solidity ^0.8.0; contract Test {}"}}}'></div>
```

Trimmed, it looks like this:

```json
{
  "x402Version": 2,
  "resource": { "url": "https://..." },
  "accepts": [{
    "asset": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    "amount": "10000",
    "network": "eip155:8453",
    "payTo": "0x4CF33cCB14B43D76b4f672C3feDe297d1d763ace",
    "scheme": "exact",
    "maxTimeoutSeconds": 300,
    "extra": { "name": "USD Coin", "version": "2" }
  }]
}
```

Sign an EIP-712 message with your wallet authorizing that USDC transfer, then send the request again with the signature in a `Payment-Signature` header:

```bash
curl -X POST https://api.remix.live/mcp/x402-http/compile \
  -H "Content-Type: application/json" \
  -H "Payment-Signature: <base64-encoded-payment-signature>" \
  -d '{"sources":{"Test.sol":{"content":"pragma solidity ^0.8.0; contract Test {}"}}}'
```

This time the call goes through:

```text
{
  "success": true,
  "contracts": { "Test.sol": { "Test": { "abi": [...], "evm": {...} } } },
  "version": "v0.8.35+commit.47b9dedd"
}
```

## The facilitator

A facilitator is a payment settlement service. It verifies EIP-3009 payment signatures, executes the USDC transfer on chain, pays the gas for that transfer, and confirms the transaction back to the server.

From a client's point of view the facilitator is invisible. You send a payment signature, and the server handles everything else. There is nothing to configure on your side.

### Running your own server

If you are running the server rather than calling the hosted one, it settles through the CDP Facilitator at `https://api.cdp.coinbase.com/platform/v2/x402`, which supports both testnet and mainnet and authenticates with JWT and Ed25519 signing. It also catalogs your service automatically on agentic.market.

Sign up at the [Coinbase Developer Platform](https://portal.cdp.coinbase.com/), create an API key, and set the credentials before starting the server:

```bash
CDP_API_KEY_ID=your_api_key_id
CDP_API_KEY_SECRET=your_api_key_secret
```

The startup log confirms which facilitator is in use:

```text
🔐 Facilitator: CDP - https://api.cdp.coinbase.com/platform/v2/x402
```

## Network details

The hosted service settles on **Base mainnet**, chain ID 8453, in real USDC. Confirm this before you fund a wallet, since it is the value `/info` reports and it is what your client has to register:

```bash
curl https://api.remix.live/mcp/x402-http/info
```

A server you run yourself can settle on Base Sepolia instead, chain ID 84532, which is Base's testnet:

- **USDC contract**: `0x036CbD53842c5426634e7929541eC2318f3dCF7e`
- **RPC**: `https://sepolia.base.org`

Get Base Sepolia ETH from the [Alchemy faucet](https://www.alchemy.com/faucets/base-sepolia), then bridge or use a faucet for Base Sepolia USDC. To look up a settled payment, search the transaction hash on a Base block explorer: `basescan.org` for mainnet, or `sepolia.basescan.org` for testnet.

## Errors

An unfunded wallet is rejected before any work happens:

```json
{
  "error": "Insufficient USDC balance"
}
```

A signature the facilitator cannot verify is rejected the same way:

```json
{
  "error": "Payment verification failed"
}
```

Either way, fix the cause and retry. A payment that settles but hits a broken contract still returns a result. Compilation failures come back with `success: false` and the usual `errors` array:

```json
{
  "success": false,
  "errors": [
    {
      "severity": "error",
      "message": "ParserError: Expected ';' but got 'identifier'"
    }
  ]
}
```

## Security notes

- Your private keys never leave your machine.
- Signatures are gasless. An EIP-712 signature is not a transaction.
- The facilitator pays the gas, not you.
- Payments are verified on chain before the service runs.
- Pricing is the quoted service fee, with nothing added.

The gasless part is the payment. Compilation and analysis involve no other on-chain activity, but the MCP deployment tools do put a contract on chain, and their price includes that deployment gas.

## Further reading

- [HTTP x402 endpoint specifications](https://github.com/remix-project-org/x402/blob/main/HTTP_X402_ENDPOINTS.md)
- [MCP usage guide](https://github.com/remix-project-org/x402/blob/main/MCP_USAGE.md), for using the server with AI agents
- [API reference](https://github.com/remix-project-org/x402/blob/main/API_REFERENCE.md)
- Working examples live in `src/examples/` in the server repository, including `compile-http.js`
