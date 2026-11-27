// ESLint flat config. Browser scripts are classic scripts (concatenated into one
// bundle); everything under tools/, src/data and src/components runs in Node.
const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  { ignores: ['node_modules/', 'assets/js/', 'test-results/', 'playwright-report/', 'deliverables/', '**/*.ts'] },
  js.configs.recommended,
  {
    files: ['src/scripts/**/*.js', 'assets/walkthroughs/**/*.js'],
    languageOptions: { ecmaVersion: 2020, sourceType: 'script', globals: { ...globals.browser, module: 'readonly' } },
  },
  {
    files: ['tools/**/*.js', 'src/data/**/*.js', 'src/components/**/*.js', 'qa/**/*.js', 'eslint.config.js'],
    languageOptions: { ecmaVersion: 2023, sourceType: 'commonjs', globals: { ...globals.node } },
  },
  {
    // QA and asset scripts pass callbacks to page.evaluate(), which run in the browser
    files: ['qa/**/*.js', 'tools/render-assets.js'],
    languageOptions: { globals: { ...globals.browser } },
  },
  {
    rules: {
      'no-unused-vars': ['error', { args: 'none', caughtErrors: 'none' }],
      eqeqeq: ['error', 'smart'],
      'no-var': 'off',
      'prefer-const': 'off',
    },
  },
];
