function SourceTracker (editor, debug) {
  this.editor = editor
  this.debug = debug
  this.compilationData
  this.contracts = {}
  var self = this
  this.debug.register('indexChanged', this, function (index) {
    self.debug.traceManager.getCurrentPC(index, function () {
      // update editor
    })
  })
}

SourceTracker.prototype.setCompilationData = function (data) {
  this.contracts = {}
  this.compilationData = data
  for (var k in data.contracts) {
    this.contracts[k] = {}
    this.contracts[k].srcmap = data.contracts[k]['srcmap'].split(';')
    this.contracts[k].srcmapruntime = data.contracts[k]['srcmap-runtime'].split(';')
  }
}

module.exports = SourceTracker
