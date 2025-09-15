// Mascot and illustration mapping for Solingo lessons

export const mascots = {
  // ========== SOLI EMOTIONS ==========
  soli: require("@/assets/mascotte/soli-happy.png"),
  soliHappy: require("@/assets/mascotte/soli-happy.png"),
  soliSad: require("@/assets/mascotte/soli-sad.png"),
  soliThinking: require("@/assets/mascotte/soli-thinking.png"),
  soliCelebrate: require("@/assets/mascotte/soli-celebrate.png"),
  soliWarning: require("@/assets/mascotte/soli-warning.png"),
  soliTeacher: require("@/assets/mascotte/soli-teacher.png"),
  
  // ========== OTHER CHARACTERS ==========
  homme: require("@/assets/mascotte/homme.png"),
  hommeExplique: require("@/assets/mascotte/hommeexplique.png"),
  singe: require("@/assets/mascotte/singe.png"),
  singeFache: require("@/assets/mascotte/singe_fache.png"),
  joyeux: require("@/assets/mascotte/joyeux.png"),
  baleine: require("@/assets/mascotte/baleine.png"),
  baleineCoeur: require("@/assets/mascotte/baleinecoeur.png"),
  taureau: require("@/assets/mascotte/taureau.png"),
  taureauGagne: require("@/assets/mascotte/taureau_gagne.png"),
  taurauxEtOne: require("@/assets/mascotte/taurauxetone.png"),
  
  // ========== CRYPTO & BLOCKCHAIN ==========
  blockchain: require("@/assets/mascotte/blockchain.png"),
  blockchainNetwork: require("@/assets/mascotte/blockchain-network.png"),
  reseauxBlockchain: require("@/assets/mascotte/reseaux_blockchain.png"),
  cryptoCoins: require("@/assets/mascotte/crypto-coins.png"),
  centralized: require("@/assets/mascotte/centralized.png"),
  decentralized: require("@/assets/mascotte/decentralized.png"),
  walletIcon: require("@/assets/mascotte/wallet-icon.png"),
  
  // ========== CHARTS & MARKET ==========
  chartUp: require("@/assets/mascotte/chart-up.png"),
  chartDown: require("@/assets/mascotte/chart-down.png"),
  chartVolatile: require("@/assets/mascotte/chart-volatile.png"),
  supplyDemand: require("@/assets/mascotte/supply-demand.png"),
  whaleMarket: require("@/assets/mascotte/whale-market.png"),
  liquidityPool: require("@/assets/mascotte/liquidity-pool.png"),
  
  // ========== SECURITY ==========
  securite: require("@/assets/mascotte/securitew.png"),
  shieldSecurity: require("@/assets/mascotte/shield-security.png"),
  scamAlert: require("@/assets/mascotte/scam-alert.png"),
  phishing: require("@/assets/mascotte/phishing.png"),
  
  // ========== OTHER ==========
  argent: require("@/assets/mascotte/argent.png"),
};

export type MascotKey = keyof typeof mascots;

// Mascot mapping for each lesson (25 lessons)
export const lessonMascots: Record<number, {
  intro: MascotKey;
  explanation?: MascotKey;
  warning?: MascotKey;
}> = {
  // ========== Section 1: Crypto Basics ==========
  1: { // What is Cryptocurrency?
    intro: "soliHappy", 
    explanation: "cryptoCoins",
  },
  2: { // What is Blockchain?
    intro: "soliTeacher", 
    explanation: "blockchainNetwork",
  },
  3: { // Centralized vs Decentralized
    intro: "soliThinking", 
    explanation: "decentralized",
  },
  4: { // Public Keys & Wallets
    intro: "soliTeacher", 
    explanation: "walletIcon",
  },
  5: { // Crypto Risks 101
    intro: "soliWarning", 
    explanation: "scamAlert",
    warning: "soliSad",
  },
  
  // ========== Section 2: Solana Fundamentals ==========
  6: { // What is Solana?
    intro: "soliHappy", 
    explanation: "blockchainNetwork",
  },
  7: { // Why Solana is Fast
    intro: "soliCelebrate", 
    explanation: "reseauxBlockchain",
  },
  8: { // SOL Token Explained
    intro: "soliTeacher", 
    explanation: "cryptoCoins",
  },
  9: { // Solana vs Other Blockchains
    intro: "soliThinking", 
    explanation: "blockchain",
  },
  10: { // Solana Ecosystem & dApps
    intro: "soliHappy", 
    explanation: "decentralized",
  },
  
  // ========== Section 3: Wallets & Security ==========
  11: { // Wallet Types (Hot vs Cold)
    intro: "soliTeacher", 
    explanation: "walletIcon",
  },
  12: { // Seed Phrases & Private Keys
    intro: "soliWarning", 
    explanation: "shieldSecurity",
    warning: "soliSad",
  },
  13: { // Common Crypto Scams
    intro: "singeFache", 
    explanation: "scamAlert",
    warning: "soliWarning",
  },
  14: { // Spotting a Phishing Attack
    intro: "soliWarning", 
    explanation: "phishing",
    warning: "singeFache",
  },
  15: { // Security Best Practices
    intro: "soliTeacher", 
    explanation: "shieldSecurity",
  },
  
  // ========== Section 4: Tokens & Memecoins ==========
  16: { // What are Tokens?
    intro: "soliTeacher", 
    explanation: "cryptoCoins",
  },
  17: { // What are Memecoins?
    intro: "singe", 
    explanation: "joyeux",
  },
  18: { // Market Cap Explained
    intro: "soliThinking", 
    explanation: "argent",
  },
  19: { // Liquidity & Volume
    intro: "baleine", 
    explanation: "liquidityPool",
  },
  20: { // Why Most Memecoins Fail
    intro: "soliWarning", 
    explanation: "scamAlert",
    warning: "singeFache",
  },
  
  // ========== Section 5: Market Mechanics + Mindset ==========
  21: { // Supply & Demand
    intro: "soliTeacher", 
    explanation: "supplyDemand",
  },
  22: { // Volatility & Price Movement
    intro: "taureau", 
    explanation: "chartVolatile",
  },
  23: { // Reading Charts Basics
    intro: "soliThinking", 
    explanation: "chartUp",
  },
  24: { // Red Flags & Rug Pulls
    intro: "singeFache", 
    explanation: "scamAlert",
    warning: "soliWarning",
  },
  25: { // Responsible Learning
    intro: "soliCelebrate", 
    explanation: "soliHappy",
  },
};

// Helper function to get mascot for a lesson
export function getLessonMascot(lessonNumber: number, type: "intro" | "explanation" | "warning" = "intro") {
  const lesson = lessonMascots[lessonNumber];
  if (!lesson) return mascots.soli; // Default to Soli
  
  const mascotKey = lesson[type] || lesson.intro;
  return mascots[mascotKey];
}

