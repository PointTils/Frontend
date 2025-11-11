module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?@?react-native|@react-native-community|expo(nent)?|expo-.*|@expo(nent)?/.*|@expo-google-fonts/.*|@react-navigation|react-native-svg|react-native-reanimated|nativewind|react-native-css-interop|@gluestack-ui)/)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};
