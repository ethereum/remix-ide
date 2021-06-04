Hardhat Integration
============

Remixd and Hardhat
------------------

**Note:** If you have not used `remixd` before, read more about it [here](./remixd.html)

If `remixd` is running locally on device and shared folder is a hardhat project, one more websocket listener will be running on port `65522`. Definition of a hardhat project, according to its documentation:

> _Hardhat projects are npm projects with the hardhat package installed and a hardhat.config.js file._

Remixd hardhat listener is a websocket plugin similar to remixd and is used to perform Hardhat actions with Remix IDE. 

It doesn't need any extra installation as it is shipped with [remixd NPM](https://www.npmjs.com/package/@remix-project/remixd) module.

![](images/a-hardhat-remixd.png)

Enable Hardhat Compilation
------------------

Hardhat Provider
------------------


