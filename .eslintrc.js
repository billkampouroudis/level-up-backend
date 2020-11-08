module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2021: true
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  plugins: ['prettier'],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 12
  },
  rules: {
    // Possible Errors
    'no-console': 'off',
    'no-empty': ['error', { allowEmptyCatch: true }],

    // Stylistic Issues
    quotes: ['warn', 'single', { allowTemplateLiterals: true }],
    'brace-style': ['warn'],
    'no-multiple-empty-lines': ['warn', { max: 1 }],
    'no-trailing-spaces': ['warn'],
    'no-unneeded-ternary': ['warn'],
    'comma-spacing': ['warn'],
    'comma-style': ['warn'],
    'comma-dangle': ['warn'],
    'eol-last': ['warn'],
    'block-spacing': ['warn'],

    // Best Practices
    eqeqeq: ['error', 'always', { null: 'ignore' }],
    'no-multi-spaces': ['warn', { ignoreEOLComments: true }],
    curly: ['warn']
  }
};
