---
myst:
  html_meta:
    "description": "Compile Solidity contracts with the Remix x402 MCP Server's compile_solidity tool, including compiler version, optimizer, and EVM version settings."
    "keywords": "compile_solidity, x402, mcp, solidity compiler, optimizer, evm version, remix ide"
---

# Compiling Solidity

The `compile_solidity` tool compiles one or more Solidity source files with the Remix compiler. It returns the ABI, bytecode, method identifiers, gas estimates, and metadata for every contract it finds.

**Price:** 0.01 USDC per call.

## Input parameters

```typescript
{
  sources: {
    [filename: string]: {
      content: string
    }
  },
  version?: string,
  settings?: {
    optimizer?: {
      enabled: boolean,
      runs: number
    },
    evmVersion?: string
  }
}
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `sources` | Object | Yes | Map of filename to source code content |
| `sources[filename].content` | string | Yes | Solidity source code |
| `version` | string | No | Solidity compiler version, for example `v0.8.20+commit.a1b79de6`. Defaults to `v0.8.35+commit.47b9dedd` |
| `settings` | Object | No | Compiler settings |
| `settings.optimizer` | Object | No | Optimizer configuration |
| `settings.optimizer.enabled` | boolean | No | Enable the optimizer. Defaults to `false` |
| `settings.optimizer.runs` | number | No | Optimizer runs. Defaults to `200` |
| `settings.evmVersion` | string | No | EVM version. Defaults to `osaka` |

### Compiler settings

The `settings.evmVersion` field accepts any of the following:

- `homestead`
- `tangerineWhistle`
- `spuriousDragon`
- `byzantium`
- `constantinople`
- `petersburg`
- `istanbul`
- `berlin`
- `london`
- `paris`
- `shanghai`
- `osaka` (default)

Turning the optimizer on reduces the gas cost of the deployed contract, so it is worth enabling for anything you intend to put on a live network.

## Output

```typescript
{
  success: boolean,
  contracts?: {
    [filename: string]: {
      [contractName: string]: {
        abi: Array<Object>,
        evm: {
          bytecode: {
            object: string,
            opcodes: string,
            sourceMap: string,
            linkReferences: Object
          },
          deployedBytecode: {
            object: string,
            opcodes: string,
            sourceMap: string,
            linkReferences: Object
          },
          methodIdentifiers: Object,
          gasEstimates: Object
        },
        metadata: string
      }
    }
  },
  sources?: {
    [filename: string]: {
      id: number,
      ast: Object
    }
  },
  errors?: Array<{
    severity: "error" | "warning",
    message: string,
    formattedMessage: string,
    sourceLocation?: {
      file: string,
      start: number,
      end: number
    }
  }>,
  settings?: {
    optimizer: {
      enabled: boolean,
      runs: number
    },
    evmVersion: string
  },
  version?: string
}
```

### Output fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Whether compilation succeeded |
| `contracts` | Object | Compiled contracts by file and contract name. Only present on success |
| `contracts[file][name].abi` | Array | Contract ABI |
| `contracts[file][name].evm.bytecode` | Object | Contract creation bytecode |
| `contracts[file][name].evm.deployedBytecode` | Object | Runtime bytecode |
| `contracts[file][name].evm.methodIdentifiers` | Object | Function signature hashes |
| `contracts[file][name].evm.gasEstimates` | Object | Gas cost estimates |
| `contracts[file][name].metadata` | string | Contract metadata JSON |
| `sources` | Object | Source file information with AST. Only present on success |
| `errors` | Array | Compilation errors and warnings, if there are any |
| `settings` | Object | Compiler settings used. Only present on success |
| `version` | string | Solidity compiler version used |

## Example

```javascript
const result = await client.callTool({
  name: "compile_solidity",
  arguments: {
    sources: {
      "MyToken.sol": {
        content: `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyToken {
    string public name = "MyToken";
    mapping(address => uint256) public balances;

    function mint(address to, uint256 amount) public {
        balances[to] += amount;
    }
}
        `
      }
    },
    version: "v0.8.20+commit.a1b79de6", // Optional: specify compiler version
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      evmVersion: "paris"
    }
  }
});

const output = JSON.parse(result.content[0].text);
console.log('Compiler version:', output.version);
console.log('ABI:', output.contracts['MyToken.sol'].MyToken.abi);
console.log('Bytecode:', output.contracts['MyToken.sol'].MyToken.evm.bytecode.object);
```

## Errors

When the source does not compile, `success` is `false` and the `errors` array describes what went wrong. Each entry carries a `severity` of either `error` or `warning`, so warnings can appear alongside a successful compilation.

```json
{
  "errors": [
    {
      "severity": "error",
      "message": "ParserError: Expected ';' but got 'identifier'",
      "formattedMessage": "ParserError: Expected ';' but got 'identifier'\n --> MyContract.sol:5:9:\n  |\n5 |     uint x\n  |         ^",
      "sourceLocation": {
        "file": "MyContract.sol",
        "start": 78,
        "end": 79
      }
    }
  ]
}
```
