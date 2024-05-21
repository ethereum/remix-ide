AI Tools
========

Remix has integrated two AI tools:
- ChatGPT 
- Remix's Solidity Copilot which uses our own LLM (large language model) called Solcoder.

## Remix's Solidity Copilot
Solidity Copilot helps in writing code using code completion. The switch to activate Solidity Copilot is at the top of the Editor. 

![](images/a-ai-switch.png)

The Solidity Copilot is specifically for help with Solidity coding. Although it is thousands of times smaller than ChatGPT, it could be slower than ChatGPT.  

## ChatGPT in Remix
Remix is currently using ChatGPT v3.5. 

## Editor: Right-click Menu 
Both ChatGPT and Solidity Copilot are integrated into the Editor's Right-click popup menu.

![](images/a-ai-editor-popup-menu.png)

In both cases the answer will be printed out in Remix's Terminal.

### GPT: Explain a Function and Generate Documentation
In the Right-click menu, select the options **Explain the function** and **Generate documentation**.

### Solcoder: Explain this code
The "Explain this code" option in the Editor's Right-click menu can be triggered with, or without, highlighting a block of code.

## Editor: Code Completion
With the Solidity Copilot switch on, just start typing. When you put a space after a word, the Copilot will make a suggestion.  

**NOTE: the suggestion will take into account everything that preceded it in this contract.**

![](images/a-ai-completion-proposal.png)

Hit tab to accept the suggestion.

![](images/a-ai-completion-accepted.png)


## Editor: Ask Solidity Copilot with ///
In the Editor, when the Solidity Copilot is on, you can ask it a coding question with the `///` prompt.
For example:

```
/// write a function that returns an array with 3 elements from the function's parameters
```

## Terminal Queries to AI

### ChatGPT Query Example
`gpt In Solidity what is the goal of modifiers?`

### Solcoder Queries 
`sol-gpt What is the goal of modifiers?`

## Compilers: Explain Error
In the compiler error "cards" of both the Solidity compiler and the Vyper compiler there is a button to "Ask ChatGPT".

![](images/a-ai-solcomp1.png)

## Solidity Copilot Settings

![](images/a-ai-settings.png)

The settings for Solidity Copilot are in Remix's Settings panel. These settings are primarily for the code completion functions.

There are two settings for Solidity Copilot:

### Maximum words 
Max words sets the maximum number of words that will be returned. The fewer the words, the more likely that a context-accurate answer will be returned and the quicker the response time.

### Temperature
Temperature is an advanced setting. As the setting is increased, the range of possible answers will increase. A higher number is more likely to return a relevant answer.
