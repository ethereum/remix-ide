var hotkeys = require('hotkeys-js')

module.exports = {
  init: function (editor, api) {
    applyHotKey('ctrl+s', editor, () => {
      api.runCompiler()
      return false
    })
  }
}

function applyHotKey (key, editor, action) {
  editor.bindKey({
    key: key.replace(/\+/g, '-'),
    action: () => {
      return action()
    }
  })

  hotkeys(key, (e) => {
    return action()
  })

  hotkeys(key.replace('ctrl', 'command'), (e) => {
    return action()
  })
}
