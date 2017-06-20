'use strict'
var yo = require('yo-yo')
var util = require('./util.js')
var modaldialog = require('../modaldialog')

// -------------- styling ----------------------
var csjs = require('csjs-inject')
var styleGuide = require('../style-guide')
var styles = styleGuide()

var css = csjs`
 .action extends ${styles.button}  {
    background-color: #C6CFF7;
    align-self: center;
    text-align: -webkit-center;
  }
  .action:hover{
    opacity: .7
  }`

/**
  * deploy ABI
  */
class EnsView {
  constructor (appAPI, appEvents, opts) {
    this.appAPI = appAPI
    this.title = 'Publishing'
  }

/**
  * display the publish ABI feature
  *
  * @param {String} address - contract address the ABI is published
  * @param {Object} abi  - abi of the contract
  * @param {String} address - address of the user that will handle the publishing
  */
  show (address, abi, sender) {
    this.abi = abi
    this.address = address
    this.sender = sender
    this.view = html(this)
    modaldialog(this.title, this.view, {
      label: 'Close',
      fn: () => {
        clear(this)
      }}, {label: ''})

    util.ownerOf(address, this.appAPI.web3(), (error, owner) => {
      if (error) {
        this.status = error
        return
      }
      if (owner === '0x0000000000000000000000000000000000000000') {
        this.status = 'No owner set. the current contract has no claimed the use of the reverse registrer (claim in the constructor).'
      } else if (owner !== sender) {
        this.status = 'Sender (' + sender + ') is not the owner of the reverse registrar of ' + address + '. Cannot publish the abi.'
      } else {
        this.status = 'ABI ready to publish.'
      }
      updateView(this)
    })

    util.setABI(this.abi, this.address, this.sender, this.appAPI.web3(), true, (error, result) => {
      if (error) {
        this.estimateGas = 'gas estimation failed ' + error
      } else {
        this.estimateGas = 'Publishing the ABI will cost ' + result + ' gas'
      }
      updateView(this)
    })
  }

/**
  * publish the ABI
  */
  publishABI () {
    this.status = 'Publishing the ABI ...'
    util.setABI(this.abi, this.address, this.sender, this.appAPI.web3(), false, (error, result) => {
      if (error) {
        this.status = error
      } else {
        this.status = 'ABI published'
      }
    })
    updateView(this)
  }
}

function updateView (self) {
  yo.update(self.view, html(self))
}

function clear (self) {
  self.view = null
  self.abi = null
  self.address = null
  self.sender = null
}

function html (self) {
  return yo`<div>
              <div>The ABI is the contract interface and is used by web3 to interact with it.</div>
              <div>Once the ABI is published, it will highly improve the way users interact with your contract.</div>
              <div>First the constructor should contains:</div>
              <div>ReverseRegistrar.claim(msg.sender)</div>
              <div>This will give permission to your personal address to push the ABI.</div>
              <div>then, using the ENS lib ( npm install ensjs ), dapp will access the ABI by:</div>
              <div>ens.resolver('${self.address}.addr.reverse').abi(true)</div>
              <div>In short, if a dapp/user want to interact with your contract, It can retrieve all the needed interface only by knowing its address.</div>
              <div>Please check https://docs.ens.domains/en/latest/userguide.html#reverse-name-resolution for more information</div>
              <div>${self.status}</div>
              <button class="${css.action}" onclick=${() => { self.publishABI() }}>Publish ABI</button> <span>${self.estimateGas}</span>
            </div>`
}

module.exports = EnsView
