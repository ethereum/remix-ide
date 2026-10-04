---
myst:
  html_meta:
    "description": "Compile and deploy a contract to one or many networks with the Remix x402 MCP Server, including constructor arguments and post-deployment method calls."
    "keywords": "compile_and_deploy, multi-network deployment, x402, mcp, base sepolia, delegated deployment, remix ide"
---

# Compiling and Deploying

Two tools compile a contract and put it on chain in a single call, using the server's delegated deployment service. You do not supply a private key: the server deploys from its own address and reports that address back to you as `deployerAddress`.

- `compile_and_deploy` deploys to one network.
- `compile_and_deploy_multi_network` compiles once and deploys the result to several networks.

## Pricing

Both tools are priced dynamically, because the server pays the gas on your behalf:

| Tool | Price |
|------|-------|
| `compile_and_deploy` | (Gas cost × 1.3) + 0.05 USDC |
| `compile_and_deploy_multi_network` | (Total gas across networks × 1.3) + 0.05 USDC, plus a 10% multi-network buffer |

## Supported networks

Currently on testnet:

- `base-sepolia`: Base Sepolia testnet (primary)
- `sepolia`: Ethereum Sepolia testnet

Both tools accept any network from `viem/chains`. On mainnet launch, networks such as `base`, `mainnet`, `polygon`, `arbitrum`, and `optimism` will be available.

## Deploying to one network

### Input parameters

```typescript
{
  sources: {
    [filename: string]: {
      content: string
    }
  },
  contractName: string,
  contractFile: string,
  network: string,
  constructorArgs?: Array<any>,
  version?: string,
  settings?: {
    optimizer?: {
      enabled: boolean,
      runs: number
    },
    evmVersion?: string
  },
  value?: string,
  postDeploymentCall?: {
    methodName: string,
    methodArgs?: Array<any>,
    value?: string
  }
}
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `sources` | Object | Yes | Map of filename to source code content |
| `contractName` | string | Yes | Name of the contract to deploy |
| `contractFile` | string | Yes | Filename containing the contract |
| `network` | string | Yes | Network to deploy to |
| `constructorArgs` | Array | No | Constructor arguments for the contract |
| `version` | string | No | Solidity compiler version. Defaults to `v0.8.35+commit.47b9dedd` |
| `settings` | Object | No | Compiler settings, the same as `compile_solidity` |
| `value` | string | No | Value in wei to send with the deployment, for payable constructors |
| `postDeploymentCall` | Object | No | A method to call once the contract is deployed |
| `postDeploymentCall.methodName` | string | Yes | Name of the method to call |
| `postDeploymentCall.methodArgs` | Array | No | Arguments for the method call |
| `postDeploymentCall.value` | string | No | Value in wei to send with the method call, for payable methods |

`postDeploymentCall.methodName` is required only when you include a `postDeploymentCall` object at all.

### Output

```typescript
{
  success: boolean,
  compilation?: {
    version: string,
    warnings: Array<any>,
    settings: {
      optimizer: {
        enabled: boolean,
        runs: number
      },
      evmVersion: string
    }
  },
  deployment?: {
    success: boolean,
    contractAddress: string,
    transactionHash: string,
    blockNumber: string,
    gasUsed: string,
    status: string,
    network: string,
    deployedBy: string,
    deployerAddress: string
  },
  abi?: Array<Object>,
  postDeploymentCall?: {
    success: boolean,
    methodName: string,
    methodArgs: Array<any>,
    transactionHash?: string,
    blockNumber?: string,
    gasUsed?: string,
    status?: string,
    error?: string,
    details?: string
  },
  message?: string,
  error?: string,
  details?: string
}
```

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Whether the overall operation succeeded |
| `compilation` | Object | Compilation warnings and settings used |
| `compilation.version` | string | Solidity compiler version used |
| `deployment` | Object | Deployment details and transaction info |
| `deployment.contractAddress` | string | Deployed contract address |
| `deployment.transactionHash` | string | Deployment transaction hash |
| `deployment.blockNumber` | string | Block number of the deployment |
| `deployment.gasUsed` | string | Actual gas used for the deployment |
| `deployment.status` | string | Transaction status |
| `deployment.network` | string | Network deployed to |
| `deployment.deployerAddress` | string | Server Deployer address |
| `abi` | Array | Contract ABI, for interacting with the contract afterwards |
| `postDeploymentCall` | Object | Result of the post-deployment call, if there was one |
| `postDeploymentCall.success` | boolean | Whether the method call succeeded |
| `postDeploymentCall.transactionHash` | string | Method call transaction hash |
| `postDeploymentCall.error` | string | Error if the method call failed |
| `message` | string | Additional message, for example on partial success |
| `error` | string | Error message if the operation failed |
| `details` | string | Stack trace or additional error details |

A deployment can succeed while its post-deployment call fails. When that happens, `message` explains the partial success, so check `postDeploymentCall.success` separately rather than relying on the top-level `success` alone.

### Example

```javascript
const result = await client.callTool({
  name: "compile_and_deploy",
  arguments: {
    sources: {
      "Counter.sol": {
        content: `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Counter {
    uint256 public count;
    address public owner;

    constructor(uint256 _initialCount) {
        count = _initialCount;
        owner = msg.sender;
    }

    function increment() public {
        count += 1;
    }
}
        `
      }
    },
    contractName: "Counter",
    contractFile: "Counter.sol",
    network: "base-sepolia",
    constructorArgs: [42],
    postDeploymentCall: {
      methodName: "increment",
      methodArgs: []
    }
  }
});

