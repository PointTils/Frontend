module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
    ],
    plugins: [
      require.resolve('expo-router/babel'),
      'nativewind/babel',
      ['module-resolver', {
        root: ['./'],
        alias: { '@': './src', 'tailwind.config': './tailwind.config.js' },
      }],
      'react-native-reanimated/plugin',  
    ],
  };
};
