module.exports = {
  extends: ['plugin:react/recommended', 'plugin:prettier/recommended', 'plugin:@typescript-eslint/recommended'],
  parserOptions: {
    project: './tsconfig.json',
    ecmaVersion: 2020,
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: 'module',
    tsconfigRootDir: __dirname,
  },
  env: {
    browser: true,
    commonjs: true,
    node: true,
    es2020: true,
  },
  plugins: ['react', 'jsx-a11y', 'import'],
  ignorePatterns: ['.eslintrc.js'],
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      rules: {
        'react/prop-types': 'off',
        'react/react-in-jsx-scope': 'off',
        'react/jsx-uses-react': 'off',
        'no-restricted-imports': [
          'error',
          {
            patterns: ['@/features/*/*'],
          },
        ],
      },
    },
  ],
};
