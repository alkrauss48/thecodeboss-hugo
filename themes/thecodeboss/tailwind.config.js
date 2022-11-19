const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ["content/**/*.md", "layouts/**/*.html"],
  safelist: [
    'border-t-white',
  ],
  theme: {
    extend: {
      borderWidth: {
        '20': '20px',
      },
      colors: {
        blue: {
          DEFAULT: '#1470e7',
          700: '#1265d0',
        },
        orange: '#ff5f00',
        teal: '#00e7ad',
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
