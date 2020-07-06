var yo = require('yo-yo')
var DropdownPanel = require('./DropdownPanel')

function StepDetail () {
  this.basicPanel = new DropdownPanel('Step details', {json: true, displayContentOnly: false})
  this.detail = { 'vm trace step': '-', 'execution step': '-', 'add memory': '', 'gas': '', 'remaining gas': '-', 'loaded address': '-' }
}

StepDetail.prototype.reset = function () {
  this.detail = { 'vm trace step': '-', 'execution step': '-', 'add memory': '', 'gas': '', 'remaining gas': '-', 'loaded address': '-' }
  this.basicPanel.update(this.detail)
}

StepDetail.prototype.updateField = function (key, value) {
  this.detail[key] = value
  this.basicPanel.update(this.detail)
}

StepDetail.prototype.render = function () {
  return yo`<div id='stepdetail' data-id="stepdetail">${this.basicPanel.render()}</div>`
}

module.exports = StepDetail
