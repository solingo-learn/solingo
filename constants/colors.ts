import { ThemeColors } from "@/types";

export const themeColors: ThemeColors = {
  light: {
    background: "rgb(255, 255, 255)",
    foreground: "rgb(10, 10, 10)",
    primary: "rgb(23, 23, 23)",
    primaryForeground: "rgb(250, 250, 250)",
    secondary: "rgb(245, 245, 245)",
    secondaryForeground: "rgb(23, 23, 23)",
    muted: "rgb(245, 245, 245)",
    mutedForeground: "rgb(115, 115, 115)",
    accent: "rgb(245, 245, 245)",
    accentForeground: "rgb(23, 23, 23)",
    destructive: "rgb(255,223, 224)",
    destructiveForeground: "rgb(225, 75, 75)",
    sucess: "rgb(215, 255, 184)",
    sucessForeground: "rgb(88, 204, 2)",
    border: "rgb(229, 229, 229)",
  },
  dark: {
    background: "rgb(0, 0, 0)",
    foreground: "rgb(255, 255, 255)",
    primary: "rgb(255, 255, 255)",
    primaryForeground: "rgb(0, 0, 0)",
    secondary: "rgb(18, 18, 18)",
    secondaryForeground: "rgb(255, 255, 255)",
    muted: "rgb(24, 24, 24)",
    mutedForeground: "rgb(140, 140, 140)",
    accent: "rgb(30, 30, 30)",
    accentForeground: "rgb(255, 255, 255)",
    destructive: "rgb(60, 20, 20)",
    destructiveForeground: "rgb(255, 100, 100)",
    sucess: "rgb(20, 60, 20)",
    sucessForeground: "rgb(100, 255, 100)",
    border: "rgb(30, 30, 30)",
  },
};

export const colors = {
  transparent: "rgba(0, 0, 0, 0)",
};

// Couleurs Solana pour les sections
export const sectionColors = {
  // Section 1: Crypto Foundations - Violet Solana principal
  section1: {
    background: "#9945FF",
    border: "#7B35D9",
    accent: "#14F195",
  },
  // Section 2: Solana Ecosystem - Vert Solana
  section2: {
    background: "#14F195",
    border: "#0FC87A",
    accent: "#9945FF",
  },
  // Section 3: Wallets & Security - Bleu dégradé Solana
  section3: {
    background: "#00C2FF",
    border: "#009BD4",
    accent: "#9945FF",
  },
  // Section 4: Tokens & Memecoins - Rose/Magenta
  section4: {
    background: "#F037A5",
    border: "#C42D85",
    accent: "#14F195",
  },
  // Section 5: Market Mechanics - Orange vif
  section5: {
    background: "#FF6B35",
    border: "#D95A2C",
    accent: "#14F195",
  },
  // Section 6: Mindset & Responsibility - Dégradé violet-bleu
  section6: {
    background: "#6366F1",
    border: "#4F46E5",
    accent: "#14F195",
  },
};

// Fonction pour obtenir les couleurs d'une section
export const getSectionColors = (sectionIndex: number) => {
  const sectionKey = `section${sectionIndex + 1}` as keyof typeof sectionColors;
  return sectionColors[sectionKey] || sectionColors.section1;
};
