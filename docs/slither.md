Slither Integration
============

_(Supported since Remix IDE v0.15.0 and Remixd v0.4.3)_

Remixd and Slither
------------------

**Note:** If you have not used `remixd` before, read more about it [here](./remixd.html)

Since Remixd `v0.4.3`, when `remixd` is running locally on your device, an additional websocket plugin will be listening on port `65523` which will be dedicated for [Slither](https://github.com/crytic/slither) integration.

> _Slither is a Solidity static analysis framework written in Python 3. It runs a suite of vulnerability detectors, prints visual information about contract details, and provides an API to easily write custom analyses._

The remixd Slither listener is a websocket plugin similar to remixd and is used to perform Slither analysis with Remix IDE. 

It doesn't need any separate installation as it is shipped with [remixd NPM](https://www.npmjs.com/package/@remix-project/remixd) module.

![](images/a-slither-remixd.png)

Enable Slither Analysis
------------------

If a project is shared through remixd and `localhost` workspace is loaded in Remix IDE, there will be an extra checkbox shown in `Solidity Static Analysis` plugin with the label `Enable Slither Analysis`.

![](images/a-slither-analysis.png)

One can check this box to run the analysis using Slither along with the Remix. 

Generated report of Slither analysis will be stored locally on project root with a file name prefixed with `remix-slitherReport_`, for example: `remix-slitherReport_1627362090.json`. This report will also be displayed on the Remix IDE side after the Remix analysis report for better user readability.

![](images/a-slither-analysis-success.png)

The result of the analysis will be shown in the Remix IDE terminal 

![](images/a-slither-analysis-success-terminal.png)

and also in the **remixd** console.

![](images/a-slither-analysis-success-remixd.png)




