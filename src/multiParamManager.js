'use strict'

var yo = require('yo-yo')
var css = require('./universal-dapp-styles')
var copyToClipboard = require('./app/ui/copy-to-clipboard')
var remixLib = require('remix-lib')
var txFormat = remixLib.execution.txFormat
var $ = require('jquery')

function doValidation (that, id) {
  var multiString = that.getMultiValsString()
  var multiJSON = JSON.parse('[' + multiString + ']')
  var encodeObj
  if (that.evmBC) {
    encodeObj = txFormat.encodeData(that.funABI, multiJSON, that.evmBC)
  } else {
    encodeObj = txFormat.encodeData(that.funABI, multiJSON)
  }
  if (encodeObj.error) {
    $(`#${id}`).addClass(css.oops.className)
  } else {
    $(`#${id}`).removeClass(css.oops.className)
  }
}

class MultiParamManager {

  /**
    *
    * @param {bool} lookupOnly
    * @param {Object} funABI
    * @param {Function} clickMultiCallBack
    * @param {string} inputs
    * @param {string} title
    * @param {string} evmBC
    *
    */
  constructor (uniqueId, lookupOnly, funABI, clickCallBack, inputs, title, evmBC) {
    this.uniqueId = uniqueId
    this.lookupOnly = lookupOnly
    this.funABI = funABI
    this.clickCallBack = clickCallBack
    this.inputs = inputs
    this.title = title
    this.evmBC = evmBC
    this.basicInputField
    this.multiFields
  }

  switchMethodViewOn () {
    this.contractActionsContainerSingle.style.display = 'none'
    this.contractActionsContainerMulti.style.display = 'flex'
    this.makeMultiVal()
  }

  switchMethodViewOff () {
    this.contractActionsContainerSingle.style.display = 'flex'
    this.contractActionsContainerMulti.style.display = 'none'
    var multiValString = this.getMultiValsString()
    if (multiValString) this.basicInputField.value = multiValString
  }

  getValue (item, index) {
    var valStr = item.value.join('')
    return valStr
  }

  getMultiValsString () {
    var valArray = this.multiFields.querySelectorAll('input')
    var ret = ''
    var valArrayTest = []

    for (var j = 0; j < valArray.length; j++) {
      if (ret !== '') ret += ','
      var elVal = valArray[j].value
      valArrayTest.push(elVal)
      elVal = elVal.replace(/(^|,\s+|,)(\d+)(\s+,|,|$)/g, '$1"$2"$3') // replace non quoted number by quoted number
      elVal = elVal.replace(/(^|,\s+|,)(0[xX][0-9a-fA-F]+)(\s+,|,|$)/g, '$1"$2"$3') // replace non quoted hex string by quoted hex string
      try {
        JSON.parse(elVal)
      } catch (e) {
        elVal = '"' + elVal + '"'
      }
      ret += elVal
    }
    var valStringTest = valArrayTest.join('')
    if (valStringTest) {
      return ret
    } else {
      return ''
    }
  }

  emptyInputs () {
    var valArray = this.multiFields.querySelectorAll('input')
    for (var k = 0; k < valArray.length; k++) {
      valArray[k].value = ''
    }
    this.basicInputField.value = ''
  }

  makeMultiVal () {
    var inputString = this.basicInputField.value
    if (inputString) {
      inputString = inputString.replace(/(^|,\s+|,)(\d+)(\s+,|,|$)/g, '$1"$2"$3') // replace non quoted number by quoted number
      inputString = inputString.replace(/(^|,\s+|,)(0[xX][0-9a-fA-F]+)(\s+,|,|$)/g, '$1"$2"$3') // replace non quoted hex string by quoted hex string
      var inputJSON = JSON.parse('[' + inputString + ']')
      var multiInputs = this.multiFields.querySelectorAll('input')
      for (var k = 0; k < multiInputs.length; k++) {
        if (inputJSON[k]) {
          multiInputs[k].value = JSON.stringify(inputJSON[k])
        }
      }
    }
  }

