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
  .autocompileContainer {
    width: 90px;
  }
  .autocompileTitle {
    font-weight: bold;
    margin: 1% 0;
  }
  .autocompile {
    float: left;
    align-self: center;
  }
  .autocompileText {
    align-self: center;
    margin: 1% 0;
    font-size: 11px;
    overflow: hidden;
    word-break: normal;
    line-height: initial;
    margin-left: 3%;
  }
  .compilationWarning extends ${styles.warningTextBox} {
    margin: 5% 0 0 0;
  }
  .compileButtons {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
  }
  .name {
    display: flex;
  }
  .size {
    display: flex;
  }
  .compileButton extends ${styles.button} {
    width: 130px;
    min-width: 130px;
    background-color: ${styles.colors.blue};
    display: flex;
    align-items: baseline;
    justify-content: center;
    margin-right: 1%;
    font-size: 13px;
  }
  .container extends ${styles.displayBox} {
    margin: 0;
    display: flex;
    align-items: center;
  }
  .contractNames extends ${styles.dropdown} {
    width: 250px;
    margin-right: 5%;
    height: 32px;
    font-size: 12px;
    font-weight: bold;
    background-color: ${styles.colors.blue};
  }
  .contractButtons {
    display: flex;
    cursor: pointer;
    justify-content: center;
    text-align: center;
  }
  .publish extends ${styles.button} {
    background-color: ${styles.colors.pink};
    min-width: 70px;
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
  .compilerLoadingInfo extends ${styles.warningTextBox} {
    margin: 5% 0 5% 0;
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
    color: ${styles.colors.grey};
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

  // Containers
  var warnCompilationSlow = yo`<div id="warnCompilationSlow"></div>`
  var compilerLoading = yo`<div class="${css.compilerLoadingInfo}">Compiler is loading. Please wait a few moments.</div>`
  var compileIcon = yo`<i class="fa fa-refresh ${css.icon}" aria-hidden="true"></i>`
  var compileContainer = yo`
      <div class="${css.compileContainer}">
        <div class="${css.compileButtons}">
          <div class="${css.compileButton} "id="compile" title="Compile source code">${compileIcon} Start to compile</div>
          <div class="${css.autocompileContainer}">
            <input class="${css.autocompile}" id="autoCompile" type="checkbox" checked title="Auto compile">
            <span class="${css.autocompileText}">Auto compile</span>
          </div>
        </div>
        ${warnCompilationSlow}
      </div>
  `

  // REGISTER EVENTS

  // compilationDuration
  appEvents.compiler.register('compilationDuration', function tabHighlighting (speed) {
    var settingsView = document.querySelector('#righthand-panel #menu .settingsView')
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
    compileIcon.classList.add(`${css.bouncingIcon}`)
  })
  appEvents.compiler.register('loadingCompiler', function start () {
    compileIcon.classList.add(`${css.spinningIcon}`)
    compileContainer.appendChild(compilerLoading)
  })
  appEvents.compiler.register('compilationFinished', function finish () {
    var compileTab = document.querySelector('.compileView')
    compileTab.style.color = styles.colors.black
    compileIcon.style.color = styles.colors.black
    compileIcon.classList.remove(`${css.spinningIcon}`)
    compileIcon.classList.remove(`${css.bouncingIcon}`)
  })
  appEvents.compiler.register('compilerLoaded', function loaded () {
    compileContainer.removeChild(compilerLoading)
  })

  var el = yo`
    <div class="${css.compileTabView}" id="compileTabView">
      ${compileContainer}
      ${contractNames(container, appAPI, appEvents, opts)}
    </div>
  `
  container.appendChild(el)

  /* ------------------------------------------------
    section CONTRACT DROPDOWN, DETAILS AND PUBLISH
  ------------------------------------------------ */

  function contractNames (container, appAPI, appEvents, opts) {
    appEvents.compiler.register('compilationFinished', function (success, DATA, source) {
      getContractNames(success, DATA)
    })

    var el = yo`
      <div class="${css.container}">
        <select class="${css.contractNames}"></select>
        <div class="${css.contractButtons}">
          <div class="${css.publish}" onclick=${publish(appAPI)}>Publish</div>
        </div>
      </div>
    `

    // HELPERS
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
          var size = (data.contracts[name].bytecode.length / 2) + ' bytes'
          var contractName = yo`
            <option>
              <div class="${css.name}">${name}</div>
              <div class="${css.size}">  (${size})</div>
            </option>`
          contractNames.appendChild(contractName)
        }
      } else {
        contractNames.appendChild(yo`<option></option>`)
      }
    }
    return el
  }
}
