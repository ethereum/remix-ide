var yo = require('yo-yo')

// -------------- styling ----------------------
var csjs = require('csjs-inject')
var styleGuide = require('./style-guide')
var styles = styleGuide()

var css = csjs`
  .compileTabView {
    padding: 2%;
  }
  .contract {
    display: block;
    margin: 3% 0;
  }
  .autocompileTitle {
    font-weight: bold;
    margin: 1% 0;
  }
  .autocompile {
    float: left;
    align-self: center;
    margin: 1% 1%;
  }
  .autocompileText {
    align-self: center;
    margin: 1% 0;
  }
  .compilationWarning extends ${styles.warningTextBox} {
    margin-top: 5%;
  }
  .button extends ${styles.button} {
    width: 10em;
    background-color: ${styles.colors.blue};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom:.3em;
  }
  .icon {
    margin-right: .3em;
  }
`

// HELPERS

module.exports = compileTab

function compileTab (container, appAPI, appEvents, opts) {
  if (typeof container === 'string') container = document.querySelector(container)
  if (!container) throw new Error('no container given')
  var warnCompilationSlow = yo`<div id="warnCompilationSlow"></div>`

  // REGISTER EVENTS

  // compilationDuration
  appEvents.compiler.register('compilationDuration', function tabHighlighting (speed) {
    var settingsView = document.querySelector('#header #menu .settingsView')
    warnCompilationSlow.className = css.compilationWarning
    if (speed > 1000) {
      warnCompilationSlow.innerHTML = `Last compilation took ${speed}ms. We suggest to turn off autocompilation.`
      warnCompilationSlow.style.visibility = 'visible'
      settingsView.style.color = '#FF8B8B'
    } else {
      warnCompilationSlow.innerHTML = ''
      warnCompilationSlow.style.visibility = 'hidden'
      settingsView.style.color = ''
    }
  })
  // loadingCompiler
  appEvents.editor.register('contentChanged', function changedFile () {
    var compileButton = document.querySelector(`.${css.icon}`)
    console.log('File changed')
    compileButton.style.color = 'orange'
  })

  appEvents.compiler.register('loadingCompiler', function start () {
    var compileButton = document.querySelector(`.${css.icon}`)
    console.log('Compilation started')
    compileButton.style.color = 'green'
  })
  appEvents.compiler.register('compilationFinished', function finish () {
    var compileButton = document.querySelector(`.${css.icon}`)
    console.log('Compilation finished')
    compileButton.style.color = 'black'
  })

  var el = yo`
    <div class="${css.compileTabView}" id="compileTabView">
      <div class="${css.compile}">
        <div class="${css.button} "id="compile" title="Compile source code"><i class="fa fa-refresh ${css.icon}" aria-hidden="true"></i>Start to compile</div>
        <input class="${css.autocompile}" id="autoCompile" type="checkbox" checked title="Auto compile">
        <span class="${css.autocompileText}">Auto compile</span>
        ${warnCompilationSlow}
      </div>
      <div id="output" class="${css.contract}"></div>
    </div>
  `
  container.appendChild(el)
}
