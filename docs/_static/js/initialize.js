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
  setupImageZoom();
};

function main() {
  // Registered before DOMContentLoaded so the event is not missed if addons data arrives first
  document.addEventListener("readthedocs-addons-data-ready", handleAddonsDataReady);
  document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
  document.addEventListener("click", handleGeneralClick);
  document.addEventListener("keydown", handleKeyDown);
}

main();
