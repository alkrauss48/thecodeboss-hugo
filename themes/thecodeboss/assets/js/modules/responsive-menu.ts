import menuState from '../states/responsive-menu.state';

const OPEN = 'Open';
const CLOSE = 'Close';

const KEY_ESCAPE = 'Escape';

export const handleTabIndex = () => {
  document
    .querySelectorAll('[data-handle="nav-link"]')
    .forEach((element) => {
      (element as HTMLElement).tabIndex = menuState.isOpen() ? 0 : -1;
    });
};

export const handleAriaAttributes = () => {
  const navToggle = document.getElementById('responsiveNavToggle');

  if (!navToggle) {
    return;
  }

  navToggle.setAttribute('aria-expanded', menuState.isOpen().toString());
};

const setIsOpen = (value: boolean) => {
  menuState.setIsOpen(value);

  const headerBar = document.getElementById('headerBar');
  const label = document.getElementById('responsiveNavToggleText');
  const line1 = document.getElementById('responsiveNavToggleLine1');
  const line2 = document.getElementById('responsiveNavToggleLine2');
  const line3 = document.getElementById('responsiveNavToggleLine3');

  if(! (headerBar && label && line1 && line2 && line3)) {
    return;
  }

  // Change the text content
  label.textContent = value ? CLOSE : OPEN;

  // Toggle line 1 classes
  [
    '-translate-y-2',
    'translate-y-0',
    'rotate-45',
  ].map((className) => line1.classList.toggle(className));

  // Toggle line 2 classes
  [
    'opacity-100',
    'opacity-0',
    'translate-x-3',
  ].map((className) => line2.classList.toggle(className));

  // Toggle line 3 classes
  [
    'translate-y-2',
    'translate-y-0',
    '-rotate-45',
  ].map((className) => line3.classList.toggle(className));

  // Toggle header bar left position
  [
    'left-0',
    '-left-1/2',
  ].map((className) => headerBar.classList.toggle(className));

  // Toggle tabindex of nav link elements
  handleTabIndex();
  handleAriaAttributes();
};

const toggleMainMenu = () => {
  setIsOpen(!menuState.isOpen());
};

export const initMenu = () => {
  const navButton = document.getElementById('responsiveNavToggle');

  if (!navButton) {
    return;
  }

  navButton.addEventListener('click', toggleMainMenu);

  document.addEventListener('keydown', (event) => {
    if (event.key !== KEY_ESCAPE) {
      return;
    }

    setIsOpen(false);
  });
};
