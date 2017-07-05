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
  .compileContainer extends ${styles.displayBox} {
    margin-bottom: 5%;
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
    margin: 5% 0 0 0;
  }
  .button extends ${styles.button} {
    width: 150px;
    background-color: ${styles.colors.blue};
    display: flex;
    align-items: baseline;
    justify-content: center;
    margin-bottom:.3em;
  }
  .buttons {
    display: flex;
    cursor: pointer;
    justify-content: center;
    text-align: center;
  }
  .publish extends ${styles.button} {
    margin: 1%;
    background-color: ${styles.colors.pink};
    text-align: center;
  }
  .contractNames extends ${styles.dropdown} {
    width: 100%;
    height: 32px;
    background-color: ${styles.colors.blue};
  }
  .icon {
    margin-right: 3%;
  }
  .spinningIcon {
    margin-right: .3em;
    animation: spin 2s linear infinite;
  }
  .bouncingIcon {
    margin-right: .3em;
    animation: bounce 2s infinite;
  }
  @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
  }
  @-webkit-keyframes bounce {
  0% {
    margin-bottom: 0;
    color: ${styles.colors.transparent};
  }
  70% {
    margin-bottom: 0;
    color: ${styles.colors.red};
  }
  100% {
    margin-bottom: 0;
    color: ${styles.colors.transparent};
  }
}
`

module.exports = compileTab

function compileTab (container, appAPI, appEvents, opts) {
  if (typeof container === 'string') container = document.querySelector(container)
  if (!container) throw new Error('no container given')
  appEvents.compiler.register('compilationFinished', function (success, DATA, source) {
    getContractNames(success, DATA)
  })
  var warnCompilationSlow = yo`<div id="warnCompilationSlow"></div>`

  // REGISTER EVENTS

  // compilationDuration
  appEvents.compiler.register('compilationDuration', function tabHighlighting (speed) {
    var settingsView = document.querySelector('#header #menu .settingsView')
    warnCompilationSlow.className = css.compilationWarning
    if (speed > 1000) {
      warnCompilationSlow.innerHTML = `Last compilation took ${speed}ms. We suggest to turn off autocompilation.`
      warnCompilationSlow.style.display = 'block'
      settingsView.style.color = '#FF8B8B'
    } else {
      warnCompilationSlow.innerHTML = ''
      warnCompilationSlow.style.display = 'none'
      settingsView.style.color = ''
    }
  })
  // loadingCompiler
  appEvents.editor.register('contentChanged', function changedFile () {
    var compileTab = document.querySelector('.compileView')
    compileTab.style.color = styles.colors.red
    var compileButton = document.querySelector(`.${css.icon}`)
    compileButton.classList.add(`${css.bouncingIcon}`)
  })
  appEvents.compiler.register('loadingCompiler', function start () {
    var compileButton = document.querySelector(`.${css.icon}`)
    compileButton.classList.add(`${css.spinningIcon}`)
  })
  appEvents.compiler.register('compilationFinished', function finish () {
    var compileButton = document.querySelector(`.${css.icon}`)
    var compileTab = document.querySelector('.compileView')
    compileTab.style.color = styles.colors.black
    compileButton.style.color = styles.colors.black
    compileButton.classList.remove(`${css.spinningIcon}`)
    compileButton.classList.remove(`${css.bouncingIcon}`)
  })

  var el = yo`
    <div class="${css.compileTabView}" id="compileTabView">
      <div class="${css.compileContainer}">
        <div class="${css.button} "id="compile" title="Compile source code"><i class="fa fa-refresh ${css.icon}" aria-hidden="true"></i>Start to compile</div>
        <input class="${css.autocompile}" id="autoCompile" type="checkbox" checked title="Auto compile">
        <span class="${css.autocompileText}">Auto compile</span>
        ${warnCompilationSlow}
      </div>
      <select class="${css.contractNames}"></select>
      <div class="${css.buttons}">
        <div class="${css.publish}" onclick=${publish(appAPI)}>Publish</div>
      </div>
    </div>
  `
  container.appendChild(el)

  /* ------------------------------------------------
    section CONTRACT DROPDOWN, DETAILS AND PUBLISH
  ------------------------------------------------ */

  function publish (appAPI) {
    // var contractNames = document.querySelector(`.${css.contractNames}`)
    // var contract = appAPI.getContracts()[contractNames.children[contractNames.selected].innerText]
    // appAPI.publishContract(contract, function () { console.log(contract) })
  }

  // GET NAMES OF ALL THE CONTRACTS
  function getContractNames (success, data) {
    var contractNames = document.querySelector(`.${css.contractNames.classNames[0]}`)
    contractNames.innerHTML = ''
    if (success) {
      for (var name in data.contracts) {
        contractNames.appendChild(yo`<option>${name}</option>`)
      }
    } else {
      contractNames.appendChild(yo`<option></option>`)
    }
  }
}
