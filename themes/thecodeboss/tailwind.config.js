const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ["content/**/*.md", "layouts/**/*.html"],
  safelist: [
    'border-t-white',
    'border-t-dark',
  ],
  theme: {
    extend: {
      borderWidth: {
        '20': '20px',
      },
      colors: {
        blue: {
          200: '#e9f1fd',
          DEFAULT: '#1470e7',
          700: '#1265d0',
        },
        orange: {
          200: '#ffe5d6',
          DEFAULT: '#ff5f00',
        },
        teal: {
          200: '#e7fff9',
          DEFAULT: '#00e7ad',
        },
        dark: {
          400: '#595959',
          500: '#4d4d4d',
          DEFAULT: '#333',
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
