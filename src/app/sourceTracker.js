var utils = require('./utils');

function SourceTracker (editor, debug) {
  this.currentContractName
  this.editor = editor
  this.debug = debug
  this.compilationData
  this.contracts = {}
  this.sourceList = []
  var self = this
  this.debug.codeManager.register('indexChanged', this, function (index) {
    var location = self.retrieveFullLocation(index, self.contracts[self.currentContractName].srcmapruntime)
    var name = utils.fileNameFromKey(self.editor.getCacheFile()); // current opened tab
    var source = self.compilationData.sourceList[parseInt(location[3])] // we might need to auto switch to that tab
    var range = self.editor.getRowColumnLocation(parseInt(location[0]), parseInt(location[1]))
    self.editor.hightlightRange(range)
  })
}

SourceTracker.prototype.setCurrentDebuggingContract = function (ctr) {
  this.currentContractName = ctr
}

SourceTracker.prototype.setCompilationData = function (data) {
  this.contracts = {}
  this.compilationData = data
  this.sourcesList = data.sourceList
  for (var k in data.contracts) {
    this.contracts[k] = {}
    // s:l:f:j
    this.contracts[k].srcmap = data.contracts[k]['srcmap'].split(';')
    this.contracts[k].srcmapruntime = data.contracts[k]['srcmap-runtime'].split(';')
  }
}

SourceTracker.prototype.retrieveFullLocation = function (index, mapping) {
  var ret = {}
  while (true) {
    var current = mapping[index]
    current = current.split(':')

    if (!ret[0]) {
      ret[0] = current[0]
    }

    if (!ret[1]) {
      ret[1] = current[1]
    }

    if (!ret[2]) {
      ret[2] = current[2]
    }

    if (!ret[3]) {
      ret[3] = current[3]
    }

    if ((ret[0] && ret[1] && ret[2] && ret[3]) || index === 0) {
      break
    } else {
      index--
    }
  }
  return ret
}

module.exports = SourceTracker
