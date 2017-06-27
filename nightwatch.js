if (process.version.slice(1).split('.')[0] < 6) {
  throw new Error('requires nodejs version v6.0.0 or higher')
}

module.exports = {
  'src_folders': ['test-browser/tests'],
  'output_folder': 'reports',
  'custom_commands_path': '',
  'custom_assertions_path': '',
  'page_objects_path': '',
  'globals_path': '',
  // "selenium" : {
  //   "start_process" : true,
  //   "server_path" : "./node_modules/selenium-standalone/.selenium/selenium-server/3.3.1-server.jar",
  //   "log_path" : "reports/selunium",
  //   "port" : 4444,
  //   "cli_args" : {
  //     "webdriver.chrome.driver" : "",
  //     "webdriver.gecko.driver" : "",
  //     "webdriver.edge.driver" : ""
  //   },
  // },
  'test_settings': {
    'default': {
      'launch_url': 'http://ondemand.saucelabs.com:80',
      // 'launch_url': 'http://remix.ethereum.org/',
      'selenium_host': 'ondemand.saucelabs.com',
      'selenium_port': 80,
      //'silent': true,
      'username': process.env.SAUCE_USER,
      'access_key': process.env.SAUCE_GUID,
      'use_ssl': false,
      'globals': {
        'waitForConditionTimeout': 10000,
        'asyncHookTimeout': 100000
      },
      'screenshots': {
        'enabled': false,
        'path': ''
      },
      'desiredCapabilities': {
        'browserName': 'firefox',
        'javascriptEnabled': true,
        'acceptSslCerts': true,
        'build': 'build-' + TRAVIS_JOB_NUMBER,
        'tunnel-identifier': 'browsersolidity_tests_' + TRAVIS_JOB_NUMBER
      }
    },

    'chrome': {
      'desiredCapabilities': {
        'browserName': 'chrome',
        'javascriptEnabled': true,
        'acceptSslCerts': true,
        'build': 'build-' + TRAVIS_JOB_NUMBER,
        'tunnel-identifier': 'browsersolidity_tests_' + TRAVIS_JOB_NUMBER
      }
    },

    'safari': {
      'desiredCapabilities': {
        'browserName': 'safari',
        'javascriptEnabled': true,
        'platform': 'OS X 10.11',
        'version': '10.0',
        'acceptSslCerts': true,
        'build': 'build-' + TRAVIS_JOB_NUMBER,
        'tunnel-identifier': 'browsersolidity_tests_' + TRAVIS_JOB_NUMBER
      }
    },

    'ie': {
      'desiredCapabilities': {
        'browserName': 'internet explorer',
        'javascriptEnabled': true,
        'platform': 'Windows 10',
        'acceptSslCerts': true,
        'version': '11.103',
        'build': 'build-' + TRAVIS_JOB_NUMBER,
        'tunnel-identifier': 'browsersolidity_tests_' + TRAVIS_JOB_NUMBER
      }
    },

    'local': {
      'launch_url': 'http://localhost:8080',
      'selenium_port': 4444,
      'selenium_host': 'localhost',
      'desiredCapabilities': {
        'browserName': 'firefox',
        'javascriptEnabled': true,
        'acceptSslCerts': true
      }
    }
  }
}
