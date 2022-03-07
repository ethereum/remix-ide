[![Documentation Status](https://readthedocs.org/projects/docs/badge/?version=latest)](https://remix-ide.readthedocs.io/en/latest/index.html)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/ethereum/remix-ide)

# Remix

This repository contain only Remix's official [Read the Docs](https://readthedocs.org/) documentation source code. Documentation is available [here](https://remix-ide.readthedocs.io/en/latest/).

**If looking for Remix IDE codebase, it has been moved to https://github.com/ethereum/remix-project**

## About Remix Project

Remix Project is a platform for development tools that use a plugin architecture. It encompasses sub-projects including Remix Plugin Engine, Remix Libraries, and of course Remix IDE.

Remix IDE is an open source web and desktop application. It fosters a fast development cycle and has a rich set of plugins with intuitive GUIs. Remix is used for the entire journey of contract development with Solidity language as well as a playground for learning and teaching Ethereum.

Start developing using Remix on browser, visit: https://remix.ethereum.org

For desktop version, see releases: https://github.com/ethereum/remix-desktop/releases

Remix libraries work as a core of native plugins of Remix IDE. Read more about libraries [here](https://github.com/ethereum/remix-project/blob/master/libs/README.md)

![Remix screenshot](remix_screenshot.png)

## Build

Steps to build this project as as:
```
pip3 install sphinx sphinx_rtd_theme
pip3 install recommonmark
git clone https://github.com/ethereum/remix-ide.git
cd docs/
make html
```

Go to `docs/_build/html` ann open `index.html` on the browser.

## Contributing

Everyone is very welcome to contribute. Suggestions, issues, queries and feedbacks are our pleasure. Please reach us on [Gitter](https://gitter.im/ethereum/remix) in case of any query.


