var yo = require('yo-yo')

module.exports = (title, content, ok, cancel) => {
  var container = document.querySelector('.modal')
  if (!container) {
    document.querySelector('body').appendChild(html())
    container = document.querySelector('.modal')
  }

  var okDiv = document.getElementById('modal-footer-ok')
  var cancelDiv = document.getElementById('modal-footer-cancel')
  okDiv.innerHTML = (ok && ok.label !== undefined) ? ok.label : 'OK'
  cancelDiv.innerHTML = (cancel && cancel.label !== undefined) ? cancel.label : 'Cancel'

  var modal = document.querySelector('.modal-body')
  var modaltitle = document.querySelector('.modal-header h2')

  modaltitle.innerHTML = ' - '
  if (title) modaltitle.innerHTML = title

  modal.innerHTML = ''
  if (content) modal.appendChild(content)

  container.style.display = container.style.display === 'block' ? hide() : show()

  function okListenner () {
    hide()
    if (ok && ok.fn) ok.fn()
    removeEventListener()
  }

  function cancelListenner () {
    hide()
    if (cancel && cancel.fn) cancel.fn()
    removeEventListener()
  }

  function hide () {
    container.style.display = 'none'
  }

  function show () {
    container.style.display = 'block'
  }

  function removeEventListener () {
    okDiv.removeEventListener('click', okListenner)
    cancelDiv.removeEventListener('click', cancelListenner)
  }

  okDiv.addEventListener('click', okListenner)
  cancelDiv.addEventListener('click', cancelListenner)
}

function html () {
  return yo`<div id="modaldialog" style="display:none" class="modal">
  <div class="modal-content">
    <div class="modal-header">
    <h2></h2>
  </div>
  <div class="modal-body">
  </div>
  <div class="modal-footer">
    <span id="modal-footer-ok">OK</span><span id="modal-footer-cancel">Cancel</span>
  </div>
  </div>
  </div>`
}
