import { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  name: "Solingo",
  description: "Learn crypto, Solana & memecoins safely and responsibly.",
  slug: "solingo",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/logoappli.png",
  scheme: "solingo",
  userInterfaceStyle: "dark",
  splash: {
    image: "./assets/images/logoappli.png",
    resizeMode: "contain",
    backgroundColor: "#000000",
  },
  assetBundlePatterns: ["**/*"],
  
  // iOS Configuration
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.yourapp.app",
    buildNumber: "1",
    infoPlist: {
      UIBackgroundModes: ["remote-notification"],
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  
  // Android Configuration
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/logoappli.png",
      backgroundColor: "#000000",
    },
    package: "com.yourapp.app",
    versionCode: 1,
    permissions: [
      "RECEIVE_BOOT_COMPLETED",
      "VIBRATE",
      "WAKE_LOCK",
    ],
  },
  
  // Web Configuration
  web: {
    bundler: "metro",
    output: "single",
    favicon: "./assets/images/logoappli.png",
  },
  
  // Plugins
  plugins: [
    ["expo-router", { origin: "https://yourapp.com" }],
    [
      "expo-notifications",
      {
        icon: "./assets/images/logoappli.png",
        color: "#9945FF",
        sounds: [],
      },
    ],
    "expo-apple-authentication",
  ],
  
  experiments: {
    typedRoutes: true,
  },
  
  // EAS Configuration
  extra: {
    eas: {
      projectId: "your-project-id"
    }
  },
  
  owner: "your-username",
};

export default config;
