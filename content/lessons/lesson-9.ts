// LESSON 9: Solana Ecosystem
// 10 steps with varied images - EVERY exercise has an image!

import { mascots } from "@/config/mascots";

export const lesson9 = {
  id: 9,
  title: "Solana Ecosystem",
  section: "Solana Ecosystem",
  totalSteps: 10,
  xpReward: 15,

  steps: [
    // Step 0: Mascot Introduction
    {
      type: "intro",
      mascot: mascots.soliCelebrate,
      message: "Solana isn't just a blockchain—it's a whole ecosystem! 🌐 Let's explore what's being built on Solana and why it's so exciting.",
    },

    // Step 1: What's an Ecosystem
    {
      type: "explanation",
      title: "What is an Ecosystem?",
      image: mascots.decentralized,
      content: "A blockchain ecosystem includes all the projects, apps, and communities built on it. Think of Solana as a city, and the ecosystem as all the businesses, people, and activities in that city.",
    },

    // Step 2: DeFi
    {
      type: "explanation",
      title: "DeFi on Solana",
      image: mascots.liquidityPool,
      content: "DeFi (Decentralized Finance) lets you borrow, lend, and trade without banks. Popular Solana DeFi apps include Jupiter (trading), Marinade (staking), and Raydium (liquidity).",
    },

    // Step 3: Key Takeaway
    {
      type: "explanation",
      mascot: mascots.soliTeacher,
      message: "🔑 Key Takeaway: Solana's low fees and fast speed make it perfect for DeFi. You can make many small transactions without worrying about high costs!",
    },

    // Step 4: NFTs and Games
    {
      type: "explanation",
      title: "NFTs & Gaming",
      image: mascots.joyeux,
      content: "Solana hosts major NFT marketplaces like Magic Eden and Tensor. Games like Star Atlas and Aurory are building on Solana too. Low fees make NFT trading accessible to everyone!",
    },

    // Step 5: Exercise 1 - MCQ WITH IMAGE
    {
      type: "exercise",
      exerciseType: "multipleChoice",
      image: mascots.decentralized,
      question: "What is a blockchain ecosystem?",
      options: [
        "Just the blockchain code",
        "All projects, apps, and communities on the blockchain",
        "Only the native coin",
        "The company that created it",
      ],
      correctAnswer: 1,
    },

    // Step 6: Exercise 2 - True/False WITH IMAGE
    {
      type: "exercise",
      exerciseType: "trueFalse",
      image: mascots.liquidityPool,
      statement: "DeFi requires traditional banks to function.",
      correctAnswer: false,
    },

    // Step 7: Memecoins
    {
      type: "explanation",
      mascot: mascots.singe,
      message: "Yes, memecoins are part of the ecosystem too! 🐒 While risky, they bring energy and new users to Solana. We'll learn more about them in Section 4!",
    },

    // Step 8: Exercise 3 - MCQ WITH IMAGE
    {
      type: "exercise",
      exerciseType: "multipleChoice",
      image: mascots.joyeux,
      question: "Why is Solana good for NFTs?",
      options: [
        "NFTs don't work on other blockchains",
        "Low fees make trading accessible",
        "Solana invented NFTs",
        "NFTs are free on Solana",
      ],
      correctAnswer: 1,
    },

    // Step 9: Final Exercise WITH IMAGE
    {
      type: "exercise",
      exerciseType: "trueFalse",
      image: mascots.soliHappy,
      statement: "Solana's ecosystem includes DeFi, NFTs, games, and more.",
      correctAnswer: true,
    },
  ],
};

