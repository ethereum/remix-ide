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
    margin: 5% 0;
  }
  .compile {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
  }
  .autocompile {
    float: left;
    align-self: center;
  }
  .compilationWarning extends ${styles.warningTextBox} {
    margin-top: 5%;
  }
  .button extends ${styles.button} {
    background-color: #C6CFF7;
    width: 30%;
    text-align: -webkit-center;
  }
`

// HELPERS

module.exports = compileTab

function compileTab (container, appAPI, appEvents, opts) {
  if (typeof container === 'string') container = document.querySelector(container)
  if (!container) throw new Error('no container given')
  var warnCompilationSlow = yo`<div id="warnCompilationSlow"></div>`
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
  var el = yo`
    <div class="${css.compileTabView}" id="compileTabView">
      <div class="${css.compile}">
        <input class="${css.autocompile}" id="autoCompile" type="checkbox" checked title="Auto compile">
        <div class="${css.button} "id="compile" title="Compile source code">Compile</div>
        ${warnCompilationSlow}
      </div>
      <div id="output" class="${css.contract}"></div>
    </div>
  `
  container.appendChild(el)
}
