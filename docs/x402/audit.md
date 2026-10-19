---
myst:
  html_meta:
    "description": "Generate an AI security audit checklist for a Solidity contract and run a full audit against it, using the Remix x402 HTTP endpoints."
    "keywords": "get_audit_checklist, do_audit, ai audit, smart contract security, openrouter, deepseek, sonnet, fable, x402, remix ide"
---

# Auditing Contracts with AI

Two endpoints run an AI security audit over your Solidity sources. `/get_audit_checklist` works out which security categories apply to your contract, and `/do_audit` audits the code against that checklist and writes up the findings. Both return markdown, so the output is meant to be read rather than parsed.

They are designed to run in sequence: generate the checklist first, then pass it to the audit.

```{note}
These two services are HTTP only. Unlike compilation and Slither analysis, they are not registered as MCP tools, so an MCP client such as Claude cannot invoke them as a tool. They are indexed on the Bazaar with their input schemas, so an agent can still discover them and call them as a paid HTTP request. See {doc}`Using the HTTP Endpoints </x402/http>` for how payment works.
```

This is static AI analysis, not a substitute for a human audit. Treat the output as a starting point for review, and pair it with {doc}`Slither analysis </x402/analyze>`, which catches different classes of problem.

## Choosing a model

Both endpoints take a required `model` parameter, and the model sets the price:

| Model | `/get_audit_checklist` | `/do_audit` | Both, for one contract |
|-------|------------------------|-------------|------------------------|
| `DeepSeek` | 0.05 USDC | 0.15 USDC | 0.20 USDC |
| `Sonnet` | 0.15 USDC | 0.25 USDC | 0.40 USDC |
| `Fable` | 0.30 USDC | 0.70 USDC | 1.00 USDC |

`DeepSeek` is the fast, low-cost option, and `Fable` gives the most thorough review. Each model has fallbacks: if the chosen model is unavailable, the server retries with a related model, and the `model` field in the result reports the one that actually ran.

The `402 Payment Required` response is priced for the model you name, so send `model` on the first, unpaid request as well as the paid one. If you leave it out, the 402 quotes the `DeepSeek` price, and the paid request is then rejected for the missing field before any payment settles.

## How results are returned

An audit takes a minute or two, so neither endpoint holds the connection open while the model works. A paid request returns `202 Accepted` straight away with a job ID and a URL to poll:

```json
{
  "success": true,
  "message": "Audit job created. Poll the jobStatusUrl to get results.",
  "jobId": "3f2b9c1e-8a4d-4f6e-9b7a-2c5d8e1f0a3b",
  "jobStatusUrl": "https://api.remix.live/mcp/x402-http/job/3f2b9c1e-8a4d-4f6e-9b7a-2c5d8e1f0a3b",
  "status": "pending",
  "estimatedCompletionSeconds": 90
}
```

Poll `jobStatusUrl` with a plain `GET` every 5 to 10 seconds. Polling is free. While the job runs, `status` is `pending` or `processing`. When it finishes, `status` is `completed` and the endpoint's output is in a `result` field:

```json
{
  "jobId": "3f2b9c1e-8a4d-4f6e-9b7a-2c5d8e1f0a3b",
  "status": "completed",
  "endpoint": "/get_audit_checklist",
  "model": "DeepSeek",
  "processingSeconds": 84,
  "result": {
    "success": true,
    "markdown": "# Security Audit Checklist Report\n...",
    "matchedCategories": 8,
    "model": "deepseek/deepseek-v4.1-flash",
    "tokensUsed": 3456
  }
}
```

If the job fails, the poll returns HTTP 500 with `status: "failed"` and an `error` message.

```{important}
A finished job can be read once. The server deletes it as soon as a completed or failed result is returned, and discards an unread result five minutes after the job finishes. A job still running after ten minutes is discarded too. A deleted job returns `404 Job not found`, and the payment is not refunded, so keep polling until you have the result and store it on your side.
```

## Step 1: Generate a checklist

**Endpoint:** `POST /get_audit_checklist`

**Price:** 0.05, 0.15, or 0.30 USDC, depending on the model.

**Typical time:** about 90 seconds.

