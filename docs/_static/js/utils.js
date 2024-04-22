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
  appendSvg(colorModeSvgs[mode] ?? getModeIconSrc(mode), button, COLOR_TOGGLE_ICON_CLASS);
};

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
