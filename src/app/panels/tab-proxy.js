var yo = require('yo-yo')
var $ = require('jquery')

export class TabProxy {
  constructor (fileManager, editor) {
    this.fileManager = fileManager
    this.editor = editor
    this.activeEntity
    this.entities = {}
    this.data = {}
    this._view = {}

    fileManager.event.register('fileRemoved', (name) => {
      const filesEl = document.querySelector('#files')
      var file = filesEl.querySelector(`li[path="${name}"]`)
      if (file) {
        filesEl.removeChild(file)
      }
    })

    fileManager.event.register('fileClosed', (name) => {
      const filesEl = document.querySelector('#files')
      var file = filesEl.querySelector(`li[path="${name}"]`)
      if (file) {
        filesEl.removeChild(file)
      }
    })

    fileManager.event.register('currentFileChanged', (file) => {
      const filesEl = document.querySelector('#files')
      if (!filesEl.querySelector(`li[path="${file}"]`)) {
        filesEl.appendChild(yo`<li class="file" path="${file}" ><span class="name">${file}</span><span class="remove"><i class="fa fa-close"></i></span></li>`)
      }
      this.active(file)
    })

    fileManager.event.register('fileRenamed', (oldName, newName) => {
      const filesEl = document.querySelector('#files')
      var file = filesEl.querySelector(`li[path="${oldName}"]`)
      if (file) {
        filesEl.setAttribute('path', file)
        file.querySelector(`.name`).innerHTML = newName
      }
    })
  }

  active (name) {
    var filesEl = document.querySelector('#files')
    let file = filesEl.querySelector(`li[path="${this.activeEntity}"]`)
    if (file) $(file).removeClass('active')
    if (name) {
      let active = filesEl.querySelector(`li[path="${name}"]`)
      if (active) {
        $(active).addClass('active')
        this.activeEntity = name
      }
    }
  }

  addHandler (type, fn) {
    this.handlers[type] = fn
  }

  renderTabsbar () {
    this._view.filetabs = yo`<ul id="files" class="nav nav-tabs"></ul>`

    this._view.tabs = yo`
      <div>
        ${this._view.filetabs}
      </div>
    `
    let tabsbar = yo`
      <div class="d-flex">
        <div class="m-1">
          <span class="p-1">
            <i class="m-1 fa fa-plus" onclick=${increase} aria-hidden="true" title="increase editor font size"></i>
            <i class="m-1 fa fa-minus" onclick=${decrease} aria-hidden="true" title="decrease editor font size"></i>
          </span>
        </div>
        ${this._view.tabs}
      </div>
    `

    // tabs
    var $filesEl = $(this._view.filetabs)

    // Switch tab
    var self = this
    $filesEl.on('click', '.file:not(.active)', function (ev) {
      ev.preventDefault()
      self.fileManager.switchFile($(this).find('.name').text())
      return false
    })

    // Remove current tab
    $filesEl.on('click', '.file .remove', function (ev) {
      ev.preventDefault()
      var name = $(this).parent().find('.name').text()
      self.fileManager.closeFile(name)
      return false
    })

    function increase () { self.editor.editorFontSize(1) }
    function decrease () { self.editor.editorFontSize(-1) }    
    return tabsbar
  }
}
