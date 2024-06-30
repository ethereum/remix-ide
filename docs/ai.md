AI Tools
========

Remix has its own AI tool named **RemixAI** and a sub-project called **Solidity Copilot** for code completion.  

RemixAI is also used in the: 
- **Explain this contract** icon at the top of the Editor
- **right-click menu options** of the Editor
- **triple slash** (///) for prepending an AI code request in a file in the Editor
- **Explain this error** button in the compiler errors in the Solidity Compiler

## Remix's Solidity Copilot
Solidity Copilot helps in writing code using **code completion**. The switch to activate it is at the top of the Editor.

![](images/a-ai-switch.png)

All other RemixAI tools are always on.

#### Code Completion
When you type a new line or a space, the Solidity Copilot will propose some code.  The proposed code will take into account what is has already been written on in the file.  

Use the Solidity Copilot switch at the top of the Editor to turn off or on the code completion. 

## Editor: Right-click Menu 
![](images/a-ai-editor-popup-menu.png)

In both cases the answer will be printed out in Remix's Terminal.

### Explain a Function and Generate Documentation
In the Right-click menu, select the options **Explain the function** and **Generate documentation**.

### Explain this code
The "Explain this code" option in the Editor's Right-click menu can be triggered with, or without, highlighting a block of code. If some code has not been highlighted, RemixAI will take into account the code surrounding the cursor.

## Editor: Code Completion
With the Solidity Copilot switch on, just start coding. When you put a space after a word or put a new line, the Copilot will make a suggestion.  

[image]

**NOTE: the suggestion will take into account everything that preceded it in this contract.** 
[Stephane is this true or does it look at the entire file?]

![](images/a-ai-completion-proposal.png)

Hit tab to accept the suggestion.

![](images/a-ai-completion-accepted.png)


## Editor: Ask RemixAI with ///
In the Editor, when the Solidity Copilot is on, you can ask it a coding question with the `///` prompt.
For example:

```
/// write a function that returns an array with 3 elements from the function's parameters
```

## Terminal Queries using RemixAI
Before your question, either type `gpt` or `sol-gpt`.  

For example:

`sol-gpt What is the goal of modifiers?`

## Compilers: Explain Error
In the compiler error "cards" of both the Solidity compiler and the Vyper compiler there is a button to "Ask RemixAI".

![](images/a-ai-solcomp1.png)

## Solidity Copilot Settings

![](images/a-ai-settings.png)

The settings for Solidity Copilot are in Remix's Settings panel. These settings are primarily for the code completion functions.

There are two settings for Solidity Copilot:

### Maximum words 
Max words sets the maximum number of words that will be returned. The fewer the words, the more likely that a context-accurate answer will be returned and the quicker the response time.

### Temperature
Temperature is an advanced setting. As the setting is increased, the range of possible answers will increase. A higher number is more likely to return a relevant answer.
