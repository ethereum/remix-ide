---
myst:
  html_meta:
    "description": "Give your deployed smart contract a human readable ENS name from inside Remix IDE."
    "keywords": "ens, contract naming, reverse name, remix ide, ownable, primary name"
---

# Naming Contracts

A contract address like `0xF2F31B340900cDC4561bb3cC999dabDF85c81939` is hard to read and easy to confuse with another. With Remix, you can give a deployed contract an [ENS](https://ens.domains) name such as `ownable.project.remixcontract.eth`, so people can recognize it by name instead.

Remix registers the name on Ethereum L1 for you and pays the gas. You can then set a **reverse name**, which lets block explorers and wallets show the name wherever the contract's address appears.

For background on the ENS side of this, see [Naming contracts](https://docs.ens.domains/web/naming-contracts) in the ENS documentation.

## Before you start

The contract must be **Ownable**, meaning it has an owner account that can sign transactions on its behalf. The simplest way to do this is to inherit OpenZeppelin's `Ownable` contract.

Deploy it to Ethereum L1 or an Ethereum L2. Most of these networks are supported, but testnets such as Sepolia are not.

## Registering the name

In the **Deployed Contracts** section, click the three dots menu on your contract and select **Name Contract (ENS)**.

![Name Contract option in the contract menu](images/naming-contracts/name-contract-menu.png)

Enter a **Label** and a **Project**. The preview shows the full name, in the form `label.project.remixcontract.eth`, along with the address it will point to. Remix also checks whether the name is available. If it's taken, choose a different label or project. Once the name is available, click **Register ENS Name**.

![Label and project fields](images/naming-contracts/label-and-project.png)

When registration finishes, the name resolves to your contract's address. This is called the forward record.

## Setting the reverse name

The forward record points the name to the address. The reverse name points the address back to the name, which is what block explorers and wallets use to display it.

Setting the reverse name takes one transaction on the network your contract is deployed to, signed by the contract owner. Make sure the owner account is selected in Remix, then click **Set Reverse** and confirm the transaction.

If you only need the forward record for now, click **Skip** instead. You can set the reverse name later.

![Set Reverse Name step](images/naming-contracts/set-reverse-name.png)

## Reviewing the result

Whether you set the reverse name or skip it, you end on a summary screen. It shows the name and the address it resolves to, the total gas used and its cost (which Remix pays), and links to the registration transactions. From there, you can open the contract in the block explorer or the name in the ENS App.

![Summary of the named contract](images/naming-contracts/ens-app-link.png)
