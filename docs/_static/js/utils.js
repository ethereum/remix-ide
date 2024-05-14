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
  const index = COLOR_MODES.findIndex(({ value }) => value === mode);
  if (index < 0) return "";
  const next = (index + 1) % COLOR_MODES.length;
  return COLOR_MODES[next].icon;
}

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

/**
 * Retrieves the icon associated with the given mode.
 * @param {string} mode - The mode to retrieve the icon for.
 * @returns {string} The icon associated with the given mode.
 */
const getIconFromMode = (mode) => {
  const match = COLOR_MODES.find(({ value }) => value === mode);
  if (!match) return COLOR_MODES[0].icon;
  return match.icon;
}

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

/**
 * Retrieves the color mode preference.
 * Priority given to query param `color`, then to localStorage `color-scheme`
 * @returns {string} The color mode to use
 */
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

  const lsMode = localStorage.getItem(LS_COLOR_SCHEME);
  return COLOR_CHOICES.includes(lsMode) ? lsMode : COLOR_CHOICES[0];
}

const updateMode = () => {
  // Set the color scheme based on the mode
  localStorage.setItem(LS_COLOR_SCHEME, mode);

  // Select document and set the style attribute to denote color-scheme attribute
  document.documentElement.setAttribute("style", `--color-scheme: ${mode}`);
}

const updateColorModeIcon = () => {
  const themeDropdownButton = document.querySelector("." + THEME_BUTTON_CLASS)
  // Delete any child nodes of theme button
  themeDropdownButton.innerHTML = "";
  // Add latest icon as button children
  appendSvg(getIconFromMode(mode), themeDropdownButton, COLOR_TOGGLE_ICON_CLASS)
};

const setColorMode = (newMode) => {
  if (!COLOR_CHOICES.includes(newMode)) return;
  mode = newMode;
  updateMode();
  updateColorModeIcon();
}

const cycleColorMode = () => {
  if (!COLOR_CHOICES.includes(mode)) return;

  // Set mode to the next color scheme in COLOR_CHOICES array, wrapping to beginning if necessary
  const index = COLOR_CHOICES.indexOf(mode);
  const next = (index + 1) % COLOR_CHOICES.length
  mode = COLOR_CHOICES[next];

  updateMode();

  const colorModeButton = document.querySelector("button.color-toggle");
  updateColorModeIcon(colorModeButton);
}

const moveRstVersions = () => {
  const rstVersions = document.querySelector(".rst-versions");
  if (!rstVersions) return
  rstVersions.remove();
  const wyNavSide = document.querySelector("nav.wy-nav-side");
  wyNavSide.appendChild(rstVersions);
}

const handleGeneralClick = (e) => {
  if (e.target.closest(".backdrop")) {
    toggleMobileMenu({ expanded: false });
  }

  if (e.target.closest("a")) {
    const target = e.target.closest("a");
    const href = target.getAttribute("href");
    if (href.includes(REMIX_HOME_URL)) {
      const url = new URL(href);
      const params = new URLSearchParams(url.search);
      params.set("color", localStorage.getItem(LS_COLOR_SCHEME));
      params.set("lang", document.documentElement.lang);
      url.search = params.toString();
      target.setAttribute("href", url.toString());
    }
  }

  if (!e.target.closest("#" + LEARN_DROPDOWN_CLASS)) {
    toggleMenu(LEARN_DROPDOWN_CLASS, { expanded: false })
  }

  if (!e.target.closest("#" + LANGUAGE_BUTTON_CLASS)) {
    toggleMenu(LANGUAGE_BUTTON_CLASS, { expanded: false });
  }

  if (!e.target.closest("#" + THEME_BUTTON_CLASS)) {
    toggleMenu(THEME_DROPDOWN_MENU_CLASS, { expanded: false });
  }
};

