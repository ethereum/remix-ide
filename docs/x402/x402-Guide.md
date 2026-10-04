---
myst:
  html_meta:
    "description": "Overview of the Remix x402 MCP Server, which exposes Remix's Solidity compiler, Slither analysis, contract deployment, and AI security auditing as pay-per-call services priced in USDC."
    "keywords": "x402, mcp server, remix ide, usdc, base, x402 bazaar, agent payments, ai audit"
---

# The Remix x402 MCP Server

The Remix x402 MCP Server exposes Remix's Solidity compiler, Slither analysis, contract deployment, and AI security auditing as services that are paid for per call in USDC. It is aimed at AI agents, and at anything else that can pay per call over MCP or plain HTTP.

The server is indexed on the [x402 Bazaar](https://agentic.market/services/api-remix-live) with full metadata, so agents can discover the tools rather than being configured with them.

There are two ways to use Remix x402. The first is through any MCP client that can make payments: you describe what you want in plain language, and the client makes the call and pays for it from a wallet. {doc}`Setting up Claude </x402/claude-setup>` walks through Claude Desktop and Claude Code, though nothing here is specific to them. The second is to call the {doc}`HTTP endpoints </x402/http>` from your own code.

## Available tools

| Tool                               | What it does                                                      | Price                                            |
| ---------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------ |
| `compile_solidity`                 | Compiles Solidity sources and returns ABI, bytecode, and metadata | 0.01 USDC                                        |
| `analyze_with_slither`             | Runs Slither static security analysis                             | 0.02 USDC                                        |
| `compile_and_deploy`               | Compiles and deploys to one network                               | (Gas cost × 1.3) + 0.05 USDC                     |
| `compile_and_deploy_multi_network` | Compiles once, deploys to several networks                        | (Total gas × 1.3) + 0.05 USDC, plus a 10% buffer |

Two further services, `get_audit_checklist` and `do_audit`, run an AI security audit. They are available over HTTP only, and are covered on the {doc}`AI audit </x402/audit>` page.

Each tool has its own page in this section, with full parameter and response reference.

## HTTP endpoints

Compilation, analysis, and the AI audit services are also reachable as REST endpoints, under `https://api.remix.live/mcp/x402-http/`:

| Method | Endpoint                | Price     |
| ------ | ----------------------- | --------- |
| POST   | `/compile`              | 0.01 USDC |
| POST   | `/analyze`              | 0.02 USDC |
| POST   | `/get_audit_checklist`  | 0.05 USDC |
| POST   | `/do_audit`             | 0.10 USDC |
| GET    | `/info`                 | Free      |
| GET    | `/health`               | Free      |

The split runs both ways: the deployment tools are MCP-only, and the two audit endpoints are HTTP-only. `/info` reports the server's name, version, endpoints and prices, and the network it settles on, which makes it a quick way to confirm what you are talking to:

```bash
curl https://api.remix.live/mcp/x402-http/info
```

```{only} html
Or call it from here:

<div data-api-console data-method="GET" data-endpoint="https://api.remix.live/mcp/x402-http/info"></div>
```

## Network

The hosted service settles on **Base mainnet**, chain ID 8453. Every call therefore spends real USDC, starting at 0.01 for a compile, so treat the prices on this page as money rather than credits.

To work against a testnet instead, you have to run the server yourself on Base Sepolia, chain ID 84532. The {doc}`HTTP endpoints </x402/http>` page covers that. Either way, `/info` reports the network a given server is on.

## Paying for calls

Compilation and analysis are fixed price. The deployment tools are priced dynamically, because the server pays the deployment gas for you: the quote is that gas cost with a multiplier applied, plus a flat fee.

The x402 payment itself is gasless. You sign an authorization rather than sending a transaction, and a facilitator service settles it on chain and pays that transaction's gas. This covers the payment only. The gas to actually deploy a contract is real, and is what the deployment tools price in.

If your balance does not cover a call, it is rejected before any work is done:

```json
{
  "error": "Insufficient USDC balance. Required: 0.01 USDC, Available: 0.005 USDC"
}
```

## Best practices

1. Test compilation before you deploy.
2. Run a Slither analysis before deploying, to catch security issues early, and an AI audit when you want a written review alongside it.
3. Start with small contracts, to get a feel for the costs.
4. Use the optimizer for production deployments, to reduce gas costs.
5. Check constructor arguments carefully before deploying.
6. Check the network carefully, since testnet tokens have no real value.
7. Save your deployment addresses. You need them to interact with the contracts afterwards.
8. Test post-deployment calls on a single network before deploying to several.

## Support

- [The x402 server repository](https://github.com/remix-project-org/x402) for issues, questions, and feature requests
- [HTTP x402 endpoints](https://github.com/remix-project-org/x402/blob/main/HTTP_X402_ENDPOINTS.md) for direct API usage
- [MCP usage guide](https://github.com/remix-project-org/x402/blob/main/MCP_USAGE.md) for using the server programmatically
- [x402 protocol documentation](https://docs.x402.org/introduction) for the protocol itself
- [agentic.market](https://agentic.market) to discover and validate x402 services
