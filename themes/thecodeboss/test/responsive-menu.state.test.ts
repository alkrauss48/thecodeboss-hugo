import {beforeEach, describe, expect, test} from '@jest/globals';

import menuState from '../assets/js/states/responsive-menu.state';

beforeEach(() => {
  menuState.reset();
});

describe('isOpen', () => {
  test('initializes to false', () => {
    expect(menuState.isOpen()).toBe(false);
  });
});

describe('reset', () => {
  test('sets state to false', () => {
    menuState.setIsOpen(true);
    expect(menuState.isOpen()).toBe(true);
    menuState.reset();
    expect(menuState.isOpen()).toBe(false);
  });
});

describe('setIsOpen', () => {
  test('can set opposite state', () => {
    expect(menuState.isOpen()).toBe(false);
    menuState.setIsOpen(true);
    expect(menuState.isOpen()).toBe(true);
  });

  test('can set same state', () => {
    expect(menuState.isOpen()).toBe(false);
    menuState.setIsOpen(false);
    expect(menuState.isOpen()).toBe(false);
  });
});