const handleKeyDown = (e) => {
  if (e.metaKey && e.key === "k") {
    document.querySelector("#rtd-search-form input").focus();
  } else if (e.key === "Escape") {
    toggleMobileMenu({ expanded: false });
    toggleMenu(LEARN_DROPDOWN_CLASS, { expanded: false })
    toggleMenu(LANGUAGE_BUTTON_CLASS, { expanded: false });
    toggleMenu(THEME_DROPDOWN_MENU_CLASS, { expanded: false });
  }

  if (e.metaKey && e.code === "Backslash") {
    cycleColorMode();
  }
};

/**
 * ({ expanded: boolean }) => Optional: false closes, true opens
 */
const toggleMenu = (id, options = {}) => {
  const element = document.getElementById(id);
  if (typeof options.expanded === "boolean") {
    element.setAttribute("aria-expanded", options.expanded.toString());
  } else {
    element.setAttribute(
      "aria-expanded",
      element.getAttribute("aria-expanded") === "true" ? "false" : "true"
    );
  }
};

const getDisplayName = (locale) => new Intl.DisplayNames([locale], { type: "language" }).of(locale)

/**
 * Select available language anchor links from flyover menu and return list of objects
 * @returns { { label: string, href: string }[] }
 */
const getLanguages = () => {
  const languageLinksSelector = ".rst-other-versions .injected dl:first-child dd a"
  const links = document.querySelectorAll(languageLinksSelector)
  if (!links) return [];
  return Array.from(links).map((a) => ({ label: getDisplayName(a.textContent), href: a.href }))
}

/**
 * Builds the language list and adds it to the DOM.
 */
const buildLanguageList = () => {
  const languageMenuItemsBox = document.querySelector("." + LANGUAGE_MENU_ITEMS_CLASS);

  const languages = getLanguages()

  const addLanguageToDOM = ({ href, label }) => {
    const langAnchor = document.createElement("a")
    langAnchor.setAttribute("href", href)
    langAnchor.innerText = label
    const isActive = label === getDisplayName(document.documentElement.lang)
    if (isActive) langAnchor.classList.add("active")
    languageMenuItemsBox.appendChild(langAnchor)
  }
  languages.forEach(addLanguageToDOM)
}

/**
 * If the language menu does not have any children, it build the language list.
 */
const checkLanguageMenu = () => {
  const menuHasChildren = document.querySelector("." + LANGUAGE_MENU_ITEMS_CLASS).hasChildNodes()
  if (!menuHasChildren) buildLanguageList();
}

/**
 * Handles the click event for the language button.
 */
const handleLanguageButtonClick = () => {
  checkLanguageMenu();
  toggleMenu(LANGUAGE_BUTTON_CLASS);
}

/**
 * Builds a language button with a menu for selecting different languages.
 *
 * @returns {HTMLElement} The wrapper element containing the language button and menu.
 */
const buildLanguageButton = () => {
  // Add wrapper for button and menu
  const languageMenuWrapper = document.createElement("div");
  languageMenuWrapper.classList.add("language-menu-wrapper");

  // Add trigger button, displaying current language
  const languageButton = document.createElement("button");
  languageButton.classList.add("nav-link");
  languageButton.classList.add(LANGUAGE_BUTTON_CLASS);
  languageButton.id = LANGUAGE_BUTTON_CLASS;
  languageButton.innerText = document.documentElement.lang;
  languageButton.setAttribute("aria-label", "Language menu button");
  languageButton.setAttribute("aria-haspopup", "true");
  languageButton.setAttribute("aria-expanded", "false");
  languageButton.onclick = handleLanguageButtonClick
  appendSvg(CHEVRON_DOWN_PATH, languageButton, "chevron-icon");
  languageMenuWrapper.appendChild(languageButton);

  // Add menu items container
  const languageMenuItemsBox = document.createElement("div");
  languageMenuItemsBox.classList.add(LANGUAGE_MENU_ITEMS_CLASS);
  languageMenuWrapper.appendChild(languageMenuItemsBox);

  // Return wrapper element; languages filled on first open
  return languageMenuWrapper
}
