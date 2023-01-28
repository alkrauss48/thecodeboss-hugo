import {
  handleTabIndex,
  handleAriaAttributes,
  initMenu,
} from './modules/responsive-menu';

const MD_SCREEN = 768;

initMenu();

if (window.screen.width <= MD_SCREEN) {
  handleTabIndex();
  handleAriaAttributes();
}
