/* global confirm */
'use strict'

var $ = require('jquery')
var Web3 = require('web3')
var EventManager = require('../lib/eventManager')
var EthJSVM = require('ethereumjs-vm')

var injectedProvider

var web3
if (typeof window.web3 !== 'undefined') {
  injectedProvider = window.web3.currentProvider
  web3 = new Web3(injectedProvider)
} else {
  web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
}

var vm = new EthJSVM({ activatePrecompiles: true, enableHomestead: true })
vm.stateManager.checkpoint()

/*
  trigger contextChanged, web3EndpointChanged
*/
function ExecutionContext () {
  var self = this
  this.event = new EventManager()
  var executionContext = injectedProvider ? 'injected' : 'vm'

  this.isVM = function () {
    return executionContext === 'vm'
  }

  this.web3 = function () {
    return web3
  }

  this.vm = function () {
    return vm
  }

  this.setEndPointUrl = function (url) {
    $web3endpoint.val(url)
  }

  this.setContext = function (context) {
    executionContext = context
    executionContextChange(context)
    setExecutionContextRadio()
  }

  var $injectedToggle = $('#injected-mode')
  var $vmToggle = $('#vm-mode')
  var $web3Toggle = $('#web3-mode')
  var $web3endpoint = $('#web3Endpoint')

  if (web3.providers && web3.currentProvider instanceof web3.providers.IpcProvider) {
    $web3endpoint.val('ipc')
  }

  setExecutionContextRadio()

  $injectedToggle.on('change', executionContextUIChange)
  $vmToggle.on('change', executionContextUIChange)
  $web3Toggle.on('change', executionContextUIChange)
  $web3endpoint.on('change', function () {
    setProviderFromEndpoint()
    if (executionContext === 'web3') {
      self.event.trigger('web3EndpointChanged')
    }
  })

  function executionContextUIChange (ev) {
    executionContextChange(ev.target.value)
  }

  function executionContextChange (context) {
    if (context === 'web3' && !confirm('Are you sure you want to connect to a local ethereum node?')) {
      setExecutionContextRadio()
    } else if (context === 'injected' && injectedProvider === undefined) {
      setExecutionContextRadio()
    } else {
      if (context === 'web3') {
        executionContext = context
        setProviderFromEndpoint()
        self.event.trigger('contextChanged', ['web3'])
      } else if (context === 'injected') {
        executionContext = context
        web3.setProvider(injectedProvider)
        self.event.trigger('contextChanged', ['injected'])
      } else if (context === 'vm') {
        executionContext = context
        vm.stateManager.revert(function () {
          vm.stateManager.checkpoint()
        })
        self.event.trigger('contextChanged', ['vm'])
      }
    }
  }

  function setProviderFromEndpoint () {
    var endpoint = $web3endpoint.val()
    if (endpoint === 'ipc') {
      web3.setProvider(new web3.providers.IpcProvider())
    } else {
      web3.setProvider(new web3.providers.HttpProvider(endpoint))
    }
  }

  function setExecutionContextRadio () {
    if (executionContext === 'injected') {
      $injectedToggle.get(0).checked = true
    } else if (executionContext === 'vm') {
      $vmToggle.get(0).checked = true
    } else if (executionContext === 'web3') {
      $web3Toggle.get(0).checked = true
    }
  }
}

module.exports = ExecutionContext
