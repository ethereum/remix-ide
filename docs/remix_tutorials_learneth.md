# Tutorials in Remix

**Learneth** is a tutorial platform integrated into Remix.

Tutorials can contain quizzes for testing students' work. These quizzes are run by Solidity Unit Tests.

![](images/a-learneth.png)

We have a growing set of tutorials on our repo- but anyone can build tutorials on their own repos and have their students load them up!

The tutorials contain .md files for instructions and can also contain example files, Solidity Unit Test files for quizzes, as well as answer files for quizzes.

## Opening Learneth & associated links

Learneth is a plugin - so to access it, you need to activate the Learneth plugin in the Plugin Manager. Alternatively - this link will active it: click this link.

```
https://remix.ethereum.org/?#activate=udapp,solidity,LearnEth
```

This link will activate Learneth and then will open a specific tutorial - in this case it will load the **proxy contract** tutorial:

```
https://remix.ethereum.org/?#activate=udapp,solidity,LearnEth&call=LearnEth//startTutorial//ethereum/remix-workshops//master//proxycontract
```

**NOTE:** For other tricks about Remix URLs with parameters, go here: {doc}`locations </locations>`.

### Learneth Tutorials

Here is the current list of Learneth Tutorials

**_Beginner_**

    Remix Basics
    Intro to Solidity

**_Intermediate_**

    Basic Use of web3.js
    The Recorder

**_Advanced_**

    All About Proxy Contracts
    Deploy with Libraries
    Opcodes in the Debugger

### Learneth & Tutorial Repos

The code for the Learneth plugin is located here:
https://github.com/bunsenstraat/remix-learneth-plugin/blob/master/docs/index.rst

Documentation for creating your own tutorials is located here:
https://remix-learneth-plugin.readthedocs.io/en/latest/index.html

Remix maintains and curates this repo of Learneth tutorials:
https://github.com/ethereum/remix-workshops
