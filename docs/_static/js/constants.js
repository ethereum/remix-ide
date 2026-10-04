// Color mode constants
const COLOR_MODES = [
  { name: "Light", icon: "_static/img/sun.svg", value: "light" },
  { name: "Dark", icon: "_static/img/sunset.svg", value: "dark" },
  { name: "Black", icon: "_static/img/moon.svg", value: "black" },
];

const COLOR_CHOICES = COLOR_MODES.map(({ value }) => value);

const REMIX_LOGO_PATH = "_static/img/remix-logo.svg";
const HAMBURGER_PATH = "_static/img/hamburger.svg";
const CHEVRON_DOWN_PATH = "_static/img/down-arrow.svg";
const NE_ARROW_PATH = "_static/img/northeast-arrow.svg";
const CLOSE_PATH = "_static/img/close.svg";

const COLOR_TOGGLE_ICON_CLASS = "color-toggle-icon";
const MOBILE_MENU_ICON_CLASS = "mobile-menu-toggle-icon";
const REMIX_LOGO_CLASS = "remix-logo";
const LEARN_DROPDOWN_CLASS = "dropdown-button";
const LANGUAGE_BUTTON_CLASS = "language-button";
const LANGUAGE_MENU_ITEMS_CLASS = "language-menu-items";
const THEME_BUTTON_WRAPPER_CLASS = "theme-button-wrapper";
const THEME_BUTTON_CLASS = "theme-button";
const THEME_DROPDOWN_MENU_CLASS = "theme-dropdown-menu";
const SITE_BANNER_CLASS = "site-banner";
const LS_COLOR_SCHEME = "color-scheme";
const LS_DISMISSED_BANNER = "dismissed-banner";

// Navigation constants
const REMIX_HOME_URL = "https://remix-project.org";
const REMIX_DOCS_URL = "/#";
const REMIX_IDE_URL = "https://app.remix.live";

// Learn menu
const LEARNETH_PLUGIN_TUTORIALS_URL = `${REMIX_IDE_URL}/?#activate=LearnEth`;
const VIDEOS_URL = "https://www.youtube.com/channel/UCjTUPyFEr2xDGN6Cg8nKDaA";
const ARTICLES_URL = "https://medium.com/remix-ide";

/**
 * type NavItem = { name: string } & ({ href: string } | { items: NavItem[] })
 */
const NAV_LINKS = [
  { name: "About", href: REMIX_HOME_URL },
  { name: "Documentation", href: REMIX_DOCS_URL },
  { name: "IDE", href: REMIX_IDE_URL },
  {
    name: "Learn",
    items: [
      { name: "Guided IDE Tutorial", href: LEARNETH_PLUGIN_TUTORIALS_URL },
      { name: "Videos", href: VIDEOS_URL },
      { name: "Articles", href: ARTICLES_URL },
    ],
  },
];

/**
 * Site-wide notice, rendered above the header on every page.
 *
 * Set to null to take the banner down. Change `id` whenever the wording
 * changes: dismissals are stored against the id, so a new id shows the new
 * notice to readers who dismissed the previous one.
 *
 * `link.doc` is a source file name without its extension, not a URL: the
 * builder decides whether that page is served as `security.html` (Read the
 * Docs) or `security/` (`make run`, which builds dirhtml), so the banner reads
 * the real link out of the side nav at runtime instead of hardcoding a shape
 * that only works in one of them.
 *
 * type SiteBanner = {
 *   id: string,
 *   lead: string,           // emphasized first sentence
 *   text: string,           // the rest of the message
 *   link?: { label: string, doc: string },
 *   dismissible: boolean,
 * }
 */
const SITE_BANNER = {
  id: "url-migration",
  lead: "Remix has moved to https://app.remix.live.",
  text: "Links to remix.ethereum.org are redirected, so existing bookmarks keep working.",
  link: { label: "Valid Remix URLs", doc: "security" },
  dismissible: true,
};

const MOBILE_MENU_TOGGLE_CLASS = "shift";
const FLYOVER_MENU_TOGGLE_CLASS = "shift-up";
const WRAPPER_CLASS = "unified-wrapper";
