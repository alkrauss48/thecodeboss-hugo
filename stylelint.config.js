/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard'],
  rules: {
    // Tailwind CSS v4 at-rules.
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'apply',
          'custom-variant',
          'plugin',
          'reference',
          'source',
          'theme',
          'utility',
          'variant',
        ],
      },
    ],
    // `@theme` and `@utility` are custom at-rules; stylelint cannot resolve
    // the Tailwind-specific descriptors inside them.
    'at-rule-descriptor-no-unknown': null,
    'at-rule-prelude-no-invalid': null,
    // Tailwind v4 requires `@import "tailwindcss"`; url() is not accepted.
    'import-notation': 'string',
    // Blank lines group the palette into readable sections.
    'custom-property-empty-line-before': null,
    // Font family names are proper nouns ("Open Sans", Arial, Roboto).
    'value-keyword-case': null,
  },
};
