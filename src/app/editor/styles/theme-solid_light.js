var styles = require('../../ui/styles-guide/style-guide')()

// based on @see https://raw.githubusercontent.com/thlorenz/brace/v0.8.0/theme/textmate.js
var aceThemeSolidLightCssText = `
.ace-solid-light .ace_gutter {
  background: #f0f0f0;
  color: #333;
}

.ace-solid-light .ace_print-margin {
  width: 1px;
  background: #e8e8e8;
}

.ace-solid-light .ace_fold {
  background-color: #6B72E6;
}

.ace-solid-light {
  background-color: #FFFFFF;
  color: black;
}

.ace-solid-light .ace_cursor {
  color: black;
}

.ace-solid-light .ace_invisible {
  color: rgb(191, 191, 191);
}

.ace-solid-light .ace_storage {
  color: rgb(49, 132, 149);
}

.ace-solid-light .ace_keyword {
  color: blue;
}

.ace-solid-light .ace_constant {
  color: rgb(197, 6, 11);
}

.ace-solid-light .ace_constant.ace_buildin {
  color: rgb(88, 72, 246);
}

.ace-solid-light .ace_constant.ace_language {
  color: rgb(88, 92, 246);
}

.ace-solid-light .ace_constant.ace_library {
  color: rgb(6, 150, 14);
}

.ace-solid-light .ace_invalid {
  background-color: rgba(255, 0, 0, 0.1);
  color: red;
}

.ace-solid-light .ace_support.ace_function {
  color: rgb(60, 76, 114);
}

.ace-solid-light .ace_support.ace_constant {
  color: rgb(6, 150, 14);
}

.ace-solid-light .ace_support.ace_type,
.ace-solid-light .ace_support.ace_class {
  color: rgb(109, 121, 222);
}

.ace-solid-light .ace_keyword.ace_operator {
  color: rgb(104, 118, 135);
}

.ace-solid-light .ace_string {
  color: rgb(3, 106, 7);
}

.ace-solid-light .ace_comment {
  color: rgb(76, 136, 107);
}

.ace-solid-light .ace_comment.ace_doc {
  color: rgb(0, 102, 255);
}

.ace-solid-light .ace_comment.ace_doc.ace_tag {
  color: rgb(128, 159, 191);
}

.ace-solid-light .ace_constant.ace_numeric {
  color: rgb(0, 0, 205);
}

.ace-solid-light .ace_variable {
  color: rgb(49, 132, 149);
}

.ace-solid-light .ace_xml-pe {
  color: rgb(104, 104, 91);
}

.ace-solid-light .ace_entity.ace_name.ace_function {
  color: #0000A2;
}

.ace-solid-light .ace_heading {
  color: rgb(12, 7, 255);
}

.ace-solid-light .ace_list {
  color:rgb(185, 6, 144);
}

.ace-solid-light .ace_meta.ace_tag {
  color:rgb(0, 22, 142);
}

.ace-solid-light .ace_string.ace_regex {
  color: rgb(255, 0, 0)
}

.ace-solid-light .ace_marker-layer .ace_selection {
  background: rgb(181, 213, 255);
}

.ace-solid-light.ace_multiselect .ace_selection.ace_start {
  box-shadow: 0 0 3px 0px white;
}

.ace-solid-light .ace_marker-layer .ace_step {
  background: rgb(252, 255, 0);
}

.ace-solid-light .ace_marker-layer .ace_stack {
  background: rgb(164, 229, 101);
}

.ace-solid-light .ace_marker-layer .ace_bracket {
  margin: -1px 0 0 -1px;
  border: 1px solid rgb(192, 192, 192);
}

.ace-solid-light .ace_marker-layer .ace_active-line {
  background: rgba(0, 0, 0, 0.07);
}

.ace-solid-light .ace_gutter-active-line {
  background-color : #dcdcdc;
}

.ace-solid-light .ace_marker-layer .ace_selected-word {
  background: rgb(250, 250, 255);
  border: 1px solid rgb(200, 200, 250);
}

.ace-solid-light .ace_indent-guide {
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAE0lEQVQImWP4////f4bLly//BwAmVgd1/w11/gAAAABJRU5ErkJggg==") right repeat-y;
}
`

ace.define("ace/theme/solid_light",["require","exports","module","ace/lib/dom"], function(acequire, exports, module) {

exports.isDark = false;
exports.cssClass = "ace-solid-light";
exports.cssText = aceThemeSolidLightCssText;

var dom = acequire("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
});
