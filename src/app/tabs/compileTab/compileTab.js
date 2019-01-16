
class CompileTab {

  constructor (queryParams, compiler, fileManager, editor, config) {
    this.queryParams = queryParams
    this.compiler = compiler
    this.fileManager = fileManager
    this.editor = editor
    this.config = config
  }

  init () {
    this.optimize = this.queryParams.get().optimize
    this.optimize = this.optimize === 'true'
    this.queryParams.update({ optimize: this.optimize })
    this.compiler.setOptimize(this.optimize)
  }

  setOptimize (newOptimizeValue) {
    this.optimize = newOptimizeValue
    this.queryParams.update({ optimize: this.optimize })
    this.compiler.setOptimize(this.optimize)
  }

  runCompiler () {
    this.fileManager.saveCurrentFile()
    this.editor.clearAnnotations()
    var currentFile = this.config.get('currentFile')
    if (!currentFile && !/.(.sol)$/.exec(currentFile)) return
    // only compile *.sol file.
    var target = currentFile
    var sources = {}
    var provider = this.fileManager.fileProviderOf(currentFile)
    if (!provider) return console.log('cannot compile ' + currentFile + '. Does not belong to any explorer')
    provider.get(target, (error, content) => {
      if (error) return console.log(error)
      sources[target] = { content }
      this.compiler.compile(sources, target)
    })
  }

}

module.exports = CompileTab
