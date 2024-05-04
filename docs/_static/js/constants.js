// Color mode constants
const COLOR_MODES = [
  { name: "Light", icon: "_static/img/sun.svg", value: "light" },
  { name: "Classic", icon: "_static/img/classic.svg", value: "classic" },
  { name: "Dark", icon: "_static/img/moon.svg", value: "dark" },
]

const COLOR_CHOICES = COLOR_MODES.map(({ value }) => value);

const REMIX_LOGO_PATH = "_static/img/remix-logo.svg"
const HAMBURGER_PATH = "_static/img/hamburger.svg";
const CHEVRON_DOWN_PATH = "_static/img/down-arrow.svg";
const NE_ARROW_PATH = "_static/img/northeast-arrow.svg";

const COLOR_TOGGLE_ICON_CLASS = "color-toggle-icon";
const MOBILE_MENU_ICON_CLASS = "mobile-menu-toggle-icon";
const REMIX_LOGO_CLASS = "remix-logo";
const LEARN_DROPDOWN_CLASS = "dropdown-button"
const LANGUAGE_BUTTON_CLASS = "language-button"
const LANGUAGE_MENU_ITEMS_CLASS = "language-menu-items"
const THEME_BUTTON_WRAPPER_CLASS = "theme-button-wrapper";
const THEME_BUTTON_CLASS = "theme-button";
const THEME_DROPDOWN_MENU_CLASS = "theme-dropdown-menu";
const LS_COLOR_SCHEME = "color-scheme";

// Navigation constants
// const REMIX_HOME_URL = "https://remix-project.org"; // TODO: Revert for production
const REMIX_HOME_URL = "https://remix-dev.netlify.app";
// const REMIX_DOCS_URL = "https://remix-ide.readthedocs.io" // TODO: Revert for production
const REMIX_DOCS_URL = "/#"
const REMIX_IDE_URL = "https://remix.ethereum.org";
const REMIX_REWARDS_URL = "https://rewards.remix.ethereum.eth.limo"; // TODO: Remove?

// Learn menu
const LEARNETH_PLUGIN_TUTORIALS_URL = `${REMIX_IDE_URL}/?#activate=LearnEth`;
const VIDEOS_URL = "https://www.youtube.com/channel/UCjTUPyFEr2xDGN6Cg8nKDaA";
const ARTICLES_URL = "https://medium.com/remix-ide";

/**
 * type NavItem = { name: string } & ({ href: string } | { items: NavItem[] })
 */
const NAV_LINKS = [
  { name: "Remix Project", href: REMIX_HOME_URL },
  { name: "Documentation", href: REMIX_DOCS_URL },
  { name: "IDE", href: REMIX_IDE_URL },
  {
    name: "Learn", items: [
      { name: "Guided IDE Tutorial", href: LEARNETH_PLUGIN_TUTORIALS_URL },
      { name: "Videos", href: VIDEOS_URL },
      { name: "Articles", href: ARTICLES_URL },
    ]
  },
]

const MOBILE_MENU_TOGGLE_CLASS = "shift";
const FLYOVER_MENU_TOGGLE_CLASS = "shift-up";
const WRAPPER_CLASS = "unified-wrapper";

