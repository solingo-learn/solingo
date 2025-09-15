// LESSON 4: Coins vs Tokens
// 10 steps with varied images - EVERY exercise has an image!

import { mascots } from "@/config/mascots";

export const lesson4 = {
  id: 4,
  title: "Coins vs Tokens",
  section: "Crypto Foundations",
  totalSteps: 10,
  xpReward: 10,

  steps: [
    // Step 0: Mascot Introduction
    {
      type: "intro",
      mascot: mascots.soliHappy,
      message: "You're doing amazing! 🌟 Now let's clear up a common confusion: what's the difference between a coin and a token?",
    },

    // Step 1: Coins Explanation
    {
      type: "explanation",
      title: "What is a Coin?",
      image: mascots.cryptoCoins,
      content: "A coin has its own blockchain. Bitcoin runs on the Bitcoin blockchain. Ethereum runs on the Ethereum blockchain. Solana runs on the Solana blockchain. Each is independent!",
    },

    // Step 2: Tokens Explanation
    {
      type: "explanation",
      title: "What is a Token?",
      image: mascots.blockchainNetwork,
      content: "A token lives on someone else's blockchain. It doesn't have its own network. For example, many tokens are built on Ethereum or Solana. They 'borrow' the main blockchain's security.",
    },

    // Step 3: Key Takeaway
    {
      type: "explanation",
      mascot: mascots.soliTeacher,
      message: "🔑 Key Takeaway: Coins = own blockchain (like Bitcoin, Solana). Tokens = built on another blockchain (like memecoins on Solana).",
    },

    // Step 4: Real Example
    {
      type: "explanation",
      title: "Think of it Like This",
      image: mascots.decentralized,
      content: "Imagine a coin as a country with its own currency (like the USA with dollars). A token is like a gift card that only works in certain stores—it uses the country's system but isn't the official money.",
    },

    // Step 5: Exercise 1 - MCQ WITH IMAGE
    {
      type: "exercise",
      exerciseType: "multipleChoice",
      image: mascots.cryptoCoins,
      question: "What's the main difference between a coin and a token?",
      options: [
        "Coins are more expensive",
        "Coins have their own blockchain, tokens don't",
        "Tokens are always scams",
        "There's no difference",
      ],
      correctAnswer: 1,
    },

    // Step 6: Exercise 2 - True/False WITH IMAGE
    {
      type: "exercise",
      exerciseType: "trueFalse",
      image: mascots.blockchain,
      statement: "Bitcoin is a token built on Ethereum.",
      correctAnswer: false,
    },

    // Step 7: More explanation
    {
      type: "explanation",
      mascot: mascots.soliThinking,
      message: "SOL is a coin because it powers the Solana blockchain. But memecoins created on Solana are tokens—they use Solana's network to exist! 🤔",
    },

    // Step 8: Exercise 3 - MCQ WITH IMAGE
    {
      type: "exercise",
      exerciseType: "multipleChoice",
      image: mascots.reseauxBlockchain,
      question: "Which of these is a COIN (has its own blockchain)?",
      options: [
        "A memecoin on Solana",
        "Solana (SOL)",
        "A token on Ethereum",
        "A NFT",
      ],
      correctAnswer: 1,
    },

    // Step 9: Final Exercise WITH IMAGE
    {
      type: "exercise",
      exerciseType: "trueFalse",
      image: mascots.soliTeacher,
      statement: "Tokens can be created on existing blockchains like Solana or Ethereum.",
      correctAnswer: true,
    },
  ],
};

