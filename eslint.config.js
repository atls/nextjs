const config = require('@atls/config-eslint').eslintFlatConfig

module.exports = [
  config,
  {
    parserOptions: {
      project: './tsconfig.json',
    },
    ignorePatterns: ['.eslintrc.js'],
  },
]
