Debugger
========

The Debugger shows the contract's state while stepping through a transaction.  

It can be used on transactions created on Remix or by providing a transaction's hash.  The latter assumes that you have the contract's source code or that you have input the address of a verified contract.

To start a debugging session either:
 * **Click** the debug button in the Terminal when a successful or failed transaction appears there. The Debugger will be activated and will gain the focus in the **Side Panel**.

 * **Activate** the Debugger in the Plugin Manager and then click the bug in the icon panel. To start the debugging session, input the address of a deployed transaction - while having the source code in the editor and then click the **Start debugging** button.

 The debugger will highlight the relevant code in the Editor.  If you want to go back to editing the code without the Debugger's highlights, then click the **Stop Debugging** button.

To learn more about how to use this tool go to the [Debugging Transactions](tutorial_debug.html) page.

This page will go over the Debugger's *Use generated sources* option, its navigation and its panels.

![](images/a-debugger-overview.png)

### Use generated sources
This option is available for contracts using Solidity 0.7.2 or greater. See the solidity blog for more details about [generated sources](https://blog.soliditylang.org/2020/09/28/solidity-0.7.2-release-announcement/#notable-new-features).

Using **generated sources** will make it easier to audit your contracts.  When the option is checked, you can step into those compiler outputs — while debugging. 

![](images/a-debug-use-gen-sources.png)

These compiler outputs will appear in a separate .yul file in the Remix editor.

## The Debugger's Navigation
### Slider & buttons
![](images/a-debug-nav.png)

#### Slider 
Moving the slider will highlight the relevant code in the **Editor**. On the most granular level, it scrolls through a transaction's opcodes (**see the opcode section below**). At each opcode, the transaction's state changes and these changes are reflected in the **Debugger's panels**.

#### Step over back 
This button goes to the previous opcode.  If the previous step involves a **function call**, function will not be entered.
#### Step back
This button steps back to the previous opcode.
#### Step into
This button advances to the next opcode. If the next line contains a function call, **Step into** will go into the function.
#### Step over forward
This button advances to the next opcode.  If the next step involves a **function call**, function will not be entered.
#### Jump to the previous breakpoint
Breakpoints can be placed in the gutter of the Editor. If the current step in the call has passed a breakpoint, this button will move the slider to the most recently passed breakpoint.

#### Jump out
When you are in a call and click on this button, the slider will be moved to the end of the call.

#### Jump to the next breakpoint
If a breakpoint is ahead in the code, this button will advance to that point.

## The Debugger's Panels
### Function Stack
The Function stack lists the functions that the transaction is interacting with.

![](images/a-debug-func-stack.png)
### Solidity Locals
The Solidity Locals are the local variables inside a function.

![](images/a-debug-sol-locals.png)

### Solidity State
These are the state variables of the contract.

![](images/a-debug-sol-state.png)

### Opcodes
This panel shows the step number and the **opcode** that the debugger is currently on.

![](images/a-debug-opcodes1.png)

As you drag the **slider** (which is above the navigation buttons), the focused step number & opcode changes.
### Step details
Step details shows more info about the opcode step.  

![](images/a-debug-step-detail.png)
### Stack
This panel shows the EVM Stack.

![](images/a-debugger-panel-stack.png)

For more info about the [stack](https://en.wikipedia.org/wiki/Stack_(abstract_data_type)).
### Memory

Memory is cleared for each new message call. Memory is linear and can be addressed at byte level. **Reads** are limited to a width of 256 bits while **writes** can be either 8 bits or 256 bits wide. 

The Memory panel consists of 3 columns.  You might need to make Remix's side panel a bit wider to get the formatting to be correct. (Drag the border between the main panel and the side panel to the right).

The 1st column is the location in memory.  The 2nd column is the hex encoded value.  The 3rd column is the decoded value.  If there is nothing, then the question marks (**?**) will show - like this:
```
0x10: 00000000000000000000000000000000 ????????????????
```

Here is a full example of the **Memory** panel,

![](images/a-debugger-memory.png)

Some address slots have hex encoded values and those values are then decoded.  For example, check position **0xa0** and **0x140**.
### Storage
This is the persistent storage.

![](images/a-debug-storage.png)

### Call Stack
All computations are performed on a data array called the **call stack**. It has a maximum size of 1024 elements and contains words of 256 bits.

![](images/a-debug-call-stack.png)
### Call Data
The call data contains the functions parameters. 

![](images/a-debug-call-data.png)
### Return Value
The refers to the value that the function will return.

![](images/a-debug-return.png)
### Full Storage Changes
This shows the persistent storage at the end of the function.

![](images/a-debug-full-store-change.png)
## Breakpoints
Breakpoints can be placed in the gutter of the Editor to pause the debugger.

## Additional Info
The debugger's granular information gives users detailed information about what is happening in a transaction - so not only is the debugger good for debugging, it is also an excellent teaching tool.

To learn about using the debugger, go to [Debugging Transactions](tutorial_debug.html).
