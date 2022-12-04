const COLORS = ['teal', 'blue', 'orange'];

module.exports = [
  // ../layouts/partials/arrow-down.html
  'border-t-white',
  'border-t-dark',

  // ../assets/js/modules/responsive-menu.js
  '-left-1/2', // headerBar
  'translate-y-0', // responsiveNavToggleLine1, responsiveNavToggleLine3
  'rotate-45', // responsiveNavToggleLine1
  'opacity-0', // responsiveNavToggleLine2
  'translate-x-3', // responsiveNavToggleLine2
  '-rotate-45', //  responsiveNavToggleLine3

  ...COLORS.map((color) => [

    // ../layouts/partials/home/community.html
    // ../layouts/partials/home/portfolio.html
    `bg-${color}`,

    // ../layouts/partials/home/community.html
    `bg-${color}-200`,
    `group-hover:text-${color}`,
    `group-focus:text-${color}`,
    `border-${color}`,

    // ../layouts/partials/home/portfolio.html
    `hover:bg-${color}-500`,
    `focus:bg-${color}-500`,

  ]).flat(),
];
