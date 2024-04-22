// Color mode constants
const [CLASSIC, DARK, LIGHT] = ["classic", "dark", "light"];
const COLOR_CHOICES = [CLASSIC, DARK, LIGHT]

const SUN_ICON_PATH = "_static/img/sun.svg";
const MOON_ICON_PATH = "_static/img/moon.svg";
const CLASSIC_ICON_PATH = "_static/img/classic.svg";

const REMIX_LOGO_PATH = "_static/img/remix-logo.svg"
const HAMBURGER_PATH = "_static/img/hamburger.svg";

const COLOR_TOGGLE_ICON_CLASS = "color-toggle-icon";
const MOBILE_MENU_ICON_CLASS = "mobile-menu-toggle-icon";
const REMIX_LOGO_CLASS = "remix-logo";
const LS_COLOR_SCHEME = "color-scheme";

// Navigation constants
const REMIX_HOME_URL = "https://remix-project.org";
const REMIX_IDE_URL = "https://remix.ethereum.org";
const REMIX_DOCS_URL = "https://remix-ide.readthedocs.io"
const REMIX_REWARDS_URL = "https://rewards.remix.ethereum.eth.limo";

// Instantiate all `href` values from below as constants (default to empty strings)
const ABOUT_ID = "#about";
const IDE_ID = "#ide";
const PLUGINS_ID = "#plugins";
const LIBRARIES_ID = "#libraries";
const EVENTS_ID = "#events";
const REWARDS_ID = "#rewards";
const TEAM_ID = "#team";

// Learn menu
const LEARNETH_PLUGIN_TUTORIALS_URL = `${REMIX_IDE_URL}/?#activate=LearnEth`;
const VIDEOS_URL = "https://www.youtube.com/channel/UCjTUPyFEr2xDGN6Cg8nKDaA";
const ARTICLES_URL = "https://medium.com/remix-ide";

/**
 * type NavItem = { name: string } & ({ href: string } | { items: NavItem[] })
 */
const NAV_LINKS = [
  { name: "About", href: ABOUT_ID },
  {
    name: "Learn", items: [
      { name: "LearnEth Plugin Tutorials", href: LEARNETH_PLUGIN_TUTORIALS_URL },
      { name: "Videos", href: VIDEOS_URL },
      { name: "Articles", href: ARTICLES_URL },
    ]
  },
  { name: "IDE", href: IDE_ID },
  { name: "Plugins", href: PLUGINS_ID },
  { name: "Libraries", href: LIBRARIES_ID },
  { name: "Events", href: EVENTS_ID },
  { name: "Rewards", href: REWARDS_ID },
  { name: "Team", href: TEAM_ID },
].map((item) => {
  if (item.href && item.href.startsWith("#")) {
    return { ...item, href: REMIX_HOME_URL + "/" + item.href }
  }
  return item
})

const MOBILE_MENU_TOGGLE_CLASS = "shift";
const WRAPPER_CLASS = "unified-wrapper";
