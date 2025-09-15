// LESSON 8: SOL Token Explained
// 10 steps with varied images - EVERY exercise has an image!

import { mascots } from "@/config/mascots";

export const lesson8 = {
  id: 8,
  title: "SOL Token Explained",
  section: "Solana Ecosystem",
  totalSteps: 10,
  xpReward: 15,

  steps: [
    // Step 0: Mascot Introduction
    {
      type: "intro",
      mascot: mascots.soliTeacher,
      message: "Let's dive deeper into SOL—Solana's native cryptocurrency. Understanding SOL is essential for navigating the Solana ecosystem! 💰",
    },

    // Step 1: What is SOL
    {
      type: "explanation",
      title: "What is SOL?",
      image: mascots.cryptoCoins,
      content: "SOL is the native coin of the Solana blockchain. Just like ETH powers Ethereum, SOL powers Solana. You need SOL to do anything on the network.",
    },

    // Step 2: Use Cases
    {
      type: "explanation",
      title: "What Can You Do With SOL?",
      image: mascots.walletIcon,
      content: "1. Pay transaction fees (very cheap!)\n2. Stake to earn rewards\n3. Vote on network decisions\n4. Use in DeFi applications\n5. Buy NFTs and tokens",
    },

    // Step 3: Key Takeaway
    {
      type: "explanation",
      mascot: mascots.soliThinking,
      message: "🔑 Key Takeaway: SOL is like fuel for Solana. Every action on the network requires a tiny bit of SOL. No SOL = can't do anything!",
    },

    // Step 4: Staking
    {
      type: "explanation",
      title: "Staking SOL",
      image: mascots.shieldSecurity,
      content: "Staking means locking your SOL to help secure the network. In return, you earn rewards—usually 5-8% per year. It's like earning interest, but for helping the blockchain!",
    },

    // Step 5: Exercise 1 - MCQ WITH IMAGE
    {
      type: "exercise",
      exerciseType: "multipleChoice",
      image: mascots.cryptoCoins,
      question: "What type of cryptocurrency is SOL?",
      options: [
        "A token on Ethereum",
        "A stablecoin",
        "Solana's native coin",
        "A memecoin",
      ],
      correctAnswer: 2,
    },

    // Step 6: Exercise 2 - True/False WITH IMAGE
    {
      type: "exercise",
      exerciseType: "trueFalse",
      image: mascots.walletIcon,
      statement: "You need SOL to pay transaction fees on Solana.",
      correctAnswer: true,
    },

    // Step 7: Supply Info
    {
      type: "explanation",
      mascot: mascots.soliHappy,
      message: "Unlike Bitcoin (capped at 21 million), SOL has no maximum supply. However, a portion of fees is burned (destroyed), which can reduce supply over time! 🔥",
    },

    // Step 8: Exercise 3 - MCQ WITH IMAGE
    {
      type: "exercise",
      exerciseType: "multipleChoice",
      image: mascots.shieldSecurity,
      question: "What is staking?",
      options: [
        "Buying SOL at a discount",
        "Locking SOL to earn rewards and secure the network",
        "Selling SOL for profit",
        "Converting SOL to Bitcoin",
      ],
      correctAnswer: 1,
    },

    // Step 9: Final Exercise WITH IMAGE
    {
      type: "exercise",
      exerciseType: "trueFalse",
      image: mascots.argent,
      statement: "Staking SOL can earn you rewards for helping secure the network.",
      correctAnswer: true,
    },
  ],
};

