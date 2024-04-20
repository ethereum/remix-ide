const getModeIconSrc = (mode) => {
  if (!COLOR_CHOICES.includes(mode)) return ""
  if (mode === REMIX) return MOON_ICON_PATH;
  if (mode === DARK) return SUN_ICON_PATH;
  return REMIX_ICON_PATH;
}

const addFooterNote = () => {
  const contentInfo = document.querySelector("div[role=contentinfo]");
  const footerNote = document.createElement("p");
  footerNote.classList.add("footer-note");
  footerNote.innerHTML =
    'Customized with ❤️ by the <a href="https://ethereum.org/" target="_blank">ethereum.org</a> team.';
  contentInfo.parentNode.insertBefore(footerNote, contentInfo.nextSibling);
};

const removeColorParam = () => {
  const { location, title } = document;
  const { pathname, origin, search, hash } = location;
  const newSearchParams = new URLSearchParams(search);
  newSearchParams.delete("color");
  const sanitizedSearch =
    newSearchParams.size < 1 ? "" : "?" + newSearchParams.toString();
  window.history.replaceState(
    origin,
    title,
    pathname + sanitizedSearch + hash
  );
}

const getColorMode = () => {
  // Check localStorage for existing color scheme preference
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.size > 0) {
    // This is used for color mode continuity between the main Remix site and the docs
    const colorSchemeParam = urlParams.get("color");
    // Remove "color" search param from URL
    removeColorParam();
    if (COLOR_CHOICES.includes(colorSchemeParam)) return colorSchemeParam;
  }

  const colorMode = localStorage.getItem(LS_COLOR_SCHEME);
  if (colorMode === DARK) return DARK;
  if (colorMode === REMIX) return REMIX;
  return LIGHT;
}

let mode = getColorMode()

const cycleColorMode = () => {
  if (!COLOR_CHOICES.includes(mode)) return;

  // Set mode to the next color scheme in COLOR_CHOICES array, wrapping to beginning if necessary
  const index = COLOR_CHOICES.indexOf(mode);
  mode = COLOR_CHOICES[(index + 1) % COLOR_CHOICES.length];

  localStorage.setItem(LS_COLOR_SCHEME, mode);
  document.documentElement.setAttribute('style', mode);
  updateColorModeIcon();
}

const addColorModeButton = () => {
  // Prepare the toggle icon according to color mode
  const toggleIcon = document.createElement("img");
  toggleIcon.classList.add(COLOR_TOGGLE_ICON_CLASS);
  toggleIcon.src = getModeIconSrc(mode);
  toggleIcon.alt = "Color mode toggle icon";
  toggleIcon.setAttribute("aria-hidden", "true");
  toggleIcon.setAttribute("key", "toggle icon");

  // Create a new button element
  const colorModeButton = document.createElement("button");
  colorModeButton.classList.add("color-toggle");
  colorModeButton.setAttribute("type", "button");
  colorModeButton.setAttribute("aria-label", "Toggle light dark mode");
  colorModeButton.setAttribute("key", "color mode button");
  colorModeButton.onclick = cycleColorMode;

  // Append the icon into the button
  colorModeButton.appendChild(toggleIcon);

  // Select the side nav search container
  const sideNavSearch = document.querySelector('.wy-side-nav-search');

  // Remove the anchor and div.version siblings before the input
  const anchor = sideNavSearch.querySelector('a');
  const versionDiv = sideNavSearch.querySelector('div.version');
  if (anchor) sideNavSearch.removeChild(anchor);
  if (versionDiv) sideNavSearch.removeChild(versionDiv);

  // Insert the button before the search input
  const searchInput = sideNavSearch.querySelector('[role="search"]');
  sideNavSearch.insertBefore(colorModeButton, searchInput);
}

const updateColorModeIcon = () => {
  const toggleIcon = document.querySelector(`.${COLOR_TOGGLE_ICON_CLASS}`);
  // Remix shows Moon => Dark mode shows Sun => Light mode shows Remix logo -> repeat
  toggleIcon.src = getModeIconSrc(mode);
}

const initialize = () => {
  // Preload fonts
  const fonts = [
    "Helvetica.ttc",
  ];
  fonts.forEach((filename) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "font";
    // link.href = `https://remix-ide.readthedocs.io/en/latest/_static/fonts/${filename}`;
    link.href = `_static/fonts/${filename}`;
    link.crossOrigin = "";
    document.head.appendChild(link);
  });

  addColorModeButton()
  localStorage.setItem(LS_COLOR_SCHEME, mode);

  // Select the root element and set the style attribute to denote color-scheme attribute
  document
    .querySelector(":root")
    .setAttribute("style", `--color-scheme: ${mode}`);

  // Add footer note
  addFooterNote();

/**
 * Handle general click events
 */
// const handleClick = (e) => {
//   if (e.target.closest(".selector")) {
//     // Do something
//   }
// };

/**
 * Handle general keydown events
 */
// const handleKeyDown = (e) => {
//   if (e.key === "key") {
//     // Do something
//   }
// };

function main() {
  document.addEventListener("DOMContentLoaded", initialize);
  // document.addEventListener("click", handleClick);
  // document.addEventListener("keydown", handleKeyDown);
}

main()
