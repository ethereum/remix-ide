var yo = require('yo-yo')

var css = yo`<style>
.sol.success,
.sol.error,
.sol.staticAnalysisWarning,
.sol.warning {
    white-space: pre-line;
    word-wrap: break-word;
    cursor: pointer;
    position: relative;
    margin: 0.5em 0 1em 0;
    border-radius: 2px;
    padding: 8px;
}

.sol.success pre,
.sol.error pre,
.sol.staticAnalysisWarning pre,
.sol.warning pre {
    white-space: pre-line;
    background-color: transparent;
    font-size: 11px;
    line-height: 20px;
}

.sol.success .close,
.sol.staticAnalysisWarning .close,
.sol.error .close,
.sol.warning .close {
    white-space: pre-line;
    font-weight: bold;
    position: absolute;
    color: #fff;
    top: 0;
    right: 0;
    padding: 0.5em;
}

.sol.error {
}

.sol.warning {
}

.sol.staticAnalysisWarning {
}

.sol.success {
  /* background-color:  // styles.rightPanel.message_Success_BackgroundColor; */
}</style>`

module.exports = css
