var yo = require('yo-yo')
var csjs = require('csjs-inject')
var EventManager = require('remix-lib').EventManager
var i;
var css = csjs`
  .container        {
    position        : static;

    box-sizing      : border-box;

    display         : flex;
    flex-direction  : column;
    flex-wrap       : wrap;
    justify-content : space-between;
    align-items     : center;
    align-content   : space-around;
    
    border          : 2px solid black;
    width           : 400px;
    padding         : 50px;
    background-color: #bfbfbf;
    font-family     : "Lucida Console", Monaco, monospace
}

`

class LandingPage {
  constructor (sections) {
    
    this.sections = sections
      
  }
    
  createTotalLook () {
      
    var totalLook = yo`
      <div class=${css.container}>
        <h1> Remix </h1>
        <br>
        <br>
        <br>
      </div>
    `
    alert("2")
    for (i = 0; i < this.sections.length; i++) {
              totalLook.appendChild (yo`
                <div> 
                    ${this.sections[i].createSectionLook()}
                </div>
              `)    
    }

    if (!self._view) {
      self._view = totalLook
    }
    return self._view
  }

  update () {
    yo.update(this._view, this.createTotalLook())
  }
}


module.exports = LandingPage