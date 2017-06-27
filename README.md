[![Build Status](https://travis-ci.org/ethereum/browser-solidity.svg?branch=master)](https://travis-ci.org/ethereum/browser-solidity)

# Remix

Remix (aka. Browser-Solidity) is a browser-based Solidity compiler and IDE.

Visit [https://remix.ethereum.org](https://remix.ethereum.org) to use;
it will always deliver the latest version.

## Offline Usage

The `gh-pages` branch always has the latest stable build of Remix. It also contains a ZIP file with the entire build. Download it to use offline.

Note: it contains the latest release of Solidity available at the time of the packaging. No other compiler versions are supported.


## INSTALLATION:

Install npm and node.js (see https://docs.npmjs.com/getting-started/installing-node), then do:

    * `git clone https://github.com/ethereum/browser-solidity`
    * `cd browser-solidity`
    * `npm install` - fetch dependencies & executes `npm run prepublish` to build the application

## DEVELOPING:

Run `npm start` and open `http://127.0.0.1:8080` in your browser.

Then open your `text editor` and start developing.
The browser will automatically refresh when files are saved

## TESTING
Register new unit test files in `test/index.js`.
The tests are written using [tape](https://www.npmjs.com/package/tape)

1. **Unit Testing**
  - Run the unit tests via: `npm test`
2. **Local Browser Testing**
To serve the app through a local web server and run the Selenium tests via Nightwatch:
	- `npm run test-browser` for local browser tests
3. **Saucelabs Browser Testing**
To prepare and execute tests remote via sauce labs you need to open **`.env` file and follow the instructions there** so later you can always:
	- login to [saucelabs dashboard](https://saucelabs.com/beta/tunnels) and run one of the following options:
		- `npm run test-sauce chrome`
		- `npm run test-sauce firefox`
		- `npm run test-sauce safari`
		- `npm run test-sauce ie`
		- `npm run test-sauce` (=== `npm run test-sauce parallel`)

## Usage as a Chrome Extension

If you would like to use this as a Chrome extension, you must either build it first or pull from the `gh-pages` branch, both described above.
After that, follow these steps:

- Browse to `chrome://extensions/`
- Make sure 'Developer mode' has been checked
- Click 'Load unpacked extension...' to pop up a file-selection dialog
- Select your `browser-solidity` folder

### Troubleshooting building

Here are some things to consider if you have trouble building the package.

- Make sure that you have the correct version of `node`, `npm` and `nvm`.  
You can find the version that is tested on Travis CI by looking at the log in the [build results](https://travis-ci.org/ethereum/browser-solidity).

Run:
- `node --version`
- `npm --version`
- `nvm --version`
