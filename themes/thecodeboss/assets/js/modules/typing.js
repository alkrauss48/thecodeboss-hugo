import Typed from 'typed.js';

export const init = () => {
  new Typed('#typed', {
    stringsElement: '#typed-strings',
    typeSpeed: 40,
    backSpeed: 20,
  });
}

export default {
  init,
}
