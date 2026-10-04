AI Tools
========

.. meta::
   :description: RemixAI is Remix IDE's built-in AI assistant and Copilot for Solidity smart contract development, code completion, and explanation.
   :keywords: remixai, ai assistant, code completion, solidity ai, remix ide ai

Remix has its own AI tool named **RemixAI Assistant**, which appears in the Right Side Panel once you log into your Remix account.

Access to RemixAI varies by your Remix plan:

- **Free Plan**: This provides access to Basic AI Skills and the QuickDApp Front-end Generator (excluding hosting), with AI model consumption billed on usage-based pricing.
- **Starter & Pro Plans**: Subscribing to our `Starter or Pro plans <https://app.remix.live/?call=planManager//open//plans>`_ unlocks more AI capabilities and includes an initial gift of RemixAI credits.

Users of all levels can either buy credits or can `connect their own API keys from supported providers <provide your own API key_>`_ to utilize tokens from their personal accounts rather than Remix credits.

.. image:: images/ai/remix-ai-panel.png
   :alt: RemixAI Assistant Right Side Panel


RemixAI is also integrated into other parts of the IDE including:

- `The Code Helper <code helper_>`_
- `Gas optimization audits <gas optimization audits_>`_
- `Security audits <security audits_>`_
- `The Explain contract button <explain contract_>`_
- The **Explain compiler error** button when an error is thrown in the Solidity Compiler.
- **Right-click menu options** in the Editor.
- **Code requests in the Editor** by prepending an AI code request in a file with a double slash (``//``).

The RemixAI Assistant retains your conversation history within a session, so you can refer back to earlier responses or continue a previous request.

.. note::
   The chat history is stored in your browser's storage, thus, you will not be able to access it when you log in to your Remix account on another device.

Choosing an LLM for code explanations
-------------------------------------

In the RemixAI Assistant, there is a choice of LLMs for use in **code explanations**
and in the AI Assistant.

The default LLM is **Mistral Medium**. Click the MistralAI button and a modal will pop up
where you can select models from **Anthropic**, **OpenAI**, **Mistral**, **Local Models (Ollama)**, and Open Weight models.

.. image:: images/ai/available-models.png
   :alt: RemixAI LLM dropdown menu

The RemixAI Assistant responds in the language in which it is asked and can answer
questions about Solidity, JavaScript/TypeScript, Vyper, and other programming languages.

Using a local LLM for privacy
-----------------------------

When using an LLM, unless the model is running locally, your inputs may be used
by the provider for training or retention. This means the information you submit
could be stored or reused.

If you want to use AI tools while keeping your information private, you can use
a **local LLM**.

Remix supports **Ollama**, a local AI model runner that allows you to download and
run large language models (LLMs) directly on your own machine.

The Ollama LLMs supported by Remix include:

- ``codestral:latest``
- ``qwen3-coder:latest``
- ``gpt-oss:latest``
- ``deepseek-coder-v2:latest`` (recommended for code completion)
- ``codegemma:7b``
- ``codegemma:2b`` (lightweight option)

In addition to privacy, Remix’s Ollama integration provides:

- **No API rate throttling** – no usage fees or rate limits
- **Offline capability** – works without an internet connection
- **Fill-in-the-Middle (FIM) support** – advanced code completion features

.. note::
   The Ollama integration does not support agentic workflows available in the
   online RemixAI service, such as Remix MCP or generating and editing
   Workspaces. Its capabilities are limited to code completion and
   conversational interactions.


Setting up Ollama in Remix
^^^^^^^^^^^^^^^^^^^^^^^^^^
Before using Ollama with Remix, ensure the following requirements are met:

- **Ollama is installed** on your system. Visit the
  `Ollama website <https://ollama.com/>`_ to download and install it.
- **At least one supported or recommended model** is installed locally.

After completing the setup, start the Ollama server by running:

.. code-block:: shell

   ollama serve

By default, the Ollama service listens on:

::

   http://localhost:11434

You can confirm that Ollama is running by visiting the URL above. If it is running, you should see the message below.

.. image:: images/ai/ollama-running.png
   :alt: Ollama is running text in browser.

Next, to allow the Remix IDE to communicate with your local Ollama instance, you must
configure **CORS**. See `how to setup CORS for Ollama <https://objectgraph.com/blog/ollama-cors/>`_ for instructions specific to your operating system.


.. important::
   Once configured, restart the Ollama service and your terminal instance to apply the changes.


You can check if Remix is on your Ollama allowlist by running the command below:

.. code-block:: shell

   curl -X OPTIONS http://localhost:11434 \
   -H "Origin: https://app.remix.live" \
   -H "Access-Control-Request-Method: GET" \
   -I

If "app.remix.live" is configured properly, you will get the message below:

.. code-block:: shell

   HTTP/1.1 204 No Content
   Access-Control-Allow-Headers: Authorization, Content-Type, User-Agent, Accept, X-Requested-With, Openai-Beta, X-Stainless-Arch, X-Stainless-Async, X-Stainless-Custom-Poll-Interval, X-Stainless-Helper-Method, X-Stainless-Lang, X-Stainless-Os, X-Stainless-Package-Version, X-Stainless-Poll-Helper, X-Stainless-Retry-Count, X-Stainless-Runtime, X-Stainless-Runtime-Version, X-Stainless-Timeout
   Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS
   Access-Control-Allow-Origin: https://app.remix.live
   Access-Control-Max-Age: 43200
   Allow: HEAD, GET
   Vary: Origin
   Vary: Access-Control-Request-Method
   Vary: Access-Control-Request-Headers
   Date: Sun, 11 Jan 2026 23:52:32 GMT


.. tip::
   If you run into any issues check out our `Ollama troubleshooting guide <https://github.com/remix-project-org/remix-project/blob/master/OLLAMA_SETUP.md#troubleshooting>`_.

After the setup, select Ollama as the model on RemixAI and it will automatically detect the supported models you have on your device. You can select your preferred model and use it for code completion and assistance.

.. image:: images/ai/ollama-remix.png
   :alt: RemixAI assistant with Ollama as the model

Running Ollama in the cloud with Remix
--------------------------------------

Large language models (LLMs) are resource-intensive and may not run efficiently on
all local machines. If system resources or disk space are a concern, you can run a
private LLM on another machine or in the cloud and configure Ollama to connect to it
remotely.

Remix supports this by allowing you to specify the Ollama server URL.

Follow the steps below to configure a remote Ollama instance in Remix:

1. Click the **gear icon** in the top-right corner of Remix to open the **Settings** panel.
2. Navigate to the **RemixAI Assistant** section.
3. Under **Ollama URL Configuration**, enter the URL of the machine running Ollama.

.. image:: images/ai/ollama-cloud.png
   :alt: Remix settings showing the Ollama config


Adding AI Skills to RemixAI
---------------------------

**Skills** are collections of instructions and reference material that give RemixAI deeper, more specialized knowledge for a particular domain. Remix provides a library of built-in Skills covering verticals such as **Wallets**, **L2s**, **DeFi**, and **Security**, so you can equip the Assistant with focused expertise for the task at hand. You can also upload your own Skills to extend RemixAI with your own instructions and knowledge.

To open the Skills modal, type ``/load-skills`` in the RemixAI Assistant chat. From there you can browse and enable the built-in Skills or upload your own. Enabled Skills are loaded into a ``skills`` folder in your workspace, and RemixAI references them for the rest of the conversation.

.. image:: images/ai/skills.png
   :alt: RemixAI Skills library modal



.. _code helper:

RemixAI Code Helper (Pro & Starter plans)
-----------------------------------------
The code helper provides instant code reviews focused on security and gas optimization. To activate the code helper, highlight a piece of code or a function and you will get an instant review. 

.. image:: images/ai/code-helper.jpg
   :alt: RemixAI Code Helper analysis popup


From the code helper pop up you can ask RemixAI to analyze the entire file instead of that part or open of that part in RemixAI to ask follow up questions about it.


.. _gas optimization audits:

Gas optimization with RemixAI (Pro & Starter plans)
---------------------------------------------------
On Ethereum and other EVM chains, every computation and storage operation your contract performs costs gas, which your users pay for in real money each time they call it. RemixAI supports **Gas optimization audits** to help you find and fix inefficiencies that inflate these costs before you deploy.

To start one, enter ``/start-gas-optimization-audit`` in the prompt box, or click the **Tools** pill. RemixAI will ask which contract you want to optimize, then list the focus areas it will check, including:

- **Loop optimization** – e.g. ``for`` loops over arrays or mappings
- **Storage vs. memory** – e.g. unnecessary storage reads or writes
- **Function visibility** – e.g. ``public`` vs. ``external``/``internal``
- **Data packing** – e.g. how structs and variables are packed into storage slots
- **Avoiding redundant computations** – e.g. caching values instead of recomputing them

This checklist is derived from the `RareSkills Book of Gas Optimization <https://rareskills.io/post/gas-optimization>`_.

.. warning::
   Some of these optimizations change how your contract behaves, not just
   what it costs, and the compiler won't stop you. Reordering fields breaks
   storage layout on a proxy upgrade; caching a value that later changes
   gives a stale read. Re-run Slither and the Cyfrin Audit checklist before
   deploying, and if you're upgrading, verify storage-layout compatibility
   separately (Slither won't catch a layout collision on its own).



.. _security audits:

Security audits with RemixAI
-----------------------------
Unlike a regular application, a smart contract can't be patched after it's deployed, so a vulnerability that slips through can mean an irreversible loss of funds. RemixAI can audit your contracts with a **Slither** scan, and you can also select from over 47 **security checklists**, sourced from the Cyfrin Audit Checklists repo, covering a wide range of attack categories, all from within Remix. Auditing with checklists means you know exactly which vulnerabilities RemixAI is checking for, rather than relying on Slither's static analysis alone.

Start an audit by opening the **AI Assistant** and typing ``/audit``, or by clicking the **Tools** pill. By default, this runs a Slither scan against your contract.

To go beyond the default Slither scan, load one or more checklists before you start the audit:

1. Type ``/load-security-audit-checklist`` into the prompt box, or click the **Tools** pill.
2. Select the checklists that are closely related to your contract. A checklist you've already loaded shows an **in workspace** badge.

.. image:: images/ai/audit-checklist.png
   :alt: RemixAI security audit checklist modal

When you then start the audit with ``/audit``, the Checklist Modal opens again. If you've already selected the checklists you want, hit the **X** button to close it and continue with your existing selection. RemixAI will then ask which contract you want to audit. It runs a Slither scan together with a security audit based on the checklists you selected, and saves the result to the ``audit_report`` folder. The checklists themselves are stored in the workspace's ``audit`` folder.

.. important::
   Loading too many checklists at once can make your audits take a long time to run and use a lot of AI resources.


You can access security audits, gas optimization, AI skills, and other AI features from the pills above the AI Assistant, shown in the image below:

.. image:: images/ai/pills.png
   :alt: RemixAI pills

.. _provide your own API key:

Using external API keys for RemixAI (Pro & Starter plans)
---------------------------------------------------------
RemixAI allows you to add your own API keys and use your own available tokens. To add your own API keys, click the **Settings** icon on the top right of the Top Bar, select RemixAI Assistant, and scroll to the bottom. You will find the option under the "Bring Your Own Keys" Section. Currently, we support keys from Anthropic, OpenAI, Mistral, and Moonshot/Kimi.

.. image:: images/ai/external-providers.png
   :alt: RemixAI Assistant Bring Your Own API Keys settings




Model Context Protocol (MCP)
-----------------------------

Remix supports **Model Context Protocol (MCP)** servers, which give the RemixAI access to external tools and libraries during agentic workflows.

You can manage the MCP servers available to you in **Settings > RemixAI Assistant**. Here you can turn the available servers on and off, depending on your preferences.

.. image:: images/ai/connected-mcps.png
   :alt: Remix MCP Connected Services panel


The following MCP servers are available in RemixAI:

- **Remix IDE Server** (Built-in) – Always connected. Gives the AI direct access to
  your workspace files and IDE features such as compilation, file management, and
  Slither static analysis.
- **OpenZeppelin Contracts** – Gives the AI access to OpenZeppelin's audited contract 
  library, so it can suggest secure, battle-tested implementations rather than 
  generating patterns from scratch.
- **Web Search** – Allows the AI to retrieve up-to-date information such as recent 
  protocol changes, audit reports, and external documentation.
- **ethSkills** – A curated Ethereum knowledge base designed specifically for AI 
  agents. It covers production-ready guidance across gas costs, L2s, token standards, 
  DeFi protocols, security patterns, contract auditing, and more, helping the AI avoid 
  stale or hallucinated answers about Ethereum development.
- **Alchemy** – Allows the AI to query live on-chain data including account balances, 
  transaction histories, and contract state via Alchemy's infrastructure.
- **Etherscan** – Allows the AI to look up deployed contracts, inspect verified source 
  code, and retrieve transaction data directly from the block explorer.
- **The Graph API** – Allows the AI to query indexed blockchain data via GraphQL 
  subgraphs, useful for retrieving protocol analytics and historical event data.


Sample prompts
^^^^^^^^^^^^^^

The examples below show how to phrase requests to get the most out of the RemixAI Assistant. Each section explains the intent behind the prompt type and gives one example.

**Writing contracts**

Ask RemixAI to generate a contract from a plain-language description. Be specific about the behaviour you want (access control, token standards, limits) and the AI will produce a starting implementation you can refine.

  *Write an ERC-20 token contract with a mint function restricted to the owner and a maximum supply of 1 million tokens.*

**Security review**

Ask RemixAI to analyse a specific contract or the active file for vulnerabilities. You can target a particular class of issue or ask for a general review. Slither static analysis is built into the Remix IDE Server, so the AI can run it and incorporate the results without any additional setup.

  *Review the active contract for reentrancy vulnerabilities and suggest fixes.*

**Using OpenZeppelin** *(OpenZeppelin MCP)*

Ask RemixAI to suggest or apply an OpenZeppelin implementation instead of writing custom logic. The AI has access to the full OpenZeppelin library and can recommend the right base contract for your use case.

  *Replace the access control in this contract with OpenZeppelin's Ownable.*

**Querying live on-chain data** *(Alchemy / Etherscan)*

Ask RemixAI to look up real-time blockchain data such as balances, transactions, or verified source code. Useful for investigating a deployed contract or checking an address without leaving the IDE.

  *Fetch the verified source code and recent transactions for this contract address: 0x...*

**Querying indexed protocol data** *(The Graph)*

Ask RemixAI to query a subgraph for aggregated or historical data. Useful for retrieving protocol-level metrics or event histories that are not available from a single contract call.

  *Get the total value locked in Aave on Ethereum over the last 7 days using a subgraph query.*

**General Solidity and Ethereum questions**

Ask RemixAI about language features, best practices, or protocol mechanics. The Web Search MCP server allows it to retrieve up-to-date information, so it can answer questions about recent changes that postdate its training data.

  *What changed in Solidity 0.8.24 that could affect a contract I wrote for 0.8.20?*

Code completion
---------------

When you type a space or start a new line, the RemixAI Assistant may propose code
suggestions. This feature is known as **code completion**.

The suggestions take into account what has already been written in the file.

The toggle to enable code completion is located at the bottom-left of the Main Panel
when a file is active. Once enabled, code completion uses the **MistralAI** LLM by default. If Ollama is configured as the active model, code completion will use the selected Ollama model instead.

.. image:: images/ai/copilot-switch.png
   :alt: Remix AI Copilot button

As you type, RemixAI proposes a suggestion inline.

.. image:: images/ai/a-ai-completion-proposal.png
   :alt: RemixAI completion proposal

Press ``Tab`` to accept the suggestion.

.. image:: images/ai/a-ai-completion-accepted.png
   :alt: RemixAI accepted completion

.. note::

   All other RemixAI tools are always enabled.


.. _explain contract:

Editor: Explain Contract
-------------------------

At the bottom of the Editor, when a ``.sol`` file is active, there is an **Explain contract** button.

Click the button to send the active contract to RemixAI. The Assistant will explain what the contract does.


Editor: Right-click Menu
------------------------

When you right-click a function in the Editor, a popup menu appears with options
powered by RemixAI, including:

- **Explain this function**
- **Explain this code**
- **Generate documentation**

.. image:: images/ai/a-ai-editor-popup-menu.png
   :alt: Remix AI right click menu

The **Explain this code** option can be triggered with or without selecting code.
If no code is selected, RemixAI considers the code surrounding the cursor.


Ask RemixAI with //
---------------------------

With the AI Copilot enabled, start a comment with ``//`` to send a code request
directly from the Editor. Example:

::

   // write a function that returns an array with 3 elements from the function's parameters



Compilers: Explain Error
------------------------

In the error cards of both the Solidity Compiler and the Vyper Compiler, there is
an **Ask RemixAI** button that helps explain compiler errors.

Click the button to send the error message to RemixAI. The Assistant will explain
the cause of the error and suggest how to fix it.

.. image:: images/ai/a-ai-solcomp1.png
   :alt: Compiler Explain Error