
class CompileTab {

  constructor (queryParams, compiler) {
    this.queryParams = queryParams
    this.compiler = compiler
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

}

module.exports = CompileTab
