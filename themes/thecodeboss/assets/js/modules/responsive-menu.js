const OPEN = 'Open';
const CLOSE = 'Close';

const state = {
  isOpen: false,
};

const stateHandler = {
  set(obj, prop, value) {
    const headerBar = document.getElementById("headerBar");
    const label = document.getElementById("responsiveNavToggleText");
    const line1 = document.getElementById("responsiveNavToggleLine1");
    const line2 = document.getElementById("responsiveNavToggleLine2");
    const line3 = document.getElementById("responsiveNavToggleLine3");

    // Set the state value
    obj[prop] = value;

    // Change the text content
    label.textContent = value ? CLOSE : OPEN;

    // Toggle line 1 classes
    [
      '-translate-y-2',
      'translate-y-0',
      'rotate-45',
    ].map(className => line1.classList.toggle(className));

    // Toggle line 2 classes
    [
      'opacity-100',
      'opacity-0',
      'translate-x-3',
    ].map(className => line2.classList.toggle(className));

    // Toggle line 3 classes
    [
      'translate-y-2',
      'translate-y-0',
      '-rotate-45',
    ].map(className => line3.classList.toggle(className));

    // Toggle header bar left position
    [
      'left-0',
      '-left-1/2',
    ].map(className => headerBar.classList.toggle(className));

    // Toggle tabindex of nav link elements
    handleTabIndex(value);

    return true;
  },
};

const stateProxy = new Proxy(state, stateHandler);

const toggleMainMenu = (event) => {
  stateProxy.isOpen = !stateProxy.isOpen;
};

export const handleTabIndex = (shouldBeFocusable) => {
  document
    .querySelectorAll('[data-handle="nav-link"]')
    .forEach((element) => {
      element.tabIndex = shouldBeFocusable ? 0 : -1;
    });
};

export const init = () => {
  const navButton = document.getElementById("responsiveNavToggle");
  navButton.addEventListener("click", toggleMainMenu);
}

export default {
  handleTabIndex,
  init,
}
