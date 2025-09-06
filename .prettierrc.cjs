// .prettierrc.cjs
/** @type {import("prettier").Config} */

module.exports = {
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  tabWidth: 2,
  printWidth: 100,
  bracketSpacing: true,
  arrowParens: 'always',
  singleAttributePerLine: true,

  // Plugins
  plugins: ['@ianvs/prettier-plugin-sort-imports', 'prettier-plugin-tailwindcss'],

  // Import sorting rules
  importOrder: [
    '^react$',
    '^next',
    '<THIRD_PARTY_MODULES>',
    '',
    '^@/components/(.*)$',
    '^@/lib/(.*)$',
    '^@/hooks/(.*)$',
    '^@/styles/(.*)$',
    '',
    '^[./]',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
