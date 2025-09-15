// LESSON 13: Seed Phrase Rules
// 10 steps with varied images - EVERY exercise has an image!

import { mascots } from "@/config/mascots";

export const lesson13 = {
  id: 13,
  title: "Seed Phrase Rules",
  section: "Wallets & Security",
  totalSteps: 10,
  xpReward: 15,

  steps: [
    // Step 0: Mascot Introduction
    {
      type: "intro",
      mascot: mascots.soliWarning,
      message: "This might be the most important lesson in this entire course. ⚠️ Your seed phrase is your ultimate backup—and your biggest vulnerability.",
    },

    // Step 1: What is Seed Phrase
    {
      type: "explanation",
      title: "What is a Seed Phrase?",
      image: mascots.shieldSecurity,
      content: "A seed phrase (or recovery phrase) is 12 or 24 random words given when you create a wallet. It's the master key to all your crypto. From this phrase, all your private keys are generated.",
    },

    // Step 2: Why it Matters
    {
      type: "explanation",
      title: "Why It's So Important",
      image: mascots.walletIcon,
      content: "Lose your phone? Computer stolen? No problem—if you have your seed phrase, you can restore your wallet on any device. But if someone else gets it, they can steal everything!",
    },

    // Step 3: Key Takeaway
    {
      type: "explanation",
      mascot: mascots.soliTeacher,
      message: "🔑 Key Takeaway: Your seed phrase = access to ALL your crypto. Treat it like the most valuable thing you own. Because in crypto, it is!",
    },

    // Step 4: Storage Rules
    {
      type: "explanation",
      title: "How to Store Your Seed Phrase",
      image: mascots.securite,
      content: "✅ DO:\n• Write on paper, store safely\n• Use metal backup for fire/water protection\n• Keep in secure location (safe, bank box)\n\n❌ DON'T:\n• Screenshot or photo\n• Store in cloud/email\n• Share with anyone",
    },

    // Step 5: Exercise 1 - MCQ WITH IMAGE
    {
      type: "exercise",
      exerciseType: "multipleChoice",
      image: mascots.shieldSecurity,
      question: "What is a seed phrase?",
      options: [
        "A password you create yourself",
        "12-24 random words that backup your wallet",
        "Your wallet's public address",
        "A code sent by email",
      ],
      correctAnswer: 1,
    },

    // Step 6: Exercise 2 - True/False WITH IMAGE
    {
      type: "exercise",
      exerciseType: "trueFalse",
      image: mascots.scamAlert,
      statement: "It's safe to store your seed phrase in a cloud document like Google Drive.",
      correctAnswer: false,
    },

    // Step 7: Warning
    {
      type: "explanation",
      mascot: mascots.singeFache,
      message: "🚨 Real story: People have lost millions by storing seed phrases in emails or screenshots. If your cloud gets hacked, your crypto is gone!",
    },

    // Step 8: Exercise 3 - MCQ WITH IMAGE
    {
      type: "exercise",
      exerciseType: "multipleChoice",
      image: mascots.securite,
      question: "What's the safest way to store a seed phrase?",
      options: [
        "Screenshot on your phone",
        "Email it to yourself",
        "Write on paper and store securely offline",
        "Save in a notes app",
      ],
      correctAnswer: 2,
    },

    // Step 9: Final Exercise WITH IMAGE
    {
      type: "exercise",
      exerciseType: "trueFalse",
      image: mascots.soliWarning,
      statement: "If someone asks for your seed phrase to 'verify' your wallet, it's a scam.",
      correctAnswer: true,
    },
  ],
};

