File Explorer
=============

To get to the File Explorer module - click the File Explorer icon.

![](images/a-file-explorer1.png)

File Storage
------------
By default, Remix IDE stores files in **indexDB**.  

Coding in Remix IDE Online is different from writing in a Google doc. Yes, both are written in a browser but a Google doc saves your work to Google’s servers, and Remix—out of the box—only saves your code to your browser’s storage. So tread carefully, browser storage is not permanent!

**Important Note:** Clearing the browser storage & indexDB will **permanently delete** all the files stored there. 

## File Storage outside of the browser and Version Control

If you want to use browser storage, but also to save a git repo on IPFS, use the **DGIT** plugin.  

If you want to store files on your computer's filesystem, use **[Remixd](remixd.html)** or use the **[desktop version of Remix-IDE](https://github.com/ethereum/remix-desktop/releases/)**. Remixd enables you to have access to a selected folder on your hard drive. Remix Desktop is a version of Remix-IDE in an Electron app. 

File Explorer Tour
-------------------

![](images/a-fe-tour.png)

The book icon - **F.** is the link to the documentation (this page).

### Workspaces
Workspaces help to organize your files by allowing you to separate your projects.
Here are the basic operations of managing a Workspace. The letters in bold below refer to the labels in fig. 1.

- **A.** Add a Workspace <br>
- **B.** Rename a Workspace  <br>
- **C.** Delete a Workspace  <br>
-  **D.** Download all Workspaces This will create a .zip file with all the files of all the Workspaces.  The zip file will have a folder called **.workspaces** that will contain a folder of each workspace.  Depending on your OS, you may need to change the preferences on .workspaces folder to make it visible.  <br>
- **E.** Upload the Workspaces backup made from the previous icon. <br>
- **K.** Choose a Workspace <br>

When you create a new Workspace, a modal comes up where you choose which template of files to include.

![](images/a-workspace-templates.png)

### File Manipulation
The letters in bold below refer to the labels in fig. 1.

- **G.** Create a file  <br>
- **H.** Create a folder  <br>
- **I.** Publish the Workspace to a GIST <br>
- **J.** Load a local file into the current Workspace<br>

## File Manipulation

Click on the new file icon (**G.**), an input for a new the file’s name will appear in the **Explorer**. Once a name is entered, the new empty file will open in the Editor.

![](images/a-file-explorer-new-file2.png)

When you click on the new file icon, the new file will be placed in the currently selected folder. If a file and not a folder is selected then the new file will be placed in that file’s folder. And if nothing is selected, then the file will be placed in the root of the current workspace's folder. Or to be brief — just be mindful of what folder it lands in.

Publish to Gist
---------------

The icon (marked **I.** in fig.1) publishes all files from the current Workspace to a gist.

Gist API **requires** users to be authenticated to be able to publish a gist.  

Click [this link](https://github.com/settings/tokens) to Github tokens setup and select Generate new token. Then check the **Create gists** checkbox and generate a new token. Also make sure you check the box to enable the creation of Gists with this token.

Take the token and paste it in Remix's **Settings** module in the **Github Access Token** section. And then click Save. **For the moment**, after saving, in order for the token to be registered, you will need to refresh Remix. In an upcoming release, it will not be necessary to do the refresh.

Right-Click on a File
----------------------

![](images/a-file-ex-rt-click.png)

Right-clicking on a file will give you a context menu — offering you the possibility to delete or rename the file. 

You can rename or delete a selected file or a folder. You can also create a folder. 

Right-Click on a Folder
------------------------
To create a file with the context menu, right-click on a folder to get the **Create File** option. A file will be created inside that folder. 

![](images/a-file-ex-rt-click-folder.png)

The functionality of the context menu also works with RemixD (which gives you have access to a folder on your hard drive).  

**Note:** When working with RemixD, you need to open and close the **localhost** folder to refresh the view.

Right-Click on a Script
------------------------

![](images/a-file-ex-rt-click-script.png)

Right-click on any file with a .js extension to get the **Run** option in the context menu to run the script.  The **Run** in the context menu is a shortcut.  The other way to get a script to run is to:
1. Click on the script to make it the active tab in the editor 
2. Input the command `remix.exeCurrent()` in the console.
