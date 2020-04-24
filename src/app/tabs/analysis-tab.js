var yo = require('yo-yo')
var StaticAnalysis = require('./staticanalysis/staticAnalysisView')
var EventManager = require('../../lib/events')

import { ViewPlugin } from '@remixproject/engine'
import { EventEmitter } from 'events'
import * as packageJson from '../../../package.json'

const profile = {
  name: 'solidityStaticAnalysis',
  displayName: 'Solidity static analysis',
  methods: [],
  events: [],
  icon: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB3aWR0aD0iMjA0OCIgaGVpZ2h0PSIxNzkyIiB2aWV3Qm94PSIwIDAgMjA0OCAxNzkyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0yMDQ4IDE1MzZ2MTI4aC0yMDQ4di0xNTM2aDEyOHYxNDA4aDE5MjB6bS0xMjgtMTI0OHY0MzVxMCAyMS0xOS41IDI5LjV0LTM1LjUtNy41bC0xMjEtMTIxLTYzMyA2MzNxLTEwIDEwLTIzIDEwdC0yMy0xMGwtMjMzLTIzMy00MTYgNDE2LTE5Mi0xOTIgNTg1LTU4NXExMC0xMCAyMy0xMHQyMyAxMGwyMzMgMjMzIDQ2NC00NjQtMTIxLTEyMXEtMTYtMTYtNy41LTM1LjV0MjkuNS0xOS41aDQzNXExNCAwIDIzIDl0OSAyM3oiLz48L3N2Zz4=',
  description: 'Checks the contract code for security vulnerabilities and bad practices.',
  kind: 'analysis',
  location: 'sidePanel',
  documentation: 'https://remix-ide.readthedocs.io/en/latest/static_analysis.html',
  version: packageJson.version
}

class AnalysisTab extends ViewPlugin {

  constructor (registry) {
    super(profile)
    this.event = new EventManager()
    this.events = new EventEmitter()
    this.registry = registry
  }

  render () {
    if (!this.staticanalysis) this.staticanalysis = new StaticAnalysis(this.registry, this)
    this.staticanalysis.event.register('staticAnaysisWarning', (count) => {
      if (count > 0) {
        this.emit('statusChanged', {key: count, title: `${count} warning${count === 1 ? '' : 's'}`, type: 'warning'})
      } else if (count === 0) {
        this.emit('statusChanged', {key: 'succeed', title: 'no warning', type: 'success'})
      } else {
        // count ==-1 no compilation result
        this.emit('statusChanged', {key: 'none'})
      }
    })
    this.registry.put({api: this.staticanalysis, name: 'staticanalysis'})

    return yo`<div class="px-3 pb-1" id="staticanalysisView">${this.staticanalysis.render()}</div>`
  }

}

module.exports = AnalysisTab
