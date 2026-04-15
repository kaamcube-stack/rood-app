// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

const { transformer, resolver } = config;

config.transformer = {
  ...transformer,
  // Use Expo entry so non-SVG files chain through @expo/metro-config/babel-transformer.
  babelTransformerPath: require.resolve('react-native-svg-transformer/expo'),
};
config.resolver = {
  ...resolver,
  assetExts: resolver.assetExts.filter((ext) => ext !== 'svg'),
  sourceExts: [...resolver.sourceExts, 'svg'],
};

// Limit worker count to reduce peak memory usage during bundling.
// The default spawns one worker per CPU core, which can exhaust memory
// when serializing large bundles back through the IPC channel.
config.maxWorkers = 2;

module.exports = config;
