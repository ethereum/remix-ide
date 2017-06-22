var yo = require('yo-yo')

// -------------- styling ----------------------
var csjs = require('csjs-inject')
var styleGuide = require('./style-guide')
var styles = styleGuide()

var css = csjs`
  .runTabView {
    padding: 2%;
  }
  .crow {
    margin-top: 1em;
    display: flex;
  }
  .col1 extends ${styles.titleL} {
    width: 30%;
    float: left;
    align-self: center;
  }
  .col1_1 extends ${styles.titleM} {
    width: 30%;
    float: left;
    align-self: center;
  }
  .col2 extends ${styles.textBoxL}{
    width: 70%;
    height: 32px;
    float: left;
    padding: .8em;
  }
  .select extends ${styles.dropdown} {
    width: 70%;
    float: left;
    text-align: center;
    height: 32px;
  }
  .contract {
    display: block;
    margin: 4em 0 2em 0;
  }
  .copyaddress {
    color: #C6CFF7;
    margin-right: 0.2em;
    margin-top: 0.7em;
    cursor: pointer;
  }
  .selectAddress extends ${styles.dropdown} {
    width: 74%;
    float: left;
    text-align: center;
    height: 32px;
  }
`

module.exports = runTab

function runTab (container, appAPI, appEvents, opts) {
  var el = yo`
    <div class="${css.runTabView}" id="runTabView">
      Hello world
    </div>
  `
  container.appendChild(el)
}