  createMultiFields (uniqueId) {
    if (this.funABI.inputs) {
      var that = this
      return yo`<div>
        ${this.funABI.inputs.map(function (inp, idx) {
          function setUpValidator (id) {
            $(`#${id}`).off('blur')
            $(`#${id}`).blur(() => doValidation(that, id))
          }
          var id = `${uniqueId}${inp.type}${inp.name}${idx}`
          return yo`<div class="${css.multiArg}"><label for="${inp.name}"> ${inp.name}: </label><input id="${id}" onclick=${() => { setUpValidator(id) }} placeholder="${inp.type}" title="${inp.name}"></div>`
        })}
      </div>`
    }
  }

  render () {
    var title
    if (this.title) {
      title = this.title
    } else if (this.funABI.name) {
      title = this.funABI.name
    } else {
      title = '(fallback)'
    }

    this.basicInputField = yo`<input></input>`
    this.basicInputField.setAttribute('placeholder', this.inputs)
    this.basicInputField.setAttribute('title', this.inputs)

    var onClick = (domEl) => {
      this.clickCallBack(this.funABI.inputs, this.basicInputField.value)
      this.emptyInputs()
    }

    this.contractActionsContainerSingle = yo`<div class="${css.contractActionsContainerSingle}" >
      <button onclick=${() => { onClick() }} class="${css.instanceButton}">${title}</button>${this.basicInputField}<i class="fa fa-angle-down ${css.methCaret}" onclick=${() => { this.switchMethodViewOn() }} title=${title} ></i>
      </div>`

    this.multiFields = this.createMultiFields(this.uniqueId)

    var multiOnClick = () => {
      var valsString = this.getMultiValsString()
      if (valsString) {
        this.clickCallBack(this.funABI.inputs, valsString)
      } else {
        this.clickCallBack(this.funABI.inputs, '')
      }
      this.emptyInputs()
    }

    var button = yo`<button onclick=${() => { multiOnClick() }} class="${css.instanceButton}"></button>`

    this.contractActionsContainerMulti = yo`<div class="${css.contractActionsContainerMulti}" >
      <div class="${css.contractActionsContainerMultiInner}" >
        <div onclick=${() => { this.switchMethodViewOff() }} class="${css.multiHeader}">
          <div class="${css.multiTitle}">${title}</div>
          <i class='fa fa-angle-up ${css.methCaret}'></i>
        </div>
        ${this.multiFields}
        <div class="${css.group} ${css.multiArg}" >
          ${button}
          ${copyToClipboard(
            () => {
              var multiString = this.getMultiValsString()
              var multiJSON = JSON.parse('[' + multiString + ']')
              var encodeObj
              if (this.evmBC) {
                encodeObj = txFormat.encodeData(this.funABI, multiJSON, this.evmBC)
              } else {
                encodeObj = txFormat.encodeData(this.funABI, multiJSON)
              }
              if (encodeObj.error) {
                throw new Error(encodeObj.error)
              } else {
                return encodeObj.data
              }
            }, 'Encode values of input fields & copy to clipboard', 'fa-briefcase')}
        </div>
      </div>
    </div>`

    var contractProperty = yo`<div class="${css.contractProperty}">${this.contractActionsContainerSingle} ${this.contractActionsContainerMulti}</div>`

    if (this.lookupOnly) {
      contractProperty.classList.add(css.constant)
      button.setAttribute('title', (title + ' - call'))
      button.innerHTML = 'call'
      this.contractActionsContainerSingle.querySelector(`.${css.instanceButton}`).setAttribute('title', (title + ' - call'))
    } else {
      button.innerHTML = 'transact'
    }

    if (this.funABI.inputs && this.funABI.inputs.length > 0) {
      contractProperty.classList.add(css.hasArgs)
    } else {
      this.contractActionsContainerSingle.querySelector('i').style.visibility = 'hidden'
      this.basicInputField.style.display = 'none'
    }

    if (this.funABI.payable === true) {
      contractProperty.classList.add(css.payable)
      button.setAttribute('title', (title + ' - transact (payable)'))
      this.contractActionsContainerSingle.querySelector('button').setAttribute('title', (title + ' - transact (payable)'))
    }

    if (!this.lookupOnly && this.funABI.payable === false) {
      button.setAttribute('title', (title + ' - transact (not payable)'))
      this.contractActionsContainerSingle.querySelector('button').setAttribute('title', (title + ' - transact (not payable)'))
    }

    return contractProperty
  }
}

module.exports = MultiParamManager
