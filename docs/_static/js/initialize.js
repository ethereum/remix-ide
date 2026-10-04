// Dependencies: ./utils.js

let mode = getColorMode();
const loadedSvgs = {};

const onDOMContentLoaded = () => {
  preloadFonts();
  rearrangeDom();
  updateEditButtonLabel();
  preloadColorModeIcons();
  cleanSearchInput();
  addHrUnderSearchForm();
  updateMode();
  buildHeader();
  buildSiteBanner();
  addFooterNote();
  updateFooterButtonIcons();
  toggleMobileMenu({ expanded: false });
  updateFlyoverMenu();
  setTimeout(hideFlyoverMenu, 250);
  setupImageZoom();
};

function main() {
  document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
  document.addEventListener("click", handleGeneralClick);
  document.addEventListener("keydown", handleKeyDown);
}

main();
