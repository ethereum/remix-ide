const appendSvg = (path, container, className) => {
  fetch(path)
    .then(response => response.text())
    .then(data => {
      const logoContainer = document.createElement("div");
      className && logoContainer.classList.add(className);
      logoContainer.innerHTML = data;
      container.appendChild(logoContainer);
    });
}

const getModeIconSrc = (mode) => {
  if (!COLOR_CHOICES.includes(mode)) return ""
  if (mode === CLASSIC) return MOON_ICON_PATH;
  if (mode === DARK) return SUN_ICON_PATH;
  return CLASSIC_ICON_PATH;
}

const addFooterNote = () => {
  const contentInfo = document.querySelector("div[role=contentinfo]");
  const footerNote = document.createElement("p");
  footerNote.classList.add("footer-note");
  footerNote.innerHTML =
    'Customized with ❤️ by the <a href="https://ethereum.org/" target="_blank">ethereum.org</a> team.';
  contentInfo.parentNode.insertBefore(footerNote, contentInfo.nextSibling);
};

const updateActiveNavLink = () => {
  const navLinks = document.querySelectorAll(".unified-header .nav-link");
  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (document.documentURI.includes("contributing.html")) {
      link.classList[href.includes("contributing.html") ? "add" : "remove"](
        "active"
      );
    } else {
      link.classList[document.documentURI.includes(href) ? "add" : "remove"](
        "active"
      );
    }
  });
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
  if (colorMode === CLASSIC) return CLASSIC;
  return LIGHT;
}

const updateMode = () => {
  // Set the color scheme based on the mode
  localStorage.setItem(LS_COLOR_SCHEME, mode);

  // Select document and set the style attribute to denote color-scheme attribute
  document.documentElement.setAttribute("style", `--color-scheme: ${mode}`);
}

const updateColorModeIcon = (button) => {
  // Delete any child nodes of toggleButton
  button.innerHTML = "";
  // Add latest icon as button children
  appendSvg(getModeIconSrc(mode), button, COLOR_TOGGLE_ICON_CLASS);
};

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

const cycleColorMode = () => {
  if (!COLOR_CHOICES.includes(mode)) return;

  // Set mode to the next color scheme in COLOR_CHOICES array, wrapping to beginning if necessary
  const index = COLOR_CHOICES.indexOf(mode);
  mode = COLOR_CHOICES[(index + 1) % COLOR_CHOICES.length];

  updateMode();

  const colorModeButton = document.querySelector("button.color-toggle");
  updateColorModeIcon(colorModeButton);
}

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

const updateEditButtonLabel = () => {
  const editButton = document.querySelector(".wy-breadcrumbs-aside a");
  if (!editButton) return;
  editButton.textContent = "Edit on GitHub";
}

const addHrUnderSearchForm = () => {
  const verticalMenu = document.querySelector(".wy-menu-vertical[role=navigation]");
  const hr = document.createElement("hr");
  verticalMenu.parentNode.insertBefore(hr, verticalMenu);
}

const handleRstVersions = () => {
  const rstVersions = document.querySelector(".rst-versions");
  if (!rstVersions) return
  rstVersions.remove();
  const wyNavSide = document.querySelector("nav.wy-nav-side");
  wyNavSide.appendChild(rstVersions);
}

const rearrangeDom = () => {
  const bodyDivs = document.querySelectorAll("body>div");
  bodyDivs.forEach((div) => { div.remove(); });
  const wrapperDiv = document.createElement("div");
  wrapperDiv.classList.add(WRAPPER_CLASS);
  bodyDivs.forEach((div) => wrapperDiv.appendChild(div));
  document.body.prepend(wrapperDiv);

  handleRstVersions()

  const backdrop = document.createElement("div");
  backdrop.classList.add("backdrop");
  wrapperDiv.appendChild(backdrop);

  const content = document.querySelector(".wy-nav-content");
  content.id = "content";
  const oldWrap = document.querySelector("section.wy-nav-content-wrap");
  oldWrap.remove();
  document.querySelector(".wy-grid-for-nav").appendChild(content);
}

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
  const navLinkExcludingDropdown = NAV_LINKS.filter(({ href }) => !!href)
  const linkElements = navLinkExcludingDropdown.map(({ name, href }) => {
    const link = document.createElement("a");
    link.classList.add("nav-link");
    link.setAttribute("key", name);
    link.setAttribute("href", href);
    link.setAttribute("aria-label", name);
    link.innerText = name;
    return link;
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

const handleGeneralClick = (e) => {
  if (e.target.closest(".backdrop")) {
    toggleMenu({ force: false });
  }

  if (e.target.closest("a")) {
    const target = e.target.closest("a");
    const href = target.getAttribute("href");
    if (href.includes(SOLIDITY_HOME_URL)) {
      const url = new URL(href);
      const params = new URLSearchParams(url.search);
      params.set("color", localStorage.getItem(LS_COLOR_SCHEME));
      url.search = params.toString();
      target.setAttribute("href", url.toString());
    }
  }
};

const handleKeyDown = (e) => {
  if (e.metaKey && e.key === "k") {
    document.querySelector("#rtd-search-form input").focus();
  } else if (e.key === "Escape") {
    toggleMenu({ force: false });
  }
  if (e.metaKey && e.code === "Backslash") {
    cycleColorMode();
  }
};
