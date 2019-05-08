var csjs = require('csjs-inject')
var styleGuide = require('../../ui/styles-guide/theme-chooser')
var styles = styleGuide.chooser()

var css = csjs`
  .contextview {
    opacity             : 1;
    position            : relative;
    height              : 25px;
  }
  .container {
    padding             : 1px 15px;
  }
  .line {
    display             : flex;
    justify-content     : flex-end;
    align-items         : center;
    text-overflow       : ellipsis;
    overflow            : hidden;
    white-space         : nowrap;
    color               : ${styles.editor.text_Primary};
    font-size           : 11px;
  }
  .type {
    font-style        : italic;
    margin-right      : 5px;
  }
  .name  {
    font-weight       : bold;
  }
  .jump {
    cursor            : pointer;
    margin            : 0 5px;
    color             : ${styles.editor.icon_Color_Editor};
  }
  .jump:hover              {
    color             : ${styles.editor.icon_HoverColor_Editor};
  }
  .referencesnb {
    float             : right;
    margin-left       : 15px;
  }
  .gasEstimation {
    margin-right      : 15px;
    display           : flex;
    align-items       : center;
  }
  .gasStationIcon {
    margin-right      : 5px;
  }
  .contextviewcontainer {
    z-index           : 50;
    border-radius     : 1px;
    border            : 2px solid var(--secondary);
  }
`

module.exports = css
