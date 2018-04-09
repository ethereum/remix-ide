var yo = require('yo-yo')
var helper = require('../../lib/helper')

var css = require('./styles/tabbed-menu-styles')

class TabbedMenu {
  constructor (api = {}, events = {}, opts = {}) {
    var self = this
    self.events = events
    self._api = api
    self._view = { element: document.createElement('ul') }
    self.tabs = {}
    self.contents = {}
    events.app.register('debuggingRequested', () => self.selectTabByTitle('debugView'))
    // @TODO: 'switchTab' is a message sent only to "TabbedMenu" and should be a method instead
    events.rhp.register('switchTab', title => self.selectTabByTitle(title))
  }
  render () {
    var self = this
    return self._view.element
  }
  selectTabByTitle (title) {
    var self = this
    self.selectTab(self.tabs[title])
  }
  selectTab (el) {
    var self = this
    var title = el.getAttribute('title')
    if (!el.classList.contains(css.active)) Object.keys(self.tabs).forEach(tabname => {
      if (title === tabname) {
        el.classList.add(css.active)
        self.contents[tabname].style.display = 'block'
      } else {
        self.tabs[tabname].classList.remove(css.active)
        self.contents[tabname].style.display = 'none'
      }
    })
    // @TODO: components should NEVER trigger other components events, so TabbedMenu needs an EventManager instead
    self._events.app.trigger('tabChanged', [title])
  }
  addTab (title, cssClass, content) {
    var self = this
    if (!helper.checkSpecialChars(title)) {
      self.contents[title] = content
      self.tabs[title] = yo`<li class="${css.opts_li} ${css.options} ${cssClass}" onclick=${event => self.selectTabByTitle(title)} title=${title}>${title}</li>`
      self._view.element.appendChild(self.tabs[title])
    }
  }
}

module.exports = TabbedMenu
