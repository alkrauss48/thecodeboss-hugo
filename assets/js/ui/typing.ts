/**
 * Minimal type-and-delete effect for the home hero.
 *
 * Replaces the `typed.js` dependency, which relicensed from MIT to GPL-3.0
 * in v3.0.0. Only the small subset of behaviour this site used is implemented:
 * type a string, hold, delete it, move to the next, loop forever.
 */

const STRINGS = [
  'Tea Enthusiast',
  'Longboarder',
  'Dad',
  'Developer',
];

const TYPE_SPEED_MS = 40;
const BACK_SPEED_MS = 20;
const HOLD_MS = 1500;
const BETWEEN_MS = 500;

const wait = (ms: number): Promise<void> => new Promise((resolve) => {
  window.setTimeout(resolve, ms);
});

const run = async (el: HTMLElement): Promise<void> => {
  // Respect users who have asked for reduced motion: show the first
  // string and stop, rather than animating indefinitely.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = STRINGS[0];
    return;
  }

  for (let i = 0; ; i = (i + 1) % STRINGS.length) {
    const text = STRINGS[i];

    for (let c = 1; c <= text.length; c += 1) {
      el.textContent = text.slice(0, c);
      await wait(TYPE_SPEED_MS);
    }

    await wait(HOLD_MS);

    for (let c = text.length - 1; c >= 0; c -= 1) {
      el.textContent = text.slice(0, c);
      await wait(BACK_SPEED_MS);
    }

    await wait(BETWEEN_MS);
  }
};

const init = (): void => {
  const el = document.getElementById('typed');

  if (!el) {
    return;
  }

  void run(el);
};

export default {
  init,
};
