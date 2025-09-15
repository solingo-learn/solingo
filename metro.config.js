// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // [Web-only]: Enables CSS support in Metro.
  isCSSEnabled: true,
});

// Fix for generator-function module resolution issue
const shimPath = path.resolve(__dirname, "shims/generator-function.js");

config.resolver = {
  ...config.resolver,
  extraNodeModules: {
    ...config.resolver?.extraNodeModules,
    "generator-function": shimPath,
  },
  resolveRequest: (context, moduleName, platform) => {
    // Intercept generator-function requests
    if (moduleName === "generator-function") {
      return {
        filePath: shimPath,
        type: "sourceFile",
      };
    }
    // Fall back to default resolution
    return context.resolveRequest(context, moduleName, platform);
  },
};

module.exports = config;
