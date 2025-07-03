module.exports = {
  // ESLint가 무시할 파일 또는 폴더 패턴을 정의합니다.
  // 이 경우, ESLint 설정 파일 자체는 린트 대상에서 제외합니다.
  ignorePatterns: ['**/*.cjs'], // 또는 ['.eslintrc.cjs', '.prettierrc.cjs'],
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  env: {
    browser: true,
    es2020: true,
    webextensions: true,
  },
  overrides: [
    {
      files: ['*.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
};
