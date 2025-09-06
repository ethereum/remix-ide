# Remix Workspaces

Workspaces in Remix are special folders that separate projects. Files in one workspace cannot import or access files in different workspace. You can select a workspace from the **Workspaces** dropdown on the Top Bar.

![Remix IDE Workspaces highlighting the dropdown.](images/workspaces/a-fe-workspaces1.png)

## Creating a new Workspace

You can create a new workspace by clicking the Workspaces dropdown and click the "**Create a new workspace**" button.

![Workspaces dropdown highlighting the Create new workspace button](images/workspaces/a-fe-workspaces-new.png)

When you click the button, Remix takes you to the Workspace Templates page, where you can create a blank workspace or a workspace from a list of available templates. The available templates include but are not limited to the following:

- Remix Generic templates
- OpenZeppelin templates (ERC20, ERC721, ERC1155)
- Cookbook.dev templates
- Gnosis Safe MultiSig template
- Zero-Knowledge Proof (ZKP) templates (Circom, Noir, and Generic)
- Uniswap v4 templates
- Solidity CREATE2 templates
- Etherscan scripts for verifying contracts
- CI scripts for unit tests and security analysis

When you click the "**Create**" the button, a modal with customization options will popup. The options differ depending on the template you choose.

For example, when you create a Workspace with an OpenZeppelin template, you can add customize the features of the contract you create. The image below shows the options available for customizing an OpenZeppelin ERC721 contract template.
![OpenZeppelin ERC721 contract template.](images/workspaces/a-fe-modal-oz.png)

For other templates, the modal only contains a textbox for editing the Workspace name and an option to initialize it with Git.

![Create Workspace with template modal](images/workspaces/create-workspace-with-template-modal.png)

### Initializing a Workspace with Git

To initialize a new Workspace for Git, check the box at the bottom of the Create Workspace modal.
![Create Workspace with template modal with Initialize Workspace with Git highlighted.](images/workspaces/a-fe-create-ws-modal.png)

Git initialized workspaces will have the Git icon next to them in the **Workspaces** selectbox.

![Workspaces initialized with Git](images/workspaces/a-fe-select-git.png)
