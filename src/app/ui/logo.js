// user-card.js
var yo = require('yo-yo')
var csjs = require('csjs-inject')
var EventManager = require('remix-lib').EventManager

var css = csjs`
  

`

class Logo {
  constructor (title) {
    
    this.title = title
    //this.links = links
    // this.event = new EventManager()  
    // this._consumedEvents = events
    // this._view = undefined
    
    /* events.funds.register('fundsChanged', function (amount) {
      if (amount < self.state._funds) self.state.totalSpend += self.state._funds - amount
      self.state._funds = amount
      self.render()
    })
    self.event.trigger('eventName', [param1, param2]) */
  }


        
  render () {
    //var self = this
  
      
    var view = yo`
      <img src="https://cdn-images-1.medium.com/max/1200/1*XqsAiEjXejI6w-E-_fKKTA.jpeg" alt="Remix Logo">
    `


    if (!self._view) {
      self._view = view
    }
    return self._view
  }

  update () {
    yo.update(this._view, this.render())
  }
}

module.exports = Logo