module.exports = {
  env: {
    commonjs: true,
    es2020: true,
    node: true,
    'jest/globals': true
  },
  extends: [
    'standard',
    'plugin:jest/recommended',
    'plugin:jest/style'
  ],
  parserOptions: {
    ecmaVersion: 12
  },
  plugins: [
    'jest'
  ],
  rules: {
  }
}
