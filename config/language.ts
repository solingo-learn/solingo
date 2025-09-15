import { Languages, SupportedLanguageCode } from "@/types";

const soliIcon = require("@/assets/mascotte/soli-happy.png");

export const languages = {
  en: {
    name: "English",
    flag: soliIcon,
  },
  ja: {
    name: "日本語",
    flag: soliIcon,
  },
  es: {
    name: "Español",
    flag: soliIcon,
  },
  fr: {
    name: "Français",
    flag: soliIcon,
  },
  cn: {
    name: "普通话",
    flag: soliIcon,
  },
  ru: {
    name: "Русский",
    flag: soliIcon,
  },
  my: {
    name: "မြန်မာ",
    flag: soliIcon,
  },
  th: {
    name: "ไทย",
    flag: soliIcon,
  },
  hi: {
    name: "हिंदी",
    flag: soliIcon,
  },
} satisfies Languages;

export function getLanguage(code: SupportedLanguageCode) {
  return languages[code];
}

export const validLanguages: SupportedLanguageCode[] = Object.keys(
  languages
).map((key) => key as SupportedLanguageCode);
