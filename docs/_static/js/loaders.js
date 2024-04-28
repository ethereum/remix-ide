/**
 * Preloads fonts by dynamically creating link elements in the document head.
 */
const preloadFonts = () => {
  const fonts = [
    "Helvetica.ttc",
  ];
  fonts.forEach((filename) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "font";
    link.href = `_static/fonts/${filename}`;
    link.crossOrigin = "";
    document.head.appendChild(link);
  });
}

/**
 * Rearranges the DOM structure by moving all the body divs into a wrapper div,
 * adding a backdrop div, and repositioning the content element.
 */
const rearrangeDom = () => {
  const bodyDivs = document.querySelectorAll("body>div");
  bodyDivs.forEach((div) => { div.remove(); });
  const wrapperDiv = document.createElement("div");
  wrapperDiv.classList.add(WRAPPER_CLASS);
  bodyDivs.forEach((div) => wrapperDiv.appendChild(div));
  document.body.prepend(wrapperDiv);

  moveRstVersions()

  const backdrop = document.createElement("div");
  backdrop.classList.add("backdrop");
  wrapperDiv.appendChild(backdrop);

  const content = document.querySelector(".wy-nav-content");
  content.id = "content";
  const oldWrap = document.querySelector("section.wy-nav-content-wrap");
  oldWrap.remove();
  document.querySelector(".wy-grid-for-nav").appendChild(content);
}

/**
 * Updates the label of the edit button.
 */
const updateEditButtonLabel = () => {
  const editButton = document.querySelector(".wy-breadcrumbs-aside a");
  if (!editButton) return;
  editButton.textContent = "Edit on GitHub";
}

/**
 * Preload color-mode icons, storing them in the colorModeSvgs object.
 */
const preloadColorModeIcons = () => {
  const icons = COLOR_MODES.map(({ icon }) => icon);
  icons.forEach((path, idx) => {
    fetch(path)
      .then(response => response.text())
      .then(data => {
        colorModeSvgs[icons[idx].value] = data;
      })
  })
}

/**
 * Adds a color mode button to the side navigation bar.
 */
