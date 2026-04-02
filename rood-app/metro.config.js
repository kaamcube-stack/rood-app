// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Limit worker count to reduce peak memory usage during bundling.
// The default spawns one worker per CPU core, which can exhaust memory
// when serializing large bundles back through the IPC channel.
config.maxWorkers = 2;

module.exports = config;
