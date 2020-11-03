module.exports = {
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'script',
    impliedStrict: true
  },
  env: {
    browser: true,
    node: true
  },
  globals: {
    readline: 'readonly'
  },
  extends: ['eslint:recommended', 'prettier', 'plugin:prettier/recommended'],
  rules: {
    semi: ['error', 'always'],
    quotes: ['error', 'single']
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",
  }
};
