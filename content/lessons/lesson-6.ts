// LESSON 6: What is Solana?
// 10 steps with varied images - EVERY exercise has an image!

import { mascots } from "@/config/mascots";

export const lesson6 = {
  id: 6,
  title: "What is Solana?",
  section: "Solana Ecosystem",
  totalSteps: 10,
  xpReward: 15,

  steps: [
    // Step 0: Mascot Introduction
    {
      type: "intro",
      mascot: mascots.soliCelebrate,
      message: "Welcome to Section 2! 🎉 Now we dive into Solana—one of the fastest and most exciting blockchains in the world. Let's explore!",
    },

    // Step 1: What is Solana
    {
      type: "explanation",
      title: "Meet Solana",
      image: mascots.blockchainNetwork,
      content: "Solana is a high-performance blockchain launched in 2020. It was created by Anatoly Yakovenko, a former Qualcomm engineer. Solana is designed to be fast, cheap, and scalable.",
    },

    // Step 2: Why it matters
    {
      type: "explanation",
      title: "Why Solana Stands Out",
      image: mascots.reseauxBlockchain,
      content: "While Bitcoin processes ~7 transactions per second and Ethereum ~15, Solana can handle 65,000+ transactions per second! And each transaction costs less than a penny.",
    },

    // Step 3: Key Takeaway
    {
      type: "explanation",
      mascot: mascots.soliTeacher,
      message: "🔑 Key Takeaway: Solana = Speed + Low Fees + Scalability. It's designed to handle massive adoption without slowing down or becoming expensive.",
    },

    // Step 4: The SOL Token
    {
      type: "explanation",
      title: "SOL: The Native Coin",
      image: mascots.cryptoCoins,
      content: "SOL is Solana's native cryptocurrency. It's used to pay transaction fees, participate in network security (staking), and power applications built on Solana.",
    },

    // Step 5: Exercise 1 - MCQ WITH IMAGE
    {
      type: "exercise",
      exerciseType: "multipleChoice",
      image: mascots.blockchainNetwork,
      question: "When was Solana launched?",
      options: ["2015", "2017", "2020", "2022"],
      correctAnswer: 2,
    },

    // Step 6: Exercise 2 - True/False WITH IMAGE
    {
      type: "exercise",
      exerciseType: "trueFalse",
      image: mascots.reseauxBlockchain,
      statement: "Solana can only process about 7 transactions per second.",
      correctAnswer: false,
    },

    // Step 7: Ecosystem
    {
      type: "explanation",
      mascot: mascots.soliHappy,
      message: "Solana hosts thousands of projects: DeFi apps, NFT marketplaces, games, and yes—memecoins! It's a vibrant ecosystem with active communities. 🌐",
    },

    // Step 8: Exercise 3 - MCQ WITH IMAGE
    {
      type: "exercise",
      exerciseType: "multipleChoice",
      image: mascots.cryptoCoins,
      question: "What is SOL used for?",
      options: [
        "Only buying coffee",
        "Paying fees and powering the Solana network",
        "Nothing, it's just for speculation",
        "Mining Bitcoin",
      ],
      correctAnswer: 1,
    },

    // Step 9: Final Exercise WITH IMAGE
    {
      type: "exercise",
      exerciseType: "trueFalse",
      image: mascots.soliCelebrate,
      statement: "Solana transaction fees are typically less than $0.01.",
      correctAnswer: true,
    },
  ],
};

