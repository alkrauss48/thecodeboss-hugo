const defaultTheme = require('tailwindcss/defaultTheme');
const safelist = require('./safelist.js');

module.exports = {
  content: ["content/**/*.md", "layouts/**/*.html"],
  safelist,
  theme: {
    extend: {
      borderWidth: {
        '20': '20px',
        '10': '10px',
      },
      boxShadow: {
        'featured': '4px 4px 10px black',
      },
      colors: {
        blue: {
          200: '#e9f1fd',
          500: '#4790ef',
          DEFAULT: '#1470e7',
          700: '#1265d0',
        },
        dark: {
          400: '#595959',
          500: '#4d4d4d',
          DEFAULT: '#333',
        },
        gray: {
          DEFAULT: '#d3d3d3',
        },
        orange: {
          200: '#ffe5d6',
          500: '#ff843b',
          DEFAULT: '#ff5f00',
        },
        teal: {
          200: '#e7fff9',
          500: '#23ffc8',
          DEFAULT: '#00e7ad',
        },
      },
      fontFamily: {
        'sans': ['"Open Sans"', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
