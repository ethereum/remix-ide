# Working with Git in Remix

In Remix, you can initialize Git for version control in your workspaces.

## Connecting to GitHub

Before you can use Git in any of your workspaces, you have to login with GitHub using the "**Login with GitHub**" button on the Top Bar.

![Remix Top Bar showing login with GitHub button.](images/git/login-with-github.png)

Alternatively, you can add username and email to the Github section of the Git plugin. You can find the Git plugin on the Icon Panel represented by a branch icon.

![Git plugin settings.](images/git/gh-login-manually.png)

## Git operations in Remix

### Initializing Git in a Workspace

For information about initializing a workspace, see the section about initializing Git on the {ref}`Remix Workspaces <workspaces:initializing a workspace with git>` page.

### Cloning an existing repository into Remix

You can clone an existing repository from GitHub into Remix using "**CLONE**" accordion item in the Git plugin. You can clone a repository by loading it from GitHub using the "**Load from GitHub**" button and selecting one from your list of public repositories.

Alternatively, you can clone a repository by providing its URL in the "**CLONE FROM URL**" text box. When you clone a repository, Remix initializes it as a separate Workspace. See {doc}`Remix Workspaces <workspaces>` to learn more about Workspaces.

```{note}
Remix stores your files in the browser and browser storage is limited. Cloning a repository that is too large will cause the Remix IDE. This is why you have to manually specify the depth and branches you want to clone. If you are using {doc}`Remixd </remixd>` you don't have to worry about cloning large repositories.
```

![Remix Git plugin clone section.](images/git/gh-clone.png)

### Committing changes to Git

You can commit the changes you made to your current Workspace using the "**SOURCE CONTROL**" accordion item in the Git plugin. Stage files individually using the plus icon next to them or all at once using the plus icon on the "**Changes**" dropdown label. Enter commit messages in the text box and commit the staged changes using the "**Commit**" button.

![Remix Git plugin clone section.](images/git/gh-commit.png)

### Adding a remote repository

You can add a remote repository to your Workspace on Remix using the "**REMOTE**" accordion item by either loading from GitHub or adding it manually using a remote URL.

![Remix Git plugin highlighting the REMOTE tool.](images/git/gh-remote-repo.png)

### Running common commands

The Git plugin has limited support for Git commands, as of Remix v0.70, you can run the following:

- `git push`
- `git push --force`
- `git fetch`
- `git pull`

You can run these commands through the "**COMMANDS**" accordion item in the Git plugin.

![Remix Git plugin showing common Git commands.](images/git/gh-git-commands.png)

```{tip}
You can view the output of some of these commands on the "**LOGS**" accordion item.
```

### Managing multiple branches

You can manage the multiple branches associated with your Workspace initialized with Git or cloned from GitHub from the "**BRANCHES**" accordion item.

![Remix Git Plugin showing multiple branches](images/git/gh-git-branches.png)

You can view the current branch from the Footer.

![Remix IDE branch indicator.](images/git/a-fe-branch-man1.png)
