# Current "Best Practice" Conventions

*Please read through and **pay special attention to the code examples** to really understand them.  
If something is not clear, please comment and help improve the situation :-)*

## Project Structure
To have modular imports like for example:  
**`require('ui/dropdown')`**, we could structure our repository like:
* `src/`
    * `ui/`
        * `package.json`: `{ "name": "ui", "version": "1.0.0", "main": "./index.js" }`
        * `index.js`: `module.exports = { dropdown: require('./dropdown'), button: require('./button') }`
        * `button.js`: `module.exports = function button (opts = {}) { /* .... */ }`
        * `dropdown.js`: `module.exports = function dropdown (opts = {}) { /* .... */ }`

This would allow us to run `npm install ./src/ui --save-dev` and then use it like external modules:
```js
// example
var button = require('ui/button')
var dropdown = require('ui/dropdown')
// OR 
var ui = require('ui')
var button = ui.button
var dropdown = ui.dropdown

// use the modules...
```

## Module Definition (example)


<details>
**Description about `best practice` code snippet as seen below**  

- `ES6 class` rather than ES5 to create class. 
 
- CSS declaration using `csjs-inject`.  

- HTML declaration using `yo-yo`.  

- `opt` is an input parameter, it contains the `api` and `event` object.  

- `self._api = opts.api` `opts.api` is an object which contains functions/features that the module needs.  

- `opts.events` contains events manager the module will listen on.  

- A module trigger events using `event` property:
  `self.event = new EventManager()`. 
  Events can then be triggered:
  `self.event.trigger('eventName', [param1, param2])`  
 
- `self._view` is the HTML view renderered by `yo-yo` in the `render` function.  

- `render()` this function should be called:
  * At the first rendering (make sure that the returned node element is put on the DOM).
  * When some property has changed in order to update the view.

- `self.state` contains state properties of the module. These properties are either given from the parent through `òpts` or     computed during the life of the object.  

- `update(state)` allow the parent to easily update some of the state properties.  

- for all functions / properties, prefixing by underscore (`_`) means the scope is private.  

</details>

```js
// user-card.js
var yo = require('yo-yo')
var csjs = require('csjs-inject')
var EventManager = require('remix-lib').EventManager

var css = csjs`
  .userCard        {
    position       : relative;
    box-sizing     : border-box;
    display        : flex;
    flex-direction : column;
    align-items    : center;
    border         : 1px solid black;
    width          : 400px;
    padding        : 50px;  
  }
  .clearFunds { background-color: lightblue; }
`

class UserCard {
  constructor (opts = { api: {}, events: {} }) {
    var self = this

    self.event = new EventManager()
    self._api = opts.api
    self._view = undefined
    self.state = {
      title: opts.title,
      name: opts.name,
      surname: opts.surname,
      totalSpend: 0,
      _nickname: opts.nickname,
      _funds: self._api.getUserFunds()
    }
    var events = opts.events

    events.funds.register('fundsChanged', function (amount) {
      if (amount < self.state._funds) self.state.totalSpend += self.state._funds - amount
      self.state._funds = amount
      self.render()
    })
    self.event.trigger('eventName', [param1, param2])
  }
  render () {
    var self = this
    var el = yo`
      <div class=${css.userCard}>
        <h1> @${self.state._nickname} </h1>
        <h2> Welcome, ${self.state.title || ''} ${self.state.name || 'anonymous'} ${self.state.surname} </h2>
        <ul> <li> User Funds: $${self.state._funds} </li> </ul>
        <ul> <li> Spent Funds: $${self.state.totalSpend} </li> </ul>
        <button class=${css.clearFunds} onclick=${e=>self._spendAll.call(self, e)}> spend all funds </button>
      </div>
    `
    if (self._view) yo.update(self._view, el)
    else self._view = el
    return self._view
  }
  update (state = {}) {
    var self = this
    if (!self._view) self._constraint('first initialize view by calling `.render()`')
    if (state.hasOwnProperty('title')) self.state.title = state.title
    if (state.hasOwnProperty('name')) self.state.name = state.name
    if (state.hasOwnProperty('surname')) self.state.surname = state.surname
    self.render()
  }
  getNickname () {
    var self = this
    return `@${self.state._nickname}`
  }
  getFullName () {
    var self = this
    return `${self.state.title} ${self.state.name} ${self.state.surname}`
  }
  _spendAll (event) {
    var self = this
    self._appAPI.clearUserFunds()
  }
  _constraint (msg) { throw new Error(msg) }
}

module.exports = UserCard
```
## Module Usage (example)
```js
/*****************************************************************************/
// 1. SETUP CONTEXT
var EventManager = require('remix-lib').EventManager
var funds = { event: new EventManager() }
var userfunds = 15
function getUserFunds () { return userfunds }
function clearUserFunds () {
  var spent = userfunds
  userfunds = 0
  console.log(`all funds of ${usercard.getFullName()} were spent.`)
  funds.event.trigger('fundsChanged', [userfunds])
  return spent
}
setInterval(function () {
  userfunds++
  funds.event.trigger('fundsChanged', [userfunds])
}, 100)

/*****************************************************************************/
// 2. EXAMPLE USAGE
var UserCard = require('./user-card')

var usercard = new UserCard({
  api: { getUserFunds, clearUserFunds },
  events: { funds: funds.event },
  title: 'Dr.',
  name: 'John',
  surname: 'Doe',
  nickname: 'johndoe99'
})

var el = usercard.render()
document.body.appendChild(el)
setTimeout(function () { usercard.update({ title: 'Prof.' }) }, 5000)
```
