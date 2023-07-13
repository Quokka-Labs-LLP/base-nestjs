module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:sonarjs/recommended',
    'plugin:jsdoc/recommended-typescript-error'
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js', 'dist/*'],
  rules: {
    'jsdoc/require-jsdoc': [1, {
      publicOnly: true,
      contexts: [
        "ArrowFunctionExpression",
        "FunctionDeclaration",
        "FunctionExpression",
        "MethodDefinition",
        "ClassDeclaration",
        "ClassExpression",
        "ClassProperty",
        "TSDeclareFunction", // function without body
        "TSEnumDeclaration",
        "TSInterfaceDeclaration",
        "TSModuleDeclaration", // namespace
      ]
    }],
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
