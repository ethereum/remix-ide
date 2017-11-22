var remix = require('ethereum-remix')
var EventManager = remix.lib.EventManager

class Recorder {
  constructor (opts = {}) {
    var self = this
    self._api = opts.api
    self.event = new EventManager()
    self.data = { journal: [], _pendingCreation: {} }
    opts.events.executioncontext.register('contextChanged', function () {
      self.clearAll()
    })
    var counter = 0
    function getIndex (accounts, address) {
      var index
      accounts.forEach((addr, idx) => { if (address === addr) index = idx })
      if (!index) index = (++counter)
      return index
    }
    self._addressCache = {}
    opts.events.udapp.register('initiatingTransaction', (timestamp, tx) => {
      var { from, to, value, gas, data } = tx
      var record = { value, gas, data }
      self._api.getAccounts(function (err, accounts = []) {
        if (err) console.error(err)
        record.from = self._addressCache[from] || (self._addressCache[from] = `<account - ${getIndex(accounts, from)}>`)
        if (to) record.to = self._addressCache[to] || (self._addressCache[to] = `<account - ${getIndex(accounts, to)}>`)
        else self.data._pendingCreation[timestamp] = record
        self.append(timestamp, record)
      })
    })
    opts.events.udapp.register('transactionExecuted', (...args) => {
      var err = args[0]
      if (err) console.error(err)
      var timestamp = args[6]
      // update transaction which was pending with correct `to` address
      var record = self.data._pendingCreation[timestamp]
      delete self.data._pendingCreation[timestamp]
      if (!record) return
      var to = args[2]
      self._api.getAccounts(function (err, accounts = []) {
        if (err) console.error(err)
        if (to) record.to = self._addressCache[to] || (self._addressCache[to] = `<contract - ${getIndex(accounts, to)}>`)
      })
    })
  }
  resolveAddress (record, accounts) {
    if (record.to && record.to[0] === '<') record.to = accounts[record.to.split('>')[0].slice(11)]
    if (record.from && record.from[0] === '<') record.from = accounts[record.from.split('>')[0].slice(11)]
    // @TODO: change copy/paste to write and read from history file

    // @TODO: writing browser test

    // @TODO: replace addresses with custom ones (maybe address mapping file?)
    return record
  }
  append (timestamp, record) {
    var self = this
    self.data.journal.push({ timestamp, record })
  }
  getAll () {
    var self = this
    var records = [].concat(self.data.journal)
    return records.sort((A, B) => {
      var stampA = A.timestamp
      var stampB = B.timestamp
      return stampA - stampB
    })
  }
  clearAll () {
    var self = this
    self.data.journal = []
  }
}

module.exports = Recorder
