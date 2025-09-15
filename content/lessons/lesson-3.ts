// LESSON 3: Centralized vs Decentralized
// 10 steps with varied images - EVERY exercise has an image!

import { mascots } from "@/config/mascots";

export const lesson3 = {
  id: 3,
  title: "Centralized vs Decentralized",
  section: "Crypto Foundations",
  totalSteps: 10,
  xpReward: 10,

  steps: [
    // Step 0: Mascot Introduction
    {
      type: "intro",
      mascot: mascots.soliThinking,
      message: "You've learned about crypto and blockchain! 🧠 Now let's understand a key concept: the difference between centralized and decentralized systems.",
    },

    // Step 1: Centralized Explanation
    {
      type: "explanation",
      title: "What is Centralized?",
      image: mascots.centralized,
      content: "A centralized system has one person or company in control. Think of a bank: they hold your money, they set the rules, and they can freeze your account if they want to.",
    },

    // Step 2: Decentralized Explanation
    {
      type: "explanation",
      title: "What is Decentralized?",
      image: mascots.decentralized,
      content: "A decentralized system has no single point of control. Power is shared among many participants. No one person can make decisions alone or shut things down.",
    },

    // Step 3: Key Takeaway
    {
      type: "explanation",
      mascot: mascots.soliTeacher,
      message: "🔑 Key Takeaway: Cryptocurrencies are decentralized—no government, bank, or company controls them. This is both their strength and their risk.",
    },

    // Step 4: Real comparison
    {
      type: "explanation",
      title: "Compare: Bank vs Bitcoin",
      image: mascots.blockchainNetwork,
      content: "Bank: One company controls everything. They can freeze accounts, charge fees, and change rules.\n\nBitcoin: Thousands of computers worldwide work together. No one can freeze your funds or change the rules alone.",
    },

    // Step 5: Exercise 1 - MCQ WITH IMAGE
    {
      type: "exercise",
      exerciseType: "multipleChoice",
      image: mascots.centralized,
      question: "Which is an example of a centralized system?",
      options: [
        "Bitcoin network",
        "A traditional bank",
        "Blockchain technology",
        "Peer-to-peer network",
      ],
      correctAnswer: 1,
    },

    // Step 6: Exercise 2 - True/False WITH IMAGE
    {
      type: "exercise",
      exerciseType: "trueFalse",
      image: mascots.decentralized,
      statement: "In a decentralized system, one company controls everything.",
      correctAnswer: false,
    },

    // Step 7: Warning about risks
    {
      type: "explanation",
      mascot: mascots.soliWarning,
      message: "⚠️ Important: Decentralization means freedom, but also responsibility. If you lose your crypto keys, no bank can help you recover them!",
    },

    // Step 8: Exercise 3 - MCQ WITH IMAGE
    {
      type: "exercise",
      exerciseType: "multipleChoice",
      image: mascots.shieldSecurity,
      question: "What's a risk of decentralized systems?",
      options: [
        "Too many rules",
        "Banks can freeze your money",
        "You're responsible for your own security",
        "Transactions are too slow",
      ],
      correctAnswer: 2,
    },

    // Step 9: Final Exercise WITH IMAGE
    {
      type: "exercise",
      exerciseType: "trueFalse",
      image: mascots.baleine,
      statement: "Decentralization means power is shared among many participants.",
      correctAnswer: true,
    },
  ],
};
