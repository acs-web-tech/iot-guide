import loveConfig from 'eslint-config-love'

export default [
  loveConfig,  // base config, applies globally

  {
     files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
  },
]
