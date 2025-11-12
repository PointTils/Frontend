module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?@?react-native|@react-native-community|expo(nent)?|expo-.*|@expo(nent)?/.*|@expo-google-fonts/.*|@react-navigation|react-native-svg|react-native-reanimated|nativewind|react-native-css-interop|@gluestack-ui)/)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{ts,tsx}',
    '<rootDir>/app/**/*.{ts,tsx}',
    '!<rootDir>/src/components/ui/**',
    '!<rootDir>/src/assets/**',
    '!<rootDir>/src/contexts/**',
    '!<rootDir>/app/**/_layout.tsx',
    '!**/*.d.ts',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/android/',
    '/.github/',
    '/tests/',
  ],
};
