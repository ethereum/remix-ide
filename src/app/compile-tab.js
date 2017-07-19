/* global alert */
var $ = require('jquery')

var yo = require('yo-yo')
var async = require('async')
var swarmgw = require('swarmgw')

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
      <div class='error'></div>
    </div>
  `
  container.appendChild(el)

  /* ------------------------------------------------
    section CONTRACT DROPDOWN, DETAILS AND PUBLISH
  ------------------------------------------------ */

  function contractNames (container, appAPI, appEvents, opts) {
    var contractsMetadata = {}
    appEvents.compiler.register('compilationFinished', function (success, data, source) {
      // reset the contractMetadata list (used by the publish action)
      contractsMetadata = {}
      // refill the dropdown list
      getContractNames(success, data)
      // hightlight the tab if error
      if (success) {
        document.querySelector('#righthand-panel #menu .compileView').style.color = ''
      } else {
        document.querySelector('#righthand-panel #menu .compileView').style.color = '#FF8B8B'
      }
      // display warning error if any
      var errorContainer = container.querySelector('.error')
      errorContainer.innerHTML = ''
      if (data['error']) {
        appAPI.compilationMessage(data['error'], $(errorContainer))
      }
      if (data['errors']) {
        data['errors'].forEach(function (err) {
          appAPI.compilationMessage(err, $(errorContainer))
        })
      }
      if (errorContainer.innerHTML === '') {
        appAPI.compilationMessage('Compilation successful without warning', $(errorContainer), {type: 'success'})
      }
    })

    var retrieveMetadataHash = function (bytecode) {
      var match = /a165627a7a72305820([0-9a-f]{64})0029$/.exec(bytecode)
      if (match) {
        return match[1]
      }
    }

    var el = yo`
      <div class="${css.container}">
        <select class="${css.contractNames}"></select>
        <div class="${css.contractButtons}">
          <div class="${css.publish}" onclick=${() => {publish(appAPI)}}>Publish</div>
        </div>
      </div>
    `

    // HELPERS

    // GET NAMES OF ALL THE CONTRACTS
    function getContractNames (success, data) {
      var contractNames = document.querySelector(`.${css.contractNames.classNames[0]}`)
      contractNames.innerHTML = ''
      if (success) {
        for (var name in data.contracts) {
          contractsMetadata[name] = {
            metadata: data.contracts[name].metadata,
            metadataHash: data.contracts[name].bytecode && retrieveMetadataHash(data.contracts[name].bytecode)
          }
          var contractName = yo`
            <option>
              <div class="${css.name}">${name}</div>
            </option>`
          contractNames.appendChild(contractName)
        }
      } else {
        contractNames.appendChild(yo`<option></option>`)
      }
    }

    function publish (appAPI) {
      var selectContractNames = document.querySelector(`.${css.contractNames.classNames[0]}`)
      var contract = contractsMetadata[selectContractNames.children[selectContractNames.selectedIndex].innerText]
      publishOnSwarm(contract, function (err) {
        if (err) {
          alert('Failed to publish metadata: ' + err)
        } else {
          alert('Metadata published successfully')
        }
      })
    }

    function publishOnSwarm (contract, cb) {
      // gather list of files to publish
      var sources = []

      sources.push({
        content: contract.metadata,
        hash: contract.metadataHash
      })

      var metadata
      try {
        metadata = JSON.parse(contract.metadata)
      } catch (e) {
        return cb(e)
      }

      if (metadata === undefined) {
        return cb('No metadata')
      }

      async.eachSeries(Object.keys(metadata.sources), function (fileName, cb) {
        // find hash
        var hash
        try {
          hash = metadata.sources[fileName].urls[0].match('bzzr://(.+)')[1]
        } catch (e) {
          return cb('Metadata inconsistency')
        }

        appAPI.fileProviderOf(fileName).get(fileName, (error, content) => {
          if (error) {
            console.log(error)
          } else {
            sources.push({
              content: content,
              hash: hash
            })
          }
          cb()
        })
      }, function () {
        // publish the list of sources in order, fail if any failed
        async.eachSeries(sources, function (item, cb) {
          swarmVerifiedPublish(item.content, item.hash, cb)
        }, cb)
      })
      function swarmVerifiedPublish (content, expectedHash, cb) {
        swarmgw.put(content, function (err, ret) {
          if (err) {
            cb(err)
          } else if (ret !== expectedHash) {
            cb('Hash mismatch')
          } else {
            cb()
          }
        })
      }
    }


    return el
  }
}
