var csjs = require('csjs-inject')

const css = csjs`
  .info {
    word-break: break-word;
    font-size: .8rem;
    padding: 20px;
    margin: 0;
    border: 0;
    border-bottom: 1px solid;
  }
  .title {
    font-size: 14px;
    font-weight: 400;
    line-height: 19px;
  }
  .settingsButton {
    height: 32px;
    padding: 0 8px;
    font-size: 12px;
    font-weight: 700;
  }
  .frow {
    margin-bottom: .5rem;
  }
  .checkboxText {
    font-weight: normal;
  }
  .crow label {
    cursor:pointer;
  }
  .crowNoFlex {
    overflow: auto;
    clear: both;
  }
  .attention {
    margin-bottom: 1em;
    padding: .5em;
    font-weight: bold;
  }
  .heading {
    margin-bottom: 0;
  }
  .explaination {
    margin-top: 3px;
    margin-bottom: 3px;
  }
  input {
    margin-right: 5px;
    cursor: pointer;
    width: inherit;
  }
  input[type=radio] {
    margin-top: 2px;
  }
  .pluginTextArea {
    font-family: unset;
  }

  .removePlugin {
    cursor: pointer;
  }
  .icon {
    color: #C97539;
    margin-right: .5em;
  }
  .aPlugin {
    display: inline-block;
    padding-left: 10px;
    padding-top: 4px;
    padding-bottom: 6px;
    max-width: 100px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    vertical-align: middle;
  }
  .removePlugin{
    padding-left: 7px;
    padding-right: 7px;
    margin-left: 10px;
  }
`

module.exports = css
