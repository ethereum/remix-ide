var yo = require('yo-yo')
var csjs = require('csjs-inject')
var EventManager = require('remix-lib').EventManager
var css = csjs`
  .container        {
    position        : static;

    box-sizing      : border-box;

    display         : flex;
    flex-direction  : row;
    flex-wrap       : wrap;
    justify-content : space-evenly;
    align-items     : center;
    align-content   : space-around;
    
    border          : 2px solid black;
    width           : 100%;
    padding         : 50px;
    background-color: #bfbfbf;
    font-family     : "Lucida Console", Monaco, monospace
}

  .section          {

    border          : 2px solid black;
}

`

class LandingPage {
  constructor (sections) {
    
    this.sections = sections
      
  }
    
  createTotalLook () {
      
    var totalLook = yo`
      <div class=${css.container}>
      </div>
    `
    alert("2")
    for (var i = 0; i < this.sections.length; i++) {
              totalLook.appendChild (yo`
                <div class=${css.section}> 
                    ${this.sections[i].createSectionLook()}
                </div>
              `)    
    }

    if (!this._view) {
      this._view = totalLook
    }
    return this._view
  }

  update () {
    yo.update(this._view, this.createTotalLook())
  }
}


module.exports = LandingPage