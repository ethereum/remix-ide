---
myst:
  html_meta:
    "description": "Generate an AI security audit checklist for a Solidity contract and run a full audit against it, using the Remix x402 HTTP endpoints."
    "keywords": "get_audit_checklist, do_audit, ai audit, smart contract security, openrouter, x402, remix ide"
---

# Auditing Contracts with AI

Two endpoints run an AI security audit over your Solidity sources. `/get_audit_checklist` works out which security categories apply to your contract, and `/do_audit` audits the code against that checklist and writes up the findings. Both return markdown, so the output is meant to be read rather than parsed.

They are designed to run in sequence: generate the checklist first, then pass it to the audit.

```{note}
These two services are HTTP only. Unlike compilation and Slither analysis, they are not registered as MCP tools, so an MCP client such as Claude cannot invoke them as a tool. They are indexed on the Bazaar with their input schemas, so an agent can still discover them and call them as a paid HTTP request. See {doc}`Using the HTTP Endpoints </x402/http>` for how payment works.
```

This is static AI analysis, not a substitute for a human audit. Treat the output as a starting point for review, and pair it with {doc}`Slither analysis </x402/analyze>`, which catches different classes of problem.

## Step 1: Generate a checklist

**Endpoint:** `POST /get_audit_checklist`

**Price:** 0.05 USDC per call.

The server matches your contract against a library of security audit categories and returns the ones that apply, each with a severity and a short note on why it is relevant.

### Input parameters

```typescript
{
  sources: {
    [filename: string]: {
      content: string
    }
  },
  maxCategories?: number
}
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `sources` | Object | Yes | Map of filename to source code content, the same shape `/compile` takes |
| `sources[filename].content` | string | Yes | Solidity source code |
| `maxCategories` | number | No | Maximum number of categories to match. Defaults to `12`, maximum `20` |

### Output

```typescript
{
  success: boolean,
  markdown: string,
  matchedCategories: number,
  model: string,
  tokensUsed: number
}
```

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Whether the request completed |
| `markdown` | string | The checklist report, in markdown |
| `matchedCategories` | number | How many categories were matched to the contract |
| `model` | string | AI model used for the analysis |
| `tokensUsed` | number | Tokens consumed by the model |

The `markdown` field is what you pass to `/do_audit` in step 2.

## Step 2: Run the audit

**Endpoint:** `POST /do_audit`

**Price:** 0.10 USDC per call.

This takes your sources and a checklist, works through the code against every checklist item, and returns a full audit report with findings classified by severity.

### Input parameters

```typescript
{
  sources: {
    [filename: string]: {
      content: string
    }
  },
  checklist: string
}
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `sources` | Object | Yes | Map of filename to source code content |
| `checklist` | string | Yes | Audit checklist in markdown, normally the `markdown` field from `/get_audit_checklist` |

The `checklist` parameter is required, but it does not have to come from step 1. If you have your own checklist in markdown, you can send that instead.

### Output

```typescript
{
  success: boolean,
  markdown: string,
  findingsCount: number,
  severity: {
    critical: number,
    high: number,
    medium: number,
    low: number,
    informational: number
  },
  model: string,
  tokensUsed: number
}
```

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Whether the audit completed |
| `markdown` | string | The audit report, in markdown |
| `findingsCount` | number | Total number of findings |
| `severity` | Object | Counts by severity level |
| `model` | string | AI model used for the audit |
| `tokensUsed` | number | Tokens consumed by the model |

Each finding in the report carries a severity, a category, a description of the problem, and a recommendation for fixing it.

## Example

Running both steps costs 0.15 USDC. This uses `@x402/fetch` to handle payment, as described in {doc}`Using the HTTP Endpoints </x402/http>`:

```javascript
const BASE_URL = "https://api.remix.live/mcp/x402-http";

const sources = {
  "MyToken.sol": {
    content: `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyToken {
    mapping(address => uint256) public balances;

    function mint(address to, uint256 amount) public {
        balances[to] += amount;
    }
}
    `
  }
};

// Step 1: work out which security categories apply (0.05 USDC)
const checklistResponse = await x402Fetch(`${BASE_URL}/get_audit_checklist`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ sources, maxCategories: 12 })
});

const checklist = await checklistResponse.json();
console.log(`Matched ${checklist.matchedCategories} categories`);

// Step 2: audit the contract against that checklist (0.10 USDC)
const auditResponse = await x402Fetch(`${BASE_URL}/do_audit`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ sources, checklist: checklist.markdown })
});

const audit = await auditResponse.json();
console.log(`${audit.findingsCount} findings:`, audit.severity);
console.log(audit.markdown);
```

The contract above has an unrestricted `mint` function, so expect access control to come back as a high severity finding.

## Costs

| Call | Price |
|------|-------|
| `/get_audit_checklist` | 0.05 USDC |
| `/do_audit` | 0.10 USDC |
| Both, for one contract | 0.15 USDC |

These are the most expensive fixed-price calls the server offers, so check your contract compiles before auditing it. A contract that does not compile still costs you the audit fee.