const addColorModeButton = () => {
  // Create a new button element
  const colorModeButton = document.createElement("button");
  colorModeButton.classList.add("color-toggle");
  colorModeButton.setAttribute("type", "button");
  colorModeButton.setAttribute("aria-label", "Toggle light dark mode");
  colorModeButton.setAttribute("key", "color mode button");
  colorModeButton.onclick = cycleColorMode;  
  // Update the icon for this button according to the current mode
  updateColorModeIcon(colorModeButton);

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

/**
 * Adds a horizontal rule (hr) element under the search form in the vertical menu.
 */
const addHrUnderSearchForm = () => {
  const verticalMenu = document.querySelector(".wy-menu-vertical[role=navigation]");
  const hr = document.createElement("hr");
  verticalMenu.parentNode.insertBefore(hr, verticalMenu);
}

/**
 * Adds a footer note to the content info section.
 */
const addFooterNote = () => {
  const contentInfo = document.querySelector("div[role=contentinfo]");
  const footerNote = document.createElement("p");
  footerNote.classList.add("footer-note");
  footerNote.innerHTML =
    'Customized with ❤️ by the <a href="https://ethereum.org/" target="_blank">ethereum.org</a> team.';
  contentInfo.parentNode.insertBefore(footerNote, contentInfo.nextSibling);
};

/**
 * Builds the header element for the website app
 */
const buildHeader = () => {
  const header = document.createElement("div");
  header.classList.add("unified-header");
  console.log(header)
  document.querySelector(`.${WRAPPER_CLASS}`).prepend(header);

  const innerHeader = document.createElement("div");
  innerHeader.classList.add("inner-header");
  header.appendChild(innerHeader);

  const homeLink = document.createElement("a");
  homeLink.classList.add("home-link");
  homeLink.href = REMIX_HOME_URL;
  homeLink.ariaLabel = "Remix project home";
  innerHeader.appendChild(homeLink);

  appendSvg(REMIX_LOGO_PATH, homeLink, REMIX_LOGO_CLASS);

  const skipToContent = document.createElement("a");
  skipToContent.classList.add("skip-to-content");
  skipToContent.href = "#content";
  skipToContent.innerText = "skip to content";
  innerHeader.appendChild(skipToContent);

  const navBar = document.createElement("nav");
  navBar.classList.add("nav-bar");
  innerHeader.appendChild(navBar);

  /**
   * type NavItem = { name: string } & ({ href: string } | { items: NavItem[] })
   */
  const linkElements = NAV_LINKS.map(({ name, href, items }) => {
    if (href) {
      const link = document.createElement("a");
      link.classList.add("nav-link");
      link.setAttribute("key", name);
      link.setAttribute("href", href);
      link.setAttribute("aria-label", name);
      link.innerText = name;
      return link;
    }
    // Learn menu dropdown
    if (items) {
      const dropdown = document.createElement("div");
      dropdown.classList.add("nav-dropdown");
      dropdown.setAttribute("key", name);
      
      // Return button, styled the same as the other links, with a chevron icon
      const button = document.createElement("button");
      button.classList.add("nav-link");
      button.classList.add("dropdown-button");
      button.id = "dropdown-button";
      button.innerText = name;
      button.setAttribute("key", name);
      button.setAttribute("aria-label", name);
      button.setAttribute("aria-haspopup", "true");
      button.setAttribute("aria-expanded", "false");
      button.onclick = toggleDropdown;
      const dropdownItemsBox = document.createElement("div");
      dropdownItemsBox.classList.add("dropdown-items");
      dropdown.appendChild(button);
      dropdown.appendChild(dropdownItemsBox);

      const dropdownItems = items.map(({ name, href }) => {
        const item = document.createElement("a");
        item.classList.add("dropdown-item");
        item.setAttribute("key", name);
        item.setAttribute("href", href);
        item.setAttribute("aria-label", name);
        item.innerText = name;
        return item;
      });
      dropdownItems.forEach((item) => dropdownItemsBox.appendChild(item));
      return dropdown;
    }
  });
  linkElements.forEach((link) => navBar.appendChild(link));

  // Flex wrapper for color mode and mobile menu buttons
  const navButtonContainer = document.createElement("div");
  navButtonContainer.classList.add("nav-button-container");
  navBar.appendChild(navButtonContainer);

  // Build mobile hamburger menu
  const menuButton = document.createElement("button");
  menuButton.classList.add("mobile-menu-button");
  menuButton.setAttribute("type", "button");
  menuButton.setAttribute("aria-label", "Toggle menu");
  menuButton.setAttribute("key", "menu button");
  menuButton.addEventListener("click", toggleMenu);
  appendSvg(HAMBURGER_PATH, menuButton, MOBILE_MENU_ICON_CLASS);
  navButtonContainer.appendChild(menuButton);
}

/**
 * Toggles the mobile menu.
 * @param {Object} options - The options object.
 * @param {boolean} options.force - forces the menu to open (true) or close (false).
 */
const toggleMenu = (options = {}) => {
  const handleClassToggle = ({ classList }, className) => {
    if (typeof options.force !== "undefined") {
      classList.toggle(className, options.force);
    } else {
      classList.toggle(className);
    }
  };
  document
    .querySelectorAll('[data-toggle="rst-versions"]')
    .forEach((e) => handleClassToggle(e, MOBILE_MENU_TOGGLE_CLASS));
  document
    .querySelectorAll('[data-toggle="wy-nav-shift"]')
    .forEach((e) => handleClassToggle(e, MOBILE_MENU_TOGGLE_CLASS));
  handleClassToggle(document.querySelector(`.${WRAPPER_CLASS}`), "menu-open");
}
