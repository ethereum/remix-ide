let yo = require('yo-yo')
let csjs = require('csjs-inject')

var css = csjs`
  .item      {
    display         : flex;
    flex-direction  : column;
    align-items     : center;
    width           : 400px;
    height          : 160px;
    padding         : 20px;
    background-color: #919292;
    font-family     : "Lucida Console", Monaco, monospace;
    font-size       : 12px;
    }
  span {
    font-size       : 12px;
    cursor          : pointer;
  }
  span:hover {
    color           : #dddddd;
  }
  a:link              {
    color           : black;
    text-decoration : none;
    font-size       : 12px;
  }
  a:visited {
    color           : black;
  }
  a:hover {
    color           : #dddddd;
  }

`

class Section {
  constructor (title, actions) {
    this.title = title
    this.actions = actions
  }

  render () {
    var sectionLook = yo`
      <div class="${css.item}">
        <h2> ${this.title} </h2>
      </div>
    `
    for (var i = 0; i < this.actions.length; i++) {
      if (this.actions[i].type === `callback`) {
        sectionLook.appendChild(yo`
          <div>
            <span class='text-warning h6' style="cursor:pointer;" onclick= ${this.actions[i].payload} > ${this.actions[i].label} </span>
          </div>
        `)
      } else if (this.actions[i].type === `link`) {
        sectionLook.appendChild(yo`
          <div>
              <a class='text-warning h6' href= ${this.actions[i].payload} target="_blank" > ${this.actions[i].label} </a> 
          </div>
        `)
      }
    }

    if (!this._view) {
      this._view = sectionLook
    }

    return this._view
  }

}

module.exports = Section
