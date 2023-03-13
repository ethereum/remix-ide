Editor
===============

- The Remix uses the Monaco editor.  It is the same editor that VS Code uses.
- Remix saves the current file every 5 seconds. 
- The Remix editor will highlight keywords in Soldiity, JS, and TS.

## Editor displays concerning the Solidity Compiler and the Debugger
The Editor works with the Soldity Compiler to display warnings and errors in the gutter.

It also works with the Debugger for inputting breakpoints as well as for highlighting when stepping through code.

![](images/a-editor-general.png)

## General Operations
Files are open as tabs.  When there are too many tabs to display, scrolling with a mouse wheel will horizontally scroll the tabs.

![](images/a-editor-tabs.png)

- The Play button works on the active tab.  If that is a Solidity file, clicking Play will compile it.  If a TS or JS file is active, Play will run the script.
- The magnifying glass icons (+/-) on the top left corner are to increase/decrease the font size.
- The small type on the far right of the Editor is clickable to jump to a section.

## TypeScript

The Editor and Script Runner support TypeScript, which mean that you can write TypeScript, have some auto-completion, and run it straight from Remix. As stated above, there is syntax highlighting in TS.

The default Workspace contains example TypeScript files.

## Editor & Autocompile
When autocompile is enabled (in the Settings panel), compilation will occur each time the current file is changed or another file is selected. 

![](images/a-editor-settings.png)
## Autocomplete 
Autocompleting Solidity code happens when you type in the Editor. The Compiler will run in the background, and will process any imports you have. You will see these imports appear in the .deps directory in the File Explorer.

![](images/a-editor-autocomplete1.png)

**Tip:** If you start with a Solidity file that has errors, the Compiler might not be able to compile it. In that case, autocomplete features will not fully work until the first time a file is successfully compiled. After that, autocomplete will work even if there are errors, but only for the elements the Compiler already knows the meaning of. But if you add, for example, a new function in a file that has errors, autocomplete will not be able to find that function because it can’t compile the file. 

![](images/a-editor-autocomplete.png)

## Auto complete on imports
The autocomplete will offer the option to bring in OpenZeppelin contracts, Uniswap contracts, and the paths to all the files in the current Workspace.

![](images/a-editor-auto-import1.png)

So then when choosing @openzeppelin, you’ll get this:

![](images/a-editor-auto-oz-import2.png)

And the same with Uniswap:

![](images/a-editor-auto-uni-import3.png)

## Errors and Warnings
You can tell the Compiler is successful if no errors or warnings are displayed in the Editor. Errors are displayed using squiggly lines. A red line indicates an error, a yellow line is a warning.

![](images/a-editor-error-red-squiggles.png)

Hovering over the squiggle line shows you the message from the Compiler.

![](images/a-editor-error-hover.png)

Tabs and the File Explorer will also show you a file has errors or warnings.

![](images/a-editor-errors-tabs-fe.png)

#### Errors on imported files

A file with errors in one of the files that it imports will also triger an error in the editor. Your main file might not compile, but you will see there is a problem straight away.

### Hovering over a error number in the File Explorer
The number of errors in the file is also reported in the File Explorer.  Hovering over the number, which indicates the amount of errors/warnings, will display the information from the Compiler.

![](images/a-editor-error-fe-num.png)


## Gas Estimates

Gas estimates are displayed on the same line where a function is declared. 

![](images/a-editor-i-got-gas.png)

Constructor gas estimates are also displayed, and consist of two components: creation cost and code deposit cost.


## Go to Definition and References

### Definitions
By right-clicking, you can go to a definition. You can also use the shortcut displayed.

You can also right-click on the filename of an import statement and jump to that file.

![](images/a-editor-goto-def.png)

You can also ‘peek’ the definition inline in the editor. You can then jump to a definition by double clicking on the line on the right hand side.

### References
By right-clicking, you can display all the references. You can also use the shortcut displayed.

![](images/a-editor-refs1.png)

You can jump to a reference by double clicking on the line on the right hand side.

![](images/a-editor-ref2.png)
## Highlighted References

References are highlighted in the Editor.

![](images/a-editor-ref-highlight.png)
## Hovering

When you hover over a term with a definition, the definition will pop up. Hovering over code that has triggered an error (underlined with a red squiggly line) will show the error message.

![](images/a-editor-hover.png)
## Files with Errors turn Red

When a file has an error in it, its name will turn red, both in the File Explorer and on its tab at the top of the Editor.

More about the Editor updates in this article: Major Updates to Remix Editor



