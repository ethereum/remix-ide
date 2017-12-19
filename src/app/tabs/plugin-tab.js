var yo = require('yo-yo')

// -------------- styling ----------------------
var csjs = require('csjs-inject')

var css = csjs`
  .pluginTabView {
    
  }
  
  .plugin {
    
  }
`

module.exports = plugintab

function plugintab (container, appAPI, events, opts, url) {
  var el = yo`
    <div class="${css.pluginTabView}" id="pluginView">
      <div id="pluginView" class="${css.plugin}">
        <iframe src="${url}/index.html"></iframe>
      </div>
    </div>`
  container.appendChild(el)
  return el
}
