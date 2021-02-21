Remixd: Access your Local Filesystem 
=========================================
To give the Remix-ide (the web app) access to a folder on your local computer, you need to use `remixd`.  

`remixd` is both the name of an npm module and the name of a Remix-plugin.  You need to install the plugin (from the plugin manager) and you need to install the `remixd` npm module. 


**NOTE: you need to install the remixd npm module & Run its command before activating the remixd plugin.**

The code of `remixd` is
[here](https://github.com/ethereum/remix-project/tree/master/libs/remixd) .

### remixd Installation
`remixd` can be globally installed using the following command:
`npm install -g @remix-project/remixd`

Or just install it in the directory of your choice by removing the -g flag:
`npm install @remix-project/remixd`

**NOTE: The npm address of remixd has moved - it had been in its own repo but now it is under remix-project.**
Please update to the latest remixd by:
1. uninstall the old one: npm uninstall -g remixd
2. install the new: npm install -g @remix-project/remixd
### remixd Command
From the terminal, the command `remixd -s <absolute-path-to-the-shared-folder> --remix-ide <your-remix-ide-URL-instance>` will start `remixd` and will share the given folder with remix-ide. 

For example, to use remixd with Remix IDE at https://remix.ethereum.org, use this command: 
`remixd -s <absolute-path-to-the-shared-folder> --remix-ide https://remix.ethereum.org`

Make sure that if you use https://remix.ethereum.org (**secure http**) in the remixd command (like in the example above), that you are also pointing your browser to https://remix.ethereum.org and not to http://remix.ethereum.org (plain old insecure http).  Or if you want to use http in the browser use http in the remixd command.

The folder is shared using **a websocket connection** between `Remix IDE`
and `remixd`.

Be sure the user executing `remixd` has read/write permission on the
folder.

There is an option to run remixd in read-only mode, use `--read-only` flag.

### Warning!
- `remixd` provides `full read and write access` to the given folder for `any
application` that can access the `TCP port 65520` on your local host.

- To minimize the risk, Remixd can only bridge between your filesystem and the Remix IDE URLS - including:

```
  http://remix-alpha.ethereum.org
  http://remix.ethereum.org
  https://remix-alpha.ethereum.org
  https://remix.ethereum.org
  package://a7df6d3c223593f3550b35e90d7b0b1f.mod
  package://6fd22d6fe5549ad4c4d8fd3ca0b7816b.mod
  https://ipfsgw.komputing.org
```
(the package:// urls are for remix desktop)

### After the command is running, activate the remixd plugin.
From `Remix IDE`, in the Plugin Manager, activate the remixd plugin.  This plugin is a **websocket plugin** and it has no UI other than a modal dialog box.

This modal will ask confirmation

Accepting this dialog will start a session.

If you do not have `remixd` running in the background - another modal will open up and it will say: 

```
Cannot connect to the remixd daemon. 
Please make sure you have the remixd running in the background.
```

Assuming you don't get the 2nd modal, your connection to the remixd daemon is successful. The shared folder will be available in the file explorer.

**When you click the activation of remixd is successful - there will NOT be an icon that loads in the icon panel.**

Click the File Explorers icon and in the swap panel you should now see the folder for `localhost`.

Click on the `localhost connection` icon:

![](images/a-remixd-success.png)


