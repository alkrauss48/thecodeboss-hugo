const COLORS = ['teal', 'blue', 'orange'];

module.exports = [
  // themes/thecodeboss/layouts/partials/arrow-down.html
  'border-t-white',
  'border-t-dark',

  ...COLORS.map((color) => [

    // themes/thecodeboss/layouts/partials/home/community.html
    // themes/thecodeboss/layouts/partials/home/portfolio.html
    `bg-${color}`,

    // themes/thecodeboss/layouts/partials/home/community.html
    `bg-${color}-200`,
    `hover:text-${color}`,
    `focus:text-${color}`,
    `border-${color}`,

    // themes/thecodeboss/layouts/partials/home/portfolio.html
    `hover:bg-${color}-500`,
    `focus:bg-${color}-500`,

  ]).flat(),
];
