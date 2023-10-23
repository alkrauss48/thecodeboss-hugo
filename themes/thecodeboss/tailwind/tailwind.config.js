const defaultTheme = require('tailwindcss/defaultTheme');
const safelist = require('./safelist.js');

module.exports = {
  content: ["content/**/*.md", "layouts/**/*.html"],
  safelist,
  theme: {
    extend: {
      backgroundImage: {
        'particles': "url('/images/particles-bg.jpg')",
      },
      borderWidth: {
        '20': '20px',
        '10': '10px',
      },
      boxShadow: {
        'featured': '4px 4px 10px black',
      },
      colors: {
        // Global Colors
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

        // Taxonomy Colors
        blog: {
          DEFAULT: '#000000',
        },
        talks: {
          DEFAULT: '#9000f0',
        },
        ruby: {
          DEFAULT: '#ff1440',
          700: '#d80028',
        },
        javascript: {
          DEFAULT: '#e6b800',
          700: '#bf9900',
        },
        python: {
          DEFAULT: '#147e55',
          700: '#0f5c3e',
        },
        random: {
          DEFAULT: '#4441d1',
          700: '#2d2aad',
        },
        devops: {
          DEFAULT: '#818187',
          700: '#646469',
        },
        prolog: {
          DEFAULT: '#2e65a3',
          700: '#214875',
        },
        php: {
          DEFAULT: '#f500e4',
          700: '#ba00ad',
        },
        ["front-end"]: {
          DEFAULT: '#d35836',
          700: '#a94225',
        },
        ["non-tech"]: {
          DEFAULT: '#e68600',
          700: '#bf6f00',
        },
        ["how-things-work"]: {
          DEFAULT: '#2ebaf8',
          700: '#07a0e4',
        },
        ["programming-concepts"]: {
          DEFAULT: '#37d552',
          700: '#24ad3c',
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
