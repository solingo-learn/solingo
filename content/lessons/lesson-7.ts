// LESSON 7: Why Solana is Fast
// 10 steps with varied images - EVERY exercise has an image!

import { mascots } from "@/config/mascots";

export const lesson7 = {
  id: 7,
  title: "Why Solana is Fast",
  section: "Solana Ecosystem",
  totalSteps: 10,
  xpReward: 15,

  steps: [
    // Step 0: Mascot Introduction
    {
      type: "intro",
      mascot: mascots.soliThinking,
      message: "Ever wondered how Solana processes thousands of transactions per second? 🚀 Let's discover the technology that makes it so fast!",
    },

    // Step 1: The Speed Problem
    {
      type: "explanation",
      title: "The Blockchain Speed Problem",
      image: mascots.blockchain,
      content: "Most blockchains are slow because every computer must agree on the order of transactions before processing them. This takes time and limits speed.",
    },

    // Step 2: Proof of History
    {
      type: "explanation",
      title: "Solana's Secret: Proof of History",
      image: mascots.reseauxBlockchain,
      content: "Solana uses 'Proof of History' (PoH)—a way to create a timestamp for every transaction. Think of it like a clock that everyone can trust. This removes the need to wait for agreement!",
    },

    // Step 3: Key Takeaway
    {
      type: "explanation",
      mascot: mascots.soliTeacher,
      message: "🔑 Key Takeaway: Proof of History lets Solana process transactions in parallel instead of one-by-one. That's why it's so fast!",
    },

    // Step 4: Comparison
    {
      type: "explanation",
      title: "Speed Comparison",
      image: mascots.chartUp,
      content: "Bitcoin: ~7 TPS (transactions per second)\nEthereum: ~15 TPS\nVisa: ~24,000 TPS\nSolana: ~65,000 TPS\n\nSolana can compete with traditional payment systems!",
    },

    // Step 5: Exercise 1 - MCQ WITH IMAGE
    {
      type: "exercise",
      exerciseType: "multipleChoice",
      image: mascots.blockchain,
      question: "What technology makes Solana fast?",
      options: [
        "Proof of Work",
        "Proof of History",
        "Proof of Stake only",
        "Magic internet money",
      ],
      correctAnswer: 1,
    },

    // Step 6: Exercise 2 - True/False WITH IMAGE
    {
      type: "exercise",
      exerciseType: "trueFalse",
      image: mascots.reseauxBlockchain,
      statement: "Proof of History creates trusted timestamps for transactions.",
      correctAnswer: true,
    },

    // Step 7: Benefits
    {
      type: "explanation",
      mascot: mascots.soliHappy,
      message: "Fast transactions mean better user experience! No more waiting minutes for confirmations. On Solana, transactions confirm in about 400 milliseconds. ⚡",
    },

    // Step 8: Exercise 3 - MCQ WITH IMAGE
    {
      type: "exercise",
      exerciseType: "multipleChoice",
      image: mascots.chartUp,
      question: "Approximately how many TPS can Solana handle?",
      options: ["7 TPS", "100 TPS", "1,000 TPS", "65,000+ TPS"],
      correctAnswer: 3,
    },

    // Step 9: Final Exercise WITH IMAGE
    {
      type: "exercise",
      exerciseType: "trueFalse",
      image: mascots.soliCelebrate,
      statement: "Solana transactions typically confirm in under 1 second.",
      correctAnswer: true,
    },
  ],
};

