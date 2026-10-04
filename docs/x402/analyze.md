---
myst:
  html_meta:
    "description": "Run Slither static security analysis on Solidity contracts through the Remix x402 MCP Server, with detector selection and severity filtering."
    "keywords": "analyze_with_slither, slither, static analysis, security audit, x402, mcp, remix ide"
---

# Analyzing Contracts with Slither

The `analyze_with_slither` tool runs Slither's static security analysis over your Solidity sources and returns the findings grouped by severity. Run it before deploying anything, to catch problems while they are still cheap to fix.

**Price:** 0.02 USDC per call.

## Input parameters

```typescript
{
  sources: {
    [filename: string]: {
      content: string
    }
  },
  version?: string,
  detectors?: Array<string>,
  excludeLow?: boolean,
  excludeInformational?: boolean
}
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `sources` | Object | Yes | Map of filename to source code content |
| `sources[filename].content` | string | Yes | Solidity source code |
| `version` | string | No | Solidity compiler version, for example `0.8.35` |
| `detectors` | Array&lt;string&gt; | No | Specific detectors to run |
| `excludeLow` | boolean | No | Exclude low severity findings. Defaults to `false` |
| `excludeInformational` | boolean | No | Exclude informational findings. Defaults to `false` |

### Common detectors

If you leave `detectors` empty, the full detector set runs. Some of the more commonly used ones are:

- `reentrancy-eth`: reentrancy vulnerabilities
- `arbitrary-send-eth`: unprotected ETH send
- `suicidal`: unprotected self-destruct
- `uninitialized-state`: uninitialized state variables
- `unchecked-transfer`: unchecked return values
- `tx-origin`: dangerous use of `tx.origin`
- `timestamp`: timestamp dependency

## Output

```typescript
{
  success: boolean,
  summary?: {
    totalFindings: number,
    high: number,
    medium: number,
    low: number,
    informational: number,
    optimization: number
  },
  findings?: Array<{
    check: string,
    impact: "High" | "Medium" | "Low" | "Informational" | "Optimization",
    confidence: "High" | "Medium" | "Low",
    description: string,
    elements?: Array<{
      type: string,
      name: string,
      source_mapping?: {
        start: number,
        length: number,
        filename_relative: string,
        lines: Array<number>
      }
    }>,
    reference?: string,
    id?: string
  }>,
  rawAnalysis?: string,
  rawOutput?: Object,
  compilerVersion?: string,
  error?: string
}
```

### Output fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Whether the analysis completed |
| `summary` | Object | Counts by severity level |
| `findings` | Array | The security findings |
| `findings[].check` | string | Detector that found the issue |
| `findings[].impact` | string | Severity level of the finding |
| `findings[].confidence` | string | Confidence level of the finding |
| `findings[].description` | string | Human-readable description |
| `findings[].elements` | Array | Code elements involved, where available |
| `findings[].reference` | string | URL with more information |
| `rawAnalysis` | string | Raw Slither output text |
| `rawOutput` | Object | Complete Remix API response |
| `compilerVersion` | string | Solidity version used for the analysis |
| `error` | string | Error message if the analysis failed |

### Impact levels

- **High**: critical vulnerabilities that should be fixed immediately
- **Medium**: important issues that could lead to problems
- **Low**: minor issues or code quality improvements
- **Informational**: best practice suggestions

A finding also carries a `confidence` level. Treat a high impact, high confidence finding as a blocker; lower confidence findings are worth reading, but may not apply to your contract.

## Example

This contract changes state after an external call, which is the classic reentrancy pattern:

```javascript
const result = await client.callTool({
  name: "analyze_with_slither",
  arguments: {
    sources: {
      "Vulnerable.sol": {
        content: `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Vulnerable {
    mapping(address => uint256) public balances;

    function withdraw() public {
        uint256 amount = balances[msg.sender];
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success);
        balances[msg.sender] = 0; // State change after external call!
    }
}
        `
      }
    },
    excludeInformational: true
  }
});

const output = JSON.parse(result.content[0].text);
console.log('Summary:', output.summary);
output.findings.forEach(finding => {
  console.log(`[${finding.impact}] ${finding.check}: ${finding.description}`);
});
```
