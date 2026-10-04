---
myst:
  html_meta:
    "description": "Security guidance for Remix IDE users: how to verify the Remix URL, avoid scams, use static analysis and contract verification, protect your code with a private LLM, and learn common Solidity vulnerabilities through hands-on tutorials."
    "keywords": "remix ide, security, smart contract scams, phishing, static analysis, slither, solhint, contract verification, sourcify, AI privacy, ollama, reentrancy, access control, solidity security, learneth"
---

# Using Remix Safely

Remix is widely used by developers at every level, from first-time smart contract writers to experienced auditors. That accessibility also makes it a target for scams and phishing. This page covers how to verify you are using the real Remix, how to develop safely, and which built-in tools can help you catch vulnerabilities before deployment.

## Verifying the Remix URL

Remix is hosted on the [remix.live](https://remix.live) domain. The only valid Remix URLs are:

- Stable: [app.remix.live](https://app.remix.live)
- Alpha: [alpha.remix.live](https://alpha.remix.live)
- Beta: [beta.remix.live](https://beta.remix.live)

Remix used to be hosted at `remix.ethereum.org`. That address now redirects to [app.remix.live](https://app.remix.live), so landing on the new URL from an old link or bookmark is expected. Wherever you start from, the address bar should end up showing one of the three URLs above.

If you are directed to some site that looks like Remix but has a **similar but different URL** - it is NOT Remix and is likely a phishing scam.

Always check that you are loading Remix over `https` unless you have a specific reason for accessing it with `http` (e.g. for using Remix locally or for a connection you trust).

Our only social profiles include:

- X (formerly Twitter): [Remix on X](https://www.x.com/EthereumRemix)
- LinkedIn: [Remix on LinkedIn](https://linkedin.com/company/ethereum-remix)

```{warning}
Team members will never DM you on Discord claiming to be support, or ask for your private keys, or ask you to click shady links. Always use the #community channel to ask your questions.
```

## Safe development practices

- Make sure all your imports include the **version number** otherwise you don't know what version of files you are getting and the builds are not reproducible.

  So **do not** use an import like this:

  ```solidity
  import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
  ```

  Rather, **use one** like this:

  ```solidity
  import "@openzeppelin/contracts@5.0.0/token/ERC20/ERC20.sol";
  ```

- When connecting a contract to an existing deployment, ensure that the thing you are connecting to is correct AND is the correct version.

- Always be sure to address or understand every warning.

<!-- vale Vale.Repetition = NO -->

- Never deploy or send transactions on contracts you don't fully understand, even if it's a get rich quick scheme that you've copied & pasted from a Discord DM or a YouTube video and you really really want to get rich.
- If you have pasted code you are unsure about, ask the RemixAI Assistant to review it before deploying. Remix already prompts you to do this every time you paste code in the IDE.

<!-- vale Vale.Repetition = YES -->

## Scam awareness

- Check our [article](https://medium.com/remix-ide/remix-in-youtube-crypto-scams-71c338da32d?source=friends_link&sk=bb6efbbf88bc3e496611943d282ad797) on a known scam promoting "liquidity front runner bots".

**Scams lose their effectiveness when potential victims are educated about scams and about how to read and understand code. Learn Solidity and learn it well!**

### Solidity tutorials in Remix

These interactive tutorials by WTF Academy are available in the LearnEth plugin. Each one walks through a real vulnerability class with hands-on exercises.

<!-- vale Vale.Spelling = NO -->
<!-- vale Vale.Terms = NO -->

::::{grid} 3
:gutter: 3

:::{grid-item-card} Reentrancy Attack
:columns: 12 6 4 4
:link-type: url
:link: https://app.remix.live/?#activate=solidityUnitTesting,LearnEth&call=LearnEth//startTutorial//ethereum/remix-workshops//master//reentrancy-attack

The classic Ethereum exploit. Learn how recursive external calls can drain contract balances.
:::

:::{grid-item-card} Access Control
:columns: 12 6 4 4
:link-type: url
:link: https://app.remix.live/?#activate=solidityUnitTesting,LearnEth&call=LearnEth//startTutorial//ethereum/remix-workshops//master//access-control-exploit

Identify missing or misconfigured access controls that expose privileged functions.
:::

:::{grid-item-card} Integer Overflow
:columns: 12 6 4 4
:link-type: url
:link: https://app.remix.live/?#activate=solidityUnitTesting,LearnEth&call=LearnEth//startTutorial//ethereum/remix-workshops//master//integer-overflow

Understand how arithmetic overflows can wrap values unexpectedly and how to prevent them.
:::

:::{grid-item-card} tx.origin Phishing
:columns: 12 6 4 4
:link-type: url
:link: https://app.remix.live/?#activate=solidityUnitTesting,LearnEth&call=LearnEth//startTutorial//ethereum/remix-workshops//master//tx-origin-phishing-attack

Understand why using `tx.origin` for authorization is dangerous and how attackers exploit it.
:::

:::{grid-item-card} Front-Running
:columns: 12 6 4 4
:link-type: url
:link: https://app.remix.live/?#activate=solidityUnitTesting,LearnEth&call=LearnEth//startTutorial//ethereum/remix-workshops//master//front-running

Learn how transaction ordering can be exploited by miners or bots to extract value.
:::

:::{grid-item-card} Oracle Manipulation
:columns: 12 6 4 4
:link-type: url
:link: https://app.remix.live/?#activate=solidityUnitTesting,LearnEth&call=LearnEth//startTutorial//ethereum/remix-workshops//master//oracle-manipulation

Understand how price oracles can be manipulated within a single transaction to exploit DeFi protocols.
:::

::::

<!-- vale Vale.Spelling = YES -->
<!-- vale Vale.Terms = YES -->

These are not exhaustive. LearnEth includes additional tutorials covering more vulnerability classes. Open the LearnEth plugin in the Plugin Manager to browse the full list.

## Static analysis

Remix includes a Static Analysis plugin that runs security and quality checks on your Solidity code before deployment. It integrates three tools:

- **Remix Analysis** — built-in checks that flag common issues such as reentrancy risks, unused variables, and dangerous low-level calls.
- **Slither** — a widely-used Solidity static analyzer that detects a broad range of vulnerabilities. You can also prompt the RemixAI Assistant to run a Slither scan directly.
- **Solhint** — a linter that enforces Solidity style and security best practices.

See {doc}`Static Analysis </static_analysis>` for usage details.

## Contract verification

Verifying a contract publishes its source code and makes it auditable by anyone. Remix integrates with [Sourcify](https://sourcify.dev) to make this as frictionless as possible:

- A **verify on deployment** checkbox is enabled by default in the Deploy panel — verified source is submitted automatically when you deploy.
- For contracts already on-chain, use the **Contract Verification plugin** to verify after the fact.

See {doc}`Contract Verification </contract_verification>` for details.

## AI privacy

When using the RemixAI Assistant, any code you share is sent to the configured LLM. If your code contains sensitive logic or proprietary algorithms, consider using a private LLM instead:

- **Ollama** — run a local LLM entirely on your own machine, with no data leaving your environment.
- **Cloud-hosted private LLM** — run Ollama in a private cloud instance for teams that need more compute.

See {ref}`Running Ollama in the cloud with Remix <ai:running ollama in the cloud with remix>` and {ref}`Using a local LLM for privacy <ai:using a local llm for privacy>` for setup instructions.
