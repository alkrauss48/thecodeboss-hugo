const COLORS = ['teal', 'blue', 'orange'];

module.exports = [
  // ../layouts/partials/arrow-down.html
  'border-t-white',
  'border-t-dark',

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
