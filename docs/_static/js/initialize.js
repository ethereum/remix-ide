// Dependencies: ./utils.js

let mode = getColorMode()
const loadedSvgs = {}

const onDOMContentLoaded = () => {
  preloadFonts();
  rearrangeDom();
  updateEditButtonLabel();
  preloadColorModeIcons();
  cleanSearchInput();
  addHrUnderSearchForm();
  updateMode();
  addFooterNote();
  buildHeader();
  toggleMenu({ force: false });
  updateFlyoverMenu();
}

function main() {
  document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
  document.addEventListener("click", handleGeneralClick);
  document.addEventListener("keydown", handleKeyDown);
}

main()
