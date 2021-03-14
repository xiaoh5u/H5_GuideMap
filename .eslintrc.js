module.exports = {
  plugins: ['prettier'],
  root: true,
  parserOptions: {
    sourceType: 'module',
  },
  extends: ['prettier'],
  parser: 'vue-eslint-parser',
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  rules: {
    'prettier/prettier': 'error',
    'no-console': 'off',
  },
};
