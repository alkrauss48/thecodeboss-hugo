const MD_SCREEN = 768;

import responsiveMenu from './modules/responsive-menu.js';

responsiveMenu.init();

if (window.screen.width <= MD_SCREEN) {
  responsiveMenu.handleTabIndex(false);
}
