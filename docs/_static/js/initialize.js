// Dependencies: ./utils.js

let mode = getColorMode()

const onDOMContentLoaded = () => {
  // Preload fonts
  preloadFonts();

  // Rearrange DOM elements for styling
  rearrangeDom();

  // Update edit button to "Edit on GitHub"
  updateEditButtonLabel();

  // Add color mode button
  addColorModeButton()

  // Add hr under search form
  addHrUnderSearchForm();

  // Update color mode
  updateMode();

  // Add footer note
  addFooterNote();

  // Build header
  buildHeader();

  // Close menu
  toggleMenu({ force: false });
}

function main() {
  document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
  document.addEventListener("click", handleGeneralClick);
  document.addEventListener("keydown", handleKeyDown);
}

main()
