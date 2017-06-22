/* global alert */
var csjs = require('csjs-inject')
var yo = require('yo-yo')

var EventManager = require('ethereum-remix').lib.EventManager
var FileExplorer = require('./file-explorer')

module.exports = filepanel

var css = csjs`
  .container {
    display           : flex;
    flex-direction    : row;
    width             : 100%;
    box-sizing        : border-box;
  }
  .fileexplorer       {
    display           : flex;
    flex-direction    : column;
    position          : relative;
    top               : -33px;
    width             : 100%;
  }
  .menu               {
    display           : flex;
    flex-direction    : row;
  }
  .newFile            {
    padding           : 10px;
  }
  .uploadFile         {
    padding           : 10px;
  }
  .toggleLHP          {
    display           : flex;
    justify-content   : flex-end;
    padding           : 10px;
    width             : 100%;
    font-weight       : bold;
    cursor            : pointer;
    color             : black;
  }
  .isVisible          {
    position          : absolute;
    left              : 35px;
  }
  .isHidden {
    position          : absolute;
    height            : 99%
    left              : -101%;
  }
  .treeview {
    height            : 100%;
    background-color  : white;
  }
  .dragbar            {
    position          : relative;
    top               : 4px;
    cursor            : col-resize;
    z-index           : 999;
    border-right      : 2px solid hsla(215, 81%, 79%, .3);
  }
  .ghostbar           {
    width             : 3px;
    background-color  : #C6CFF7;
    opacity           : 0.5;
    position          : absolute;
    cursor            : col-resize;
    z-index           : 9999;
    top               : 0;
    bottom            : 0;
  }
  .changeeditorfontsize {
    padding: 10px;
  }
  .changeeditorfontsize i {
    display: block;
    color: #111111;
  }
`

var limit = 60
var canUpload = window.File || window.FileReader || window.FileList || window.Blob
var ghostbar = yo`<div class=${css.ghostbar}></div>`

function filepanel (container, appAPI, files) {
  if (!container) return
  if (typeof container === 'string') container = document.querySelector(container)

  var fileExplorer = new FileExplorer(appAPI, files)
  var dragbar = yo`<div onmousedown=${mousedown} class=${css.dragbar}></div>`

  function template () {
    return yo`
      <div class=${css.container}>
        <div class=${css.fileexplorer}>
          <div class=${css.menu}>
            <span onclick=${createNewFile} class="newFile ${css.newFile}" title="New File">
              <i class="fa fa-plus-circle"></i>
            </span>
            ${canUpload ? yo`
              <span class=${css.uploadFile} title="Open local file">
                <label class="fa fa-folder-open">
                  <input type="file" onchange=${uploadFile} multiple />
                </label>
              </span>
            ` : ''}
            <span class=${css.changeeditorfontsize} >
              <i class="increditorsize fa fa-plus" aria-hidden="true" title="increase editor font size"></i>
              <i class="decreditorsize fa fa-minus" aria-hidden="true" title="decrease editor font size"></i>
            </span>
            <span class=${css.toggleLHP} onclick=${toggle} title="Toggle left hand panel">
              <i class="fa fa-angle-double-left"></i>
            </span>
          </div>
          <div class=${css.treeview}>${fileExplorer}</div>
        </div>
        ${dragbar}
      </div>
    `
  }

  var events = new EventManager()
  var element = template()
  element.querySelector('.increditorsize').addEventListener('click', () => { appAPI.editorFontSize(1) })
  element.querySelector('.decreditorsize').addEventListener('click', () => { appAPI.editorFontSize(-1) })
  // TODO please do not add custom javascript objects, which have no
  // relation to the DOM to DOM nodes
  fileExplorer.events.register('focus', function (path) {
    appAPI.switchToFile(path)
  })

  var api = {
    events: events
  }
  container.appendChild(element)

  return api

  function toggle (event) {
    var isHidden = element.classList.toggle(css.isHidden)
    this.classList.toggle(css.isVisible)
    this.children[0].classList.toggle('fa-angle-double-right')
    this.children[0].classList.toggle('fa-angle-double-left')
    events.trigger('ui-hidden', [isHidden])
  }

  function uploadFile (event) {
    // TODO The file explorer is merely a view on the current state of
    // the files module. Please ask the user here if they want to overwrite
    // a file and then just use `files.add`. The file explorer will
    // pick that up via the 'fileAdded' event from the files module.
    ;[...this.files].forEach(fileExplorer.api.addFile)
  }

  function mousedown (event) {
    event.preventDefault()
    if (event.which === 1) {
      moveGhostbar(event)
      document.body.appendChild(ghostbar)
      document.addEventListener('mousemove', moveGhostbar)
      document.addEventListener('mouseup', removeGhostbar)
      document.addEventListener('keydown', cancelGhostbar)
    }
  }
  function cancelGhostbar (event) {
    if (event.keyCode === 27) {
      document.body.removeChild(ghostbar)
      document.removeEventListener('mousemove', moveGhostbar)
      document.removeEventListener('mouseup', removeGhostbar)
      document.removeEventListener('keydown', cancelGhostbar)
    }
  }
  function moveGhostbar (event) {
    var rhp = window['righthand-panel'].offsetLeft
    var newpos = (event.pageX < limit) ? limit : event.pageX
    newpos = (newpos < (rhp - limit)) ? newpos : (rhp - limit)
    ghostbar.style.left = newpos + 'px'
  }

  function removeGhostbar (event) {
    document.body.removeChild(ghostbar)
    document.removeEventListener('mousemove', moveGhostbar)
    document.removeEventListener('mouseup', removeGhostbar)
    document.removeEventListener('keydown', cancelGhostbar)
    var width = (event.pageX < limit) ? limit : event.pageX
    element.style.width = width + 'px'
    events.trigger('ui-resize', [width])
  }

  function createNewFile () {
    var newName = appAPI.createName('Untitled')
    if (!files.set(newName, '')) {
      alert('Failed to create file ' + newName)
    } else {
      appAPI.switchToFile(newName)
    }
  }
}
