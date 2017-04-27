'use strict'

var TRAVIS_JOB_NUMBER = process.env.TRAVIS_JOB_NUMBER

module.exports = {
  'src_folders': ['test-browser/tests'],
  'output_folder': 'reports',
  'custom_commands_path': '',
  'custom_assertions_path': '',
  'page_objects_path': '',
  'globals_path': '',

  'test_settings': {
    'default': {
      'launch_url': 'http://ondemand.saucelabs.com:80',
      'selenium_host': 'ondemand.saucelabs.com',
      'selenium_port': 80,
      'silent': true,
      'username': 'yanneth',
      'access_key': '1f5a4560-b02b-41aa-b52b-f033aad30870',
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
        'platform': 'OS X 10.10',
        'version': '8.0',
        'acceptSslCerts': true,
        'build': 'build-' + TRAVIS_JOB_NUMBER,
        'tunnel-identifier': 'browsersolidity_tests_' + TRAVIS_JOB_NUMBER
      }
    },

    'ie': {
      'desiredCapabilities': {
        'browserName': 'internet explorer',
        'javascriptEnabled': true,
        'acceptSslCerts': true,
        'version': '11',
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
