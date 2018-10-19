var styles = require('../../ui/styles-guide/styleGuideDark')()

// based on @see https://github.com/thlorenz/brace/blob/v0.8.0/theme/tomorrow_night_blue.js
var aceThemeSolidBlueCssText = `
.ace-solid-blue .ace_gutter {
  background: #00204b;
  color: #7388b5
}

.ace-solid-blue .ace_print-margin {
  width: 1px;
  background: #00204b
}

.ace-solid-blue {
  background-color: #002451;
  color: #FFFFFF
}

.ace-solid-blue .ace_constant.ace_other,
.ace-solid-blue .ace_cursor {
  color: #FFFFFF
}

.ace-solid-blue .ace_marker-layer .ace_selection {
  background: #003F8E
}

.ace-solid-blue.ace_multiselect .ace_selection.ace_start {
  box-shadow: 0 0 3px 0px #002451;
}

.ace-solid-blue .ace_marker-layer .ace_step {
  background: rgb(127, 111, 19)
}

.ace-solid-blue .ace_marker-layer .ace_bracket {
  margin: -1px 0 0 -1px;
  border: 1px solid #404F7D
}

.ace-solid-blue .ace_marker-layer .ace_active-line {
  background: #00346E
}

.ace-solid-blue .ace_gutter-active-line {
  background-color: #022040
}

.ace-solid-blue .ace_marker-layer .ace_selected-word {
  border: 1px solid #003F8E
}

.ace-solid-blue .ace_invisible {
  color: #404F7D
}

.ace-solid-blue .ace_keyword,
.ace-solid-blue .ace_meta,
.ace-solid-blue .ace_storage,
.ace-solid-blue .ace_storage.ace_type,
.ace-solid-blue .ace_support.ace_type {
  color: #EBBBFF
}

.ace-solid-blue .ace_keyword.ace_operator {
  color: #99FFFF
}

.ace-solid-blue .ace_constant.ace_character,
.ace-solid-blue .ace_constant.ace_language,
.ace-solid-blue .ace_constant.ace_numeric,
.ace-solid-blue .ace_keyword.ace_other.ace_unit,
.ace-solid-blue .ace_support.ace_constant,
.ace-solid-blue .ace_variable.ace_parameter {
  color: #FFC58F
}

.ace-solid-blue .ace_invalid {
  color: #FFFFFF;
  background-color: #F99DA5
}

.ace-solid-blue .ace_invalid.ace_deprecated {
  color: #FFFFFF;
  background-color: #EBBBFF
}

.ace-solid-blue .ace_fold {
  background-color: #BBDAFF;
  border-color: #FFFFFF
}

.ace-solid-blue .ace_entity.ace_name.ace_function,
.ace-solid-blue .ace_support.ace_function,
.ace-solid-blue .ace_variable {
  color: #BBDAFF
}

.ace-solid-blue .ace_support.ace_class,
.ace-solid-blue .ace_support.ace_type {
  color: #FFEEAD
}

.ace-solid-blue .ace_heading,
.ace-solid-blue .ace_markup.ace_heading,
.ace-solid-blue .ace_string {
  color: #D1F1A9
}

.ace-solid-blue .ace_entity.ace_name.ace_tag,
.ace-solid-blue .ace_entity.ace_other.ace_attribute-name,
.ace-solid-blue .ace_meta.ace_tag,
.ace-solid-blue .ace_string.ace_regexp,
.ace-solid-blue .ace_variable {
  color: #FF9DA4
}

.ace-solid-blue .ace_comment {
  color: #7285B7
}

.ace-solid-blue .ace_indent-guide {
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWNgYGBgYJDzqfwPAANXAeNsiA+ZAAAAAElFTkSuQmCC) right repeat-y
}
`

ace.define("ace/theme/solid_blue",["require","exports","module","ace/lib/dom"], function(acequire, exports, module) {

exports.isDark = true;
exports.cssClass = "ace-solid-blue";
exports.cssText = aceThemeSolidBlueCssText;

var dom = acequire("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);

});
