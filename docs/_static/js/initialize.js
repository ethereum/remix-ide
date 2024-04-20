const onDOMContentLoaded = () => {
  // Preload fonts
  preloadFonts();

  // Add color mode button
  addColorModeButton()

  // Update color mode
  updateMode();

  // Add footer note
  addFooterNote();
};

let mode = getColorMode()

function main() {
  document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
}

main()
