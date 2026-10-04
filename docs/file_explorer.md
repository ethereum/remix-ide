---
myst:
  html_meta:
    "description": "Manage your smart contract files in Remix IDE using the File Explorer — create, rename, delete, and organize files and folders."
    "keywords": "remix file explorer, file management, remix ide files, workspaces"
---

# File Explorer

The File Explorer is the plugin responsible for managing files. It includes a pop-up menu that is activated when you right-click on a file.

![Remix Side Panel showing the File Explorer and the Icon Panel highlighting the File Explorer icon.](images/file-explorer/a-file-explorer1a.png){.fig--landscape}

The green shield icon at the top of the File Explorer page on the Sidebar indicates that the plugin is maintained by Remix Team. When you click the caret next to the icon, the Sidebar will display details about the plugin, including a link to its documentation page.

![Remix Team shield icon and caret.](images/file-explorer/a-fe-top-caret.png){.fig--landscape}

## File storage

By default, Remix IDE stores files in **IndexedDB**, a database built into the browser. Your data is only stored locally in your browser and not on an external server.

Browser storage is ephemeral and browser crashes might lead to complete loss of data

Thus, it is important to have an alternative file backup/saving strategy.

**Some recommended strategies include:**

- [Enabling Cloud storage](#cloud-storage)
- [Using Remix Desktop](#remix-desktop)
- Using [remote Git repositories](#connecting-remix-to-remote-git-repositories)

### Cloud storage

```{note}
Cloud storage is currently only available to users in our beta program.
```

Enabling cloud storage on Remix web saves your work to your Remix account, auto-syncing every change so nothing is lost to browser crashes. Your files are available on any device when you are logged in.

Snapshots of your workspace are taken automatically as you work. Each snapshot captures the workspace state at a single point in time and is not a complete backup; it may be seconds to minutes behind your actual files. Each snapshot is kept for 7 days before being removed. You can download all snapshots currently within that window as a single zip file to inspect locally.

To enable cloud storage, click the switch at the top left of the Top Bar as shown in the image below.

![Cloud storage toggle switch highlighted in the Remix Top Bar.](images/file-explorer/cloud-storage.png)

When you enable cloud storage, the files saved on your browser do not get moved to cloud automatically. If you want to migrate the files saved to your browser storage to cloud, click the Workspaces dropdown, and click "migrate local workspaces to cloud".

![Open Workspaces dropdown with the migrate local workspaces to cloud option highlighted.](images/file-explorer/move-local-to-cloud.png)

You will see a list of all the workspaces in your browser storage, choose the ones you want to migrate and click the "Migrate" button.

![Migrate Workspaces to Cloud dialog listing browser workspaces to select.](images/file-explorer/migrate-workspaces.png)

### Remix Desktop

Remix Desktop is a version of the Remix IDE that exists as a native app on your computer instead of a browser app. Since it's a native app on your computer, the files are saved directly to your hard drive. You can download Remix Desktop on [the download page](https://remix.live/desktop).

```{tip}
For more information, see the {doc}`Remix Desktop <desktop/>` documentation.

```

### Connecting Remix to remote Git repositories

Remix IDE supports version control with version control platforms like GitHub (or similar like GitLab) and in the InterPlanetary File System (IPFS), allowing you to store the code you write on remote repositories.

The version control operations are managed with Git through the **Git** plugin. Additionally, you can manage your branches on the Remix IDE using the branch icon that appears at the bottom of the File Explorer after you initialize Git.

![Remix IDE Git branches.](images/file-explorer/git-branches.png)

Also see this article about [securing your files in Remix](https://medium.com/remix-ide/securing-you-file-in-remix-how-to-clone-and-push-f1350111aa13?source=friends_link&sk=a3dbd0d3b0b44a29a28e8c10f8821fde).

### Publishing to a GitHub gist

In addition to these methods, you can also publish your files to a GitHub Gist. This method just takes a snapshot of your project's current state and publishes it to a GitHub gist. Any changes made after publishing it will not update the published Gist.

To use this feature, you need to add a GitHub access token with the "**Create Gist**" permission enabled to Remix because the Gist API requires users to be authenticated to be able to publish a gist.

To generate a GitHub token, visit the [GitHub Settings page](https://github.com/settings/tokens) and select "**Generate new token**". Ensure you tick the **Create gists** checkbox and generate a new token. Copy the token and paste it in Remix's **Settings** module in the **GitHub Access Token** section. And then click "**Save**".

After the initial setup, you can publish a gist by right-clicking on a file (publish the file), folder (publish the folder), or Side Bar (publish the entire workspace) and selecting the "**Publish folder to gist**".

```{tip}
You can publish multiple files by select all of them and right-clicking. The resulting pop-up menu will provide an option to publish them to a gist.
```

## Creating new files

There are two ways you can create files on the Remix IDE. The first way involves clicking the **"Create"** dropdown, selecting the **"New file"** option, and entering the name of the file on the input field that appears.

![Remix File Explorer highlighting the create new file icon.](images/file-explorer/a-file-explorer-new-file2.png){.fig--landscape}

Another way you can create files in Remix is by right-clicking on the Side Bar (creates the file at the root of your project) or right-clicking on a folder in the Side Bar (creates the file in the folder you clicked) and selecting "**New File**" from the dropdown options.

![Remix IDE File Explorer dropdown.](images/file-explorer/file-explorer-dropdown.png)

```{note}
Note that (regardless of the method) when you save a file without providing a file extension, it defaults to the `.sol` extension.
```

## Right-click popup menu

### Right-Click on a folder

Right-clicking on a folder will bring a popup menu for operations you can do on that folder.

![Remix File Explorer extra options.](images/file-explorer/a-fe-rtclick-file.png){.fig--landscape}

### Right-Click on a Solidity file

Right-clicking on a file with a .sol extension will bring up a popup menu - which includes options for compiling & flattening, creating UML diagrams, and generating documentation.

![File Explorer right click on .sol file](images/file-explorer/a-fe-rtclick-sol-file.png)

### Right-Click on a Script

![File Explorer right click on script file](images/file-explorer/a-fe-rtclick-script.png)

Right-click on any file with a `.js` or `.ts` extension to get the **Run** option in the popup menu to run the script.

If the script you want to run is the active file in the Editor, you can also run it by using play button at the top left of the Editor or by inputting the command `remix.exeCurrent()` in the console.
