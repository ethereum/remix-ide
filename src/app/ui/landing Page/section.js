var yo = require('yo-yo')
var csjs = require('csjs-inject')
var EventManager = require('remix-lib').EventManager
var i;
var css = csjs`
  .item      {
    position        : static;
    box-sizing      : border-box;
    display         : flex;
    flex-direction  : column;
    align-items     : left;
    border          : 2px solid black;
    width           : 400px;
    padding         : 50px;
    background-color: #bfbfbf;
    font-family     : "Lucida Console", Monaco, monospace
    }
  a:link              {
    color           : black;
    text-decoration : none;
  }

`

class Section {
  constructor (title, actions) {
    
    this.title = title
    this.actions = actions
      
  }
          
  createSectionLook () {
  
    var sectionLook = yo`
      <div class=${css.item}>
        <h2> ${this.title} </h2>
        <br>
        <br>
        <br>
      </div>
    `
    alert("1")
    for (i = 0; i < this.actions.length; i++) {
          if (this.actions[i].type === `callback`) {
              sectionLook.appendChild (yo`
                <div>
                  <span onclick= ${this.actions[i].payload} > ${this.actions[i].label} </span>
                </div>
              `)
          }
          
          else if (this.actions[i].type === `link`) {
              sectionLook.appendChild (yo`
                <div>
                   <a href= ${this.actions[i].payload} target="_blank" > ${this.actions[i].label} </a> 
                </div>
              `)
          }    
    }

    if (!self._view) {
      self._view = sectionLook
    }
    
    return self._view
      
  }

}

module.exports = Section