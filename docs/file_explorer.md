File Explorers
=============

To get to the File Explorers module - click the file explorers icon.

![](images/a-file-explorer1.png)

By default Remix IDE **ONLY** stores files in your browser's local storage.  It is possible to go beyond this default behavior - see the **Important Note** below.

The files explorer's **browser folder** has a sample project in it. The files are stored in your browser's **browser storage**.

If you open Remix IDE and you do not see the sample project (like in the image above), they will appear when all the files in the File Explorer are erased or when the cache is cleared.

**Important Note:** Clearing the browser storage will **permanently delete** all the
solidity files stored there. This is an inherent limitation of a browser-based IDE.  However, if you want to store files outside of the browser and on your computer's filesystem, use [RemixD](remixd.html) or use the [desktop version of Remix-IDE](https://github.com/ethereum/remix-desktop/releases/). RemixD enables you to have access to a selected folder on your hard drive. Remix Desktop is a version of Remix-IDE in an Electron app. Furthermore you can use the DGIT plugin to save a git repo of your files in IPFS.

You can rename, remove or
add new files to the file explorer.

![](images/a-file-explorer-buttons.png)

We will start by reviewing the icons in the image above.

The book icon - **A.** is the link to the module's documentation.

The icons to the right of the **browser** file explorer in the image above only appear for browser storage. 

Create new File
---------------

Click on the new file icon, an input for a new the file’s name will appear in the **Explorer**. Once a name is entered, the new empty file will open in the Editor.

![](images/a-file-explorer-new-file2.png)

When you click on the new file icon, the new file will be placed in the currently selected folder. If a file and not a folder is selected then the new file will be placed in that file’s folder. And if nothing is selected, then the file will be placed in the root of the browser folder. Or to be brief — just be mindful of what folder it lands in.

Create a folder
---------------

The icon marked **C.** above.  Creates a new folder in **browser** file explorer.

Publish to Gist
---------------

The icon marked **D.** above. Publishes all files from the browser folder to a gist.  Only file in the root of **browser** will be published.  Files in subfolders will not be publish to the Gist.
Gist API **requires** users to be authenticated to be able to publish a gist.

Click [this link](https://github.com/settings/tokens) to Github tokens setup and select Generate new token. Then check the **Create gists** checkbox and generate a new token.

Take the token and paste it in Remix's **Settings** module in the **Github Access Token** section. And then click Save. For the moment, after saving, in order for the token to be registered, you will need to refresh Remix. In an upcoming release, it will not be necessary to do the refresh.

Upload to Browser Storage
---------------

Click the icon marked **E.** to upload a file from your computer's file system to your browser's local storage.

Right Click on a File
----------------------

![](images/a-file-ex-rt-click.png)

Right clicking on a file will give you a context menu — offering you the possibility to delete or rename the file. 

You can rename or delete a selected file or a folder. You can also create a folder. 

Right Click on a Folder
------------------------
To create a file with the context menu, right click on a folder to get the **Create File** option. A file will be created inside that folder. 

![](images/a-file-ex-rt-click-folder.png)

The functionality of the context menu also works with RemixD (which gives you have access to a folder on your hard drive).  

**Note:** When working with RemixD, you need to open and close the **localhost** folder to refresh the view.

Right Click on a Script
------------------------

![](images/a-file-ex-rt-click-script.png)

Right click on any file with a .js extension will give the **run** option in the context menu.  The **run** shortcut is equivalent to getting the script file to be the active tab in the editor and then running the command `remix.exeCurrent()` in the console.