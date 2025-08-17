# Navigating Remix

The Remix IDE comprises of three panels: the icon panel, the side panel, and the main panel; and a terminal.

![Layout for Remix IDE, highlighting the terminal, the side, main, and icon panel.](images/layout/a-layout1c.png)

1. Icon Panel - portal to most of Remix's core functions like the Solidity compiler, plugins, and deploy & run.
2. Side Panel - interface for the file explorer, compiler, search page, deploy & run page, and certain plugins.
3. Main Panel - for editing files, large format tools, and the home tab.
4. Terminal - for viewing transaction receipts and various logs.

## Default Tools

When the Remix IDE is loaded for the first time - the icon panel shows these icons by default.

![Remix IDE default icons with annotations.](images/layout/a-icons-at-load.png)

When you load more plugins, that icons automatically appear in the icon panel. To load more plugins go to the **[Plugin Manager](#plugin-manager)** and select a plugin from the list of available plugins.

## Home tab

![Remix IDE Hometab.](images/layout/a-hometab.png)

The home tab is located in the Main Panel. It can be closed, just like any of the main panel tabs. You can also access it (even if closed) by clicking the Remix logo at the top of the icon panel.

The home tab contains links to resources, announcements, tutorials, featured plugins and methods for loading files into Remix and shortcuts for connecting Remix to your local filesystem.

## Solidity Compiler

Clicking the **Solidity button** in the featured plugins section of the home tab will activate **Solidity Static Analysis** and **Solidity Unit Testing** as well as the Solidity Compiler and Deploy & Run (which are there by default).

To see all the plugins go to the **Plugin Manager** - by selecting the plug in the icon panel.
You can also get there by clicking the **Explore all plugins** button from the hometab on the "most used plugins" list.

## Plugin Manager

In Remix, you only need to load the functionality you need - and the Plugin Manager is where you manage what plugins are turned off or on.

The Plugin Manager is also the place you go when you are creating your own plugin and you want to load your local plugin into Remix. In that case you'd click on the "Connect to a Local Plugin" link at the top of the Plugin Manager panel.
