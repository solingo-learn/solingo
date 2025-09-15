import { SiteConfig } from "@/types";

const ASSETS_URL =
  "https://raw.githubusercontent.com/solingo-app/solingo/main/assets";

export const siteConfig: SiteConfig = {
  name: "Solingo",
  title: "Solingo: Learn Solana & Crypto the fun way",
  description: "The free, fun, and effective way to learn Solana and crypto.",
  url: "https://solingo.vercel.app",
  author: {
    name: "Solingo Team",
    username: "@solingo",
    url: "https://solingo.vercel.app",
  },
  ogImage: `${ASSETS_URL}/public/og.png`,
  appleTouchIcon: `${ASSETS_URL}/public/apple-touch-icon.png`,
  icon16x16: `${ASSETS_URL}/public/favicon-16x16.png`,
  icon32x32: `${ASSETS_URL}/public/favicon-32x32.png`,
  manifest: `${ASSETS_URL}/public/site.webmanifest`,
};
