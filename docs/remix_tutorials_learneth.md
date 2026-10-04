---
myst:
  html_meta:
    "description": "Learn Ethereum and Solidity development with interactive tutorials through the LearnEth plugin integrated in Remix IDE."
    "keywords": "remix tutorials, learneth, solidity learning, ethereum development, blockchain tutorials"
---

# Tutorials in Remix

You can do tutorials around blockchain development on Ethereum using the **LearnEth** plugin, a tutorial platform integrated into Remix.

Some tutorials contain quizzes run by the Solidity Unit Tests plugin to test how much you learned from the tutorial.

![LearnEth Plugin](images/remix_tutorials/a-learneth.png)

The tutorials contain `.md` files for instructions and can also contain example files, Solidity Unit Test files for quizzes, as well as answer files for quizzes and when you finish a tutorial, it will be marked "Completed".

## Using the LearnEth plugin

To open LearnEth, you need to activate the LearnEth plugin in the Plugin Manager. Alternatively, you can activate it by clicking the link below which automatically opens the Remix IDE with LearnEth enabled.

```text
https://app.remix.live/?#activate=udapp,solidity,LearnEth
```

```{tip}
For other tricks about Remix URLs with parameters, visit {doc}`locations. </locations>`

```

When you open a LearnEth tutorial, the example files associated with it will be loaded into a new Workspace called "LearnEth Tutorials".

![LearnEth Layout](images/remix_tutorials/learneth-layout.png)

### Loading LearnEth with Other Repositories

We have a growing set of tutorials on our default LearnEth content source. However, anyone can build tutorials on their own repositories load them in the LearnEth plugin and it would work as it if were our default content source.

![Import Repository into LearnEth](images/remix_tutorials/import-repo.gif)

```{important}
Your repository must follow the LearnEth conventions to work on LearnEth. Learn how to [create your own LearnEth tutorials](https://remix-learneth-plugin.readthedocs.io/en/latest/index.html).
```

### Useful LearnEth Links

- LearnEth Plugin source code: [LearnEth Plugin repository](https://github.com/bunsenstraat/remix-learneth-plugin/)
- Default LearnEth content source: [Remix Workshops repository](https://github.com/remix-project-org/remix-workshops)
