# AI Tools

Remix has its own AI tool named **RemixAI** and a sub-project called **RemixAI Copilot** for code completion.

RemixAI is also used in the:

- **Explain contract** icon at the button of the Main Panel when a .sol file is active.
- **Explain this error** button when an error is thrown in the Solidity Compiler
- **Right-click menu options** of the Editor
- **Triple slash** (///) for prepending an AI code request in a file in the Editor

## Code Completion

When you type a space or a new line, the RemixAI Assistant will propose some code. The proposed code is a technique called, **code completion**. The RemixAI Assistant's suggested code will take into account what has already been written in the file.

The switch to activate it is at the bottom left of the Main Panel when a file is active.

![Remix AI Copilot button.](images/ai/a-ai-switch.png)

All other RemixAI tools are always on.

## Editor: Right-click Menu

When you right-click a function, a popup menu appears with some options executed by the RemixAI. They include, **Explain this function**, **Explain this code**, and **Generate documentation**.

![Remix AI right click menu.](images/ai/a-ai-editor-popup-menu.png)

```{note}
For both **Explain this function** or **Explain this code**, the answer will be printed out in Remix's Terminal.
```

The "Explain this code" option in the Editor's Right-click menu can be triggered with, or without, highlighting a block of code. If some code has not been highlighted, RemixAI will take into account the code surrounding the cursor.

## Editor: Code Completion

As explained above, with the RemixAI Copilot switched on, when you put a space after a word or make a new line, the Copilot will make a suggestion.

![RemixAI completion proposal.](images/ai/a-ai-completion-proposal.png)

Hit tab to accept the suggestion.

![RemixAI accepted completion.](images/ai/a-ai-completion-accepted.png)

## Editor: Ask RemixAI with ///

In the Editor, when the Solidity Copilot is on, you can ask it a coding question with the `///` prompt.
For example:

```text
/// write a function that returns an array with 3 elements from the function's parameters
```

## Terminal Queries using RemixAI

Before your question, either type `gpt` or `sol-gpt`.

For example:

```text
sol-gpt What is the goal of modifiers?
```

## Compilers: Explain Error

In the compiler error "cards" of both the Solidity Compiler and the Vyper compiler there is a button to "Ask RemixAI".

![Compiler Explain Error](images/ai/a-ai-solcomp1.png)
