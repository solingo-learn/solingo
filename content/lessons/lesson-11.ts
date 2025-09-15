// LESSON 11: What is a Wallet?
// 10 steps with varied images - EVERY exercise has an image!

import { mascots } from "@/config/mascots";

export const lesson11 = {
  id: 11,
  title: "What is a Wallet?",
  section: "Wallets & Security",
  totalSteps: 10,
  xpReward: 15,

  steps: [
    // Step 0: Mascot Introduction
    {
      type: "intro",
      mascot: mascots.soliTeacher,
      message: "Welcome to Section 3: Wallets & Security! 🔐 This is crucial knowledge. Let's start by understanding what a crypto wallet really is.",
    },

    // Step 1: What is a Wallet
    {
      type: "explanation",
      title: "What is a Crypto Wallet?",
      image: mascots.walletIcon,
      content: "A crypto wallet doesn't actually store your crypto. Instead, it stores your private keys—the passwords that prove you own your crypto on the blockchain.",
    },

    // Step 2: Types of Wallets
    {
      type: "explanation",
      title: "Hot vs Cold Wallets",
      image: mascots.shieldSecurity,
      content: "Hot wallets: Connected to internet (apps like Phantom, Solflare). Convenient but more vulnerable.\n\nCold wallets: Offline hardware devices (Ledger, Trezor). More secure but less convenient.",
    },

    // Step 3: Key Takeaway
    {
      type: "explanation",
      mascot: mascots.soliThinking,
      message: "🔑 Key Takeaway: Your wallet is like a keychain, not a safe. The crypto lives on the blockchain—your wallet just holds the keys to access it!",
    },

    // Step 4: Popular Solana Wallets
    {
      type: "explanation",
      title: "Popular Solana Wallets",
      image: mascots.decentralized,
      content: "• Phantom: Most popular, easy to use\n• Solflare: Feature-rich, great for staking\n• Backpack: New, built for xNFTs\n• Ledger: Hardware wallet for maximum security",
    },

    // Step 5: Exercise 1 - MCQ WITH IMAGE
    {
      type: "exercise",
      exerciseType: "multipleChoice",
      image: mascots.walletIcon,
      question: "What does a crypto wallet actually store?",
      options: [
        "Your actual coins and tokens",
        "Your private keys",
        "Copies of the blockchain",
        "Your bank account info",
      ],
      correctAnswer: 1,
    },

    // Step 6: Exercise 2 - True/False WITH IMAGE
    {
      type: "exercise",
      exerciseType: "trueFalse",
      image: mascots.shieldSecurity,
      statement: "Hot wallets are connected to the internet.",
      correctAnswer: true,
    },

    // Step 7: Security Note
    {
      type: "explanation",
      mascot: mascots.soliWarning,
      message: "⚠️ Never download wallets from random links! Only use official websites or app stores. Scammers create fake wallet apps to steal your funds.",
    },

    // Step 8: Exercise 3 - MCQ WITH IMAGE
    {
      type: "exercise",
      exerciseType: "multipleChoice",
      image: mascots.decentralized,
      question: "Which type of wallet is more secure?",
      options: [
        "Hot wallet (online)",
        "Cold wallet (offline hardware)",
        "They're equally secure",
        "Paper wallets only",
      ],
      correctAnswer: 1,
    },

    // Step 9: Final Exercise WITH IMAGE
    {
      type: "exercise",
      exerciseType: "trueFalse",
      image: mascots.soliTeacher,
      statement: "Phantom is a popular wallet for the Solana blockchain.",
      correctAnswer: true,
    },
  ],
};

