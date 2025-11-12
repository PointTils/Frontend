module.exports = {
  ignoreDirs: [
    'node_modules',
    'dist',
    'build',
    'android',
    'ios',
    '.expo',
    '.output',
  ],

  ignorePatterns: [
    'jest.setup.ts',
    '*.test.ts',
    '*.test.tsx',
    '*.spec.ts',
    '*.spec.tsx',
    '**/__tests__/**',
    'babel.config.js',
    'metro.config.js',
    'jest.config.js',
    'app.config.js',
    'app.config.ts',
  ],

  specials: [
    require('depcheck/special/eslint'),
    require('depcheck/special/jest'),
    require('depcheck/special/typescript'),
    require('depcheck/special/webpack'),
    require('depcheck/special/tslint'),
    require('depcheck/special/babel'),
  ],
  ignoreMatches: [
    // Expo/React Native dependencies
    'expo-splash-screen',
    'expo-dev-client',
    'expo-build-properties',

    // ESLint plugins
    'eslint-plugin-import',

    // Tailwind/styling
    'tailwind-variants',
    'typescript',

    // Gluestack UI components (used through wrapper components)
    '@gluestack-ui/avatar',

    // Jest
    '@testing-library/react-hooks',
    '@types/jest',
  ],
};