The server matches your contract against a library of security audit categories and returns the ones that apply, each with a severity and a short note on why it is relevant.

### Input parameters for checklist

```typescript
{
  sources: {
    [filename: string]: {
      content: string
    }
  },
  model: "DeepSeek" | "Sonnet" | "Fable",
  maxCategories?: number
}
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `sources` | Object | Yes | Map of filename to source code content, the same shape `/compile` takes |
| `sources[filename].content` | string | Yes | Solidity source code |
| `model` | string | Yes | `DeepSeek`, `Sonnet`, or `Fable`. Sets the price |
| `maxCategories` | number | No | Maximum number of categories to match. Defaults to `12`, maximum `20` |

### Checklist output

This is the `result` field of the completed job:

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
| `model` | string | The model that ran the analysis, which may be a fallback |
| `tokensUsed` | number | Tokens consumed by the model |

The `markdown` field is what you pass to `/do_audit` in step 2.

## Step 2: Run the audit

**Endpoint:** `POST /do_audit`

**Price:** 0.15, 0.25, or 0.70 USDC, depending on the model.

**Typical time:** about 120 seconds.

This takes your sources and a checklist, works through the code against every checklist item, and returns a full audit report with findings classified by severity.

### Input parameters for audit

```typescript
{
  sources: {
    [filename: string]: {
      content: string
    }
  },
  checklist: string,
  model: "DeepSeek" | "Sonnet" | "Fable"
}
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `sources` | Object | Yes | Map of filename to source code content |
| `checklist` | string | Yes | Audit checklist in markdown, normally the `markdown` field from `/get_audit_checklist` |
| `model` | string | Yes | `DeepSeek`, `Sonnet`, or `Fable`. Sets the price |

The `checklist` parameter is required, but it does not have to come from step 1. If you have your own checklist in markdown, you can send that instead. The two steps do not have to use the same model either.

### Audit output

This is the `result` field of the completed job:

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
| `model` | string | The model that ran the audit, which may be a fallback |
| `tokensUsed` | number | Tokens consumed by the model |

Each finding in the report carries a severity, a category, a description of the problem, and a recommendation for fixing it.

## Example

This runs both steps with `DeepSeek`, for 0.20 USDC in total. It uses `@x402/fetch` to handle payment, as described in {doc}`Using the HTTP Endpoints </x402/http>`, and plain `fetch` to poll, since polling is free:

```javascript
const BASE_URL = "https://api.remix.live/mcp/x402-http";
const MODEL = "DeepSeek";

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

// Poll a job every 5 seconds until it finishes, for up to 10 minutes
async function waitForJob(jobStatusUrl) {
  for (let attempt = 0; attempt < 120; attempt++) {
    const response = await fetch(jobStatusUrl);
    const job = await response.json();

    if (job.status === "completed") return job.result;
    if (job.status === "failed") throw new Error(`Job failed: ${job.error}`);
    if (!response.ok) throw new Error(`Polling failed: ${response.status}`);

    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
  throw new Error("Timed out waiting for job");
}

// Step 1: work out which security categories apply (0.05 USDC)
const checklistJob = await x402Fetch(`${BASE_URL}/get_audit_checklist`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ sources, model: MODEL, maxCategories: 12 })
}).then((response) => response.json());

const checklist = await waitForJob(checklistJob.jobStatusUrl);
console.log(`Matched ${checklist.matchedCategories} categories`);

// Step 2: audit the contract against that checklist (0.15 USDC)
const auditJob = await x402Fetch(`${BASE_URL}/do_audit`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ sources, checklist: checklist.markdown, model: MODEL })
}).then((response) => response.json());

const audit = await waitForJob(auditJob.jobStatusUrl);
console.log(`${audit.findingsCount} findings:`, audit.severity);
console.log(audit.markdown);
```

The contract above has an unrestricted `mint` function, so expect access control to come back as a high severity finding.

## Costs

These are the most expensive fixed-price calls the server offers, so check your contract compiles before auditing it. A contract that does not compile still costs you the audit fee, and so does a result you never collect.

Start with `DeepSeek` while you are iterating on a contract, and move to `Sonnet` or `Fable` for a final review.
