var sauceConnectLauncher = require('sauce-connect-launcher')
var httpserver = require('http-server')
var npm = require('global-npm')

var spawn = require('child_process').spawn
var fs = require('fs')

cleanup()

if (!process.env.SAUCE_USER || !process.env.SAUCE_GUID) throw new Error('missing credentials')
if (process.env.TRAVIS_JOB_NUMBER === undefined) process.env.TRAVIS_JOB_NUMBER = 'dev'
process.env.TUNNEL_IDENTIFIER = 'browsersolidity_tests_' + process.env.TRAVIS_JOB_NUMBER

// var webserver = spawn('npm', ['run', `_http-serve`], { stdio: 'inherit' })
var TEST = process.argv[2] || 'parallel' // by default runs all tests
var PORT = 8080
var staticHTTP = httpserver.createServer()
staticHTTP.listen(PORT, startSauceLabs)

function startSauceLabs () {

  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@')
  console.log('sc.js', process.env)
  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@')

  console.log(`[STATIC HTTP SERVER] - serving "./" on port ${PORT}`)
  var options = {
    username: process.env.SAUCE_USER, // Sauce Labs username.
    accessKey: process.env.SAUCE_USER, // Sauce Labs access key.
    tunnelIdentifier: process.env.TUNNEL_IDENTIFIER, // Identity the tunnel for concurrent tunnels (optional)
    verbose: true, // false, // Log output from the `sc` process to stdout?
    verboseDebugging: true, // false, // Enable verbose debugging (optional)
    vv: true, // false, // Together with verbose debugging will output HTTP headers as well (optional)
    // port: null, // default: 4445 (optional) Port on which Sauce Connect's Selenium relay will listen for requests

    // proxy: TODO'http://180.183.178.46:8080', // Proxy host and port that Sauce Connect should use to connect to the Sauce Labs cloud. e.g. "localhost:1234" (optional)

    logfile: 'sauceconnect.log', // Change sauce connect logfile location (optional)
    // logStats: null, // Period to log statistics about HTTP traffic in seconds (optional)
    // maxLogsize: null, // Maximum size before which the logfile is rotated (optional)

    // doctor: true, // Set to true to perform checks to detect possible misconfiguration or problems (optional)

    // fastFailRegexps: null, // an array or comma-separated list of regexes whose matches will not go through the tunnel. (optional)
    // directDomains: null, // an array or comma-separated list of domains that will not go through the tunnel. (optional)
    // // an optional suffix to be appended to the `readyFile` name.
    // // useful when running multiple tunnels on the same machine,
    // // such as in a continuous integration environment. (optional)
    readyFileId: 'sc.ready',
    // connectRetries: 0, // retry to establish a tunnel multiple times. (optional)
    // connectRetryTimeout: 2000, // time to wait between connection retries in ms. (optional)
    // downloadRetries: 0, // retry to download the sauce connect archive multiple times. (optional)
    // downloadRetryTimeout: 1000, // time to wait between download retries in ms. (optional)
    // exe: null, // path to a sauce connect executable (optional) by default the latest sauce connect version is downloaded
    // // keep sc running after the node process exited, this means you need to close
    // // the process manually once you are done using the pidfile
    // // Attention: This only works with sc versions <= 4.3.16 and only on macOS and
    // // linux at the moment
    // detached: null,
    // // specify a connect version instead of fetching the latest version, this currently
    // // does not support checksum verification
    // connectVersion: 'latest',
    logger: console.log // function (message) {}, // A function to optionally write sauce-connect-launcher log messages. e.g. `console.log`.  (optional)
  }
  sauceConnectLauncher(options, startTests)
}
function startTests (err, sauceConnectProcess) {
  if (err) throw err
  console.log('[SAUCE CONNECT] - ready to start running tests')
  npm.load({}, runTest)

  function runTest (err, npm) {
    if (err) throw err
    spawn('npm', ['run', `nightwatch_remote_${TEST}`], {
      stdio: 'inherit'
    }).on('close', collectResult)
  }
  function collectResult (err, res) {
    if (err) throw err
    sauceConnectProcess.close(quit)
  }
  function quit () {
    // webserver.kill('SIGHUP')
    console.log('[SAUCE CONNECT] - closing')
    process.exit(0)
  }
}
function cleanup () {
  try { var pid = fs.readFileSync('/tmp/sc_client-test.pid') } catch (e) {}
  if (pid) {
    try { process.kill(pid) } catch (e) {} finally {
      fs.unlink('/tmp/sc_client-test.pid')
    }
  }
}
