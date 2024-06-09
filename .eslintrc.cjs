/* eslint-env node */
/** @type import('eslint').Linter.Config */
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/strict-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:@stylistic/recommended-extends',
  ],
  ignorePatterns: ['dist'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./packages/*/tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
  plugins: ['react-refresh'],
  settings: {
    react: { version: 'detect' },
  },
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    '@stylistic/jsx-one-expression-per-line': 'off',
    '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }],
    // Good premise, but this rule behaves a bit weirdly
    '@stylistic/indent-binary-ops': 'off',
    'max-len': ['warn', 100],
    'no-console': ['warn', { allow: ['info', 'warn', 'error'] }],
    // Why would you not allow numbers??
    '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
  },
}
