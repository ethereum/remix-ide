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
    margin: 0 0 2em 0;
  }
`

module.exports = compileTab

function compileTab (container, appAPI, appEvents, opts) {
  var el = yo`
    <div class="${css.compileTabView}" id="compileTabView">
      <div id="output" class="${css.contract}"></div>
    </div>
  `
  container.appendChild(el)
}
