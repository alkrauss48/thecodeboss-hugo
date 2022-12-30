import Typed from 'typed.js';

export const init = () => {
  new Typed('#typed', {
    strings: [
      'Tea Enthusiast',
      'Longboarder',
      'Dad',
      'Developer',
    ],
    typeSpeed: 40,
    backSpeed: 20,
  });
}

export default {
  init,
}
