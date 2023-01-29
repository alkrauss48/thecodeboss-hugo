const OPEN = 'Open';
const CLOSE = 'Close';

const KEY_ESCAPE = 'Escape';

interface NavState {
  isOpen: boolean;
}

const state: NavState = {
  isOpen: false,
};

export const handleTabIndex = () => {
  document
    .querySelectorAll('[data-handle="nav-link"]')
    .forEach((element: HTMLElement) => {
      const localElement = element;

      localElement.tabIndex = state.isOpen ? 0 : -1;
    });
};

export const handleAriaAttributes = () => {
  const navToggle = document.getElementById('responsiveNavToggle');

  navToggle.setAttribute('aria-expanded', state.isOpen.toString());
};

const stateHandler = {
  set(obj: NavState, prop: string, value: boolean) {
    const localState = obj;

    if (localState[prop] === value) {
      return;
    }

    const headerBar = document.getElementById('headerBar');
    const label = document.getElementById('responsiveNavToggleText');
    const line1 = document.getElementById('responsiveNavToggleLine1');
    const line2 = document.getElementById('responsiveNavToggleLine2');
    const line3 = document.getElementById('responsiveNavToggleLine3');

    // Set the state value
    localState[prop] = value;

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

    // The following might be an ESLint bug, as this function **should** return
    // `true`, per the docs:
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/set#return_value
    // eslint-disable-next-line consistent-return
    return true;
  },
};

const stateProxy = new Proxy(state, stateHandler);

const toggleMainMenu = () => {
  stateProxy.isOpen = !stateProxy.isOpen;
};

export const initMenu = () => {
  const navButton = document.getElementById('responsiveNavToggle');
  navButton.addEventListener('click', toggleMainMenu);

  document.addEventListener('keydown', (event) => {
    if (event.key !== KEY_ESCAPE) {
      return;
    }

    stateProxy.isOpen = false;
  });
};
