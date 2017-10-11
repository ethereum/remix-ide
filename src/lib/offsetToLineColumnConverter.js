'use strict'
var SourceMappingDecoder = require('ethereum-remix').util.SourceMappingDecoder

function offsetToColumnConverter (compilerEvent) {
  this.lineBreakPositionsByContent = {}
  this.sourceMappingDecoder = new SourceMappingDecoder()
  var self = this
  compilerEvent.register('compilationFinished', function (success, data, source) {
    self.clear()
  })
}

offsetToColumnConverter.prototype.offsetToLineColumn = function (rawLocation, file, compilationResult) {
  if (!this.lineBreakPositionsByContent[file]) {
    var filename = Object.keys(compilationResult.data.sources)[file]
    this.lineBreakPositionsByContent[file] = this.sourceMappingDecoder.getLinebreakPositions(compilationResult.source[filename].content)
  }
  return this.sourceMappingDecoder.convertOffsetToLineColumn(rawLocation, this.lineBreakPositionsByContent[file])
}

offsetToColumnConverter.prototype.clear = function () {
  this.lineBreakPositionsByContent = {}
}

module.exports = offsetToColumnConverter