const output = JSON.parse(result.content[0].text);
console.log('Contract deployed at:', output.deployment.contractAddress);
console.log('Transaction:', output.deployment.transactionHash);
console.log('View on explorer: https://sepolia.basescan.org/address/' + output.deployment.contractAddress);
```

## Deploying to several networks

`compile_and_deploy_multi_network` takes a `networks` array in place of `network`, compiles the contract once, and deploys that same output to each network in turn. The constructor arguments and compiler settings are shared across all of them.

### Multi-network parameters

```typescript
{
  sources: {
    [filename: string]: {
      content: string
    }
  },
  contractName: string,
  contractFile: string,
  networks: Array<string>,
  constructorArgs?: Array<any>,
  version?: string,
  settings?: {
    optimizer?: {
      enabled: boolean,
      runs: number
    },
    evmVersion?: string
  },
  postDeploymentCall?: {
    methodName: string,
    methodArgs?: Array<any>
  }
}
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `sources` | Object | Yes | Map of filename to source code content |
| `contractName` | string | Yes | Name of the contract to deploy |
| `contractFile` | string | Yes | Filename containing the contract |
| `networks` | Array&lt;string&gt; | Yes | Networks to deploy to |
| `constructorArgs` | Array | No | Constructor arguments, the same for every network |
| `version` | string | No | Solidity compiler version. Defaults to `v0.8.35+commit.47b9dedd` |
| `settings` | Object | No | Compiler settings, the same as `compile_solidity` |
| `postDeploymentCall` | Object | No | Method to call after each deployment |

### Multi-network output

```typescript
{
  success: boolean,
  compilation?: {
    version: string,
    warnings: Array<any>
  },
  deployments: Array<{
    network: string,
    success: boolean,
    contractAddress?: string,
    transactionHash?: string,
    blockNumber?: string,
    gasUsed?: string,
    status?: string,
    deployedBy?: string,
    deployerAddress?: string,
    postDeploymentCall?: {
      success: boolean,
      methodName: string,
      transactionHash?: string,
      blockNumber?: string,
      gasUsed?: string,
      status?: string,
      error?: string
    },
    error?: string
  }>,
  abi?: Array<Object>,
  summary?: {
    total: number,
    successful: number,
    failed: number
  },
  error?: string,
  details?: string
}
```

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Whether every deployment succeeded |
| `compilation` | Object | Compilation warnings, from the single compilation |
| `compilation.version` | string | Solidity compiler version used |
| `deployments` | Array | One result per network |
| `deployments[].network` | string | Network name |
| `deployments[].success` | boolean | Whether this network's deployment succeeded |
| `deployments[].contractAddress` | string | Deployed contract address on this network |
| `deployments[].transactionHash` | string | Deployment transaction hash |
| `deployments[].blockNumber` | string | Block number |
| `deployments[].gasUsed` | string | Gas used for this deployment |
| `deployments[].postDeploymentCall` | Object | Post-deployment call result |
| `deployments[].error` | string | Error if this deployment failed |
| `abi` | Array | Contract ABI, the same for every network |
| `summary` | Object | Summary statistics |
| `summary.total` | number | Total networks attempted |
| `summary.successful` | number | Number of successful deployments |
| `summary.failed` | number | Number of failed deployments |
| `error` | string | Overall error if the entire operation failed |

Deployments are reported per network, so a failure on one network does not undo the others. Read `summary` for the counts, then walk `deployments` for the detail.

### Multi-network example

```javascript
const result = await client.callTool({
  name: "compile_and_deploy_multi_network",
  arguments: {
    sources: {
      "NFT.sol": {
        content: `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleNFT {
    string public name;
    string public symbol;
    uint256 public totalSupply;

    constructor(string memory _name, string memory _symbol) {
        name = _name;
        symbol = _symbol;
    }

    function mint(address to, uint256 tokenId) public {
        totalSupply += 1;
    }
}
        `
      }
    },
    contractName: "SimpleNFT",
    contractFile: "NFT.sol",
    networks: ["base-sepolia", "sepolia"],
    constructorArgs: ["MyNFT", "MNFT"],
    postDeploymentCall: {
      methodName: "mint",
      methodArgs: ["0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1", 1]
    }
  }
});

const output = JSON.parse(result.content[0].text);

console.log('Summary:', output.summary);

// Check results for each network
output.deployments.forEach(deployment => {
  if (deployment.success) {
    console.log(`${deployment.network}: ${deployment.contractAddress}`);
    console.log(`  Transaction: ${deployment.transactionHash}`);
  } else {
    console.log(`${deployment.network}: Failed - ${deployment.error}`);
  }
});
```

## Errors

A deployment that reverts on chain returns the transaction hash alongside the error, so you can look the transaction up on a block explorer:

```json
{
  "success": false,
  "error": "Contract deployment failed: execution reverted",
  "transactionHash": "0x..."
}
```

An unrecognized network name is rejected before anything is deployed:

```json
{
  "error": "Network not supported: ethereum-mainnet. Supported networks: base-sepolia, sepolia"
}
```

Test a post-deployment call on a single network before running the same deployment across several, since a mistake there is paid for once per network.
