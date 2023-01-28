import Typed from 'typed.js';

const init = () => {
  const typedConfig = new Typed('#typed', {
    strings: [
      'Tea Enthusiast',
      'Longboarder',
      'Dad',
      'Developer',
    ],
    typeSpeed: 40,
    backSpeed: 20,
  });

  return typedConfig;
};

export default {
  init,
};
