// LESSON 1: What is Cryptocurrency?
// 10 steps with varied images - EVERY exercise has an image!

import { mascots } from "@/config/mascots";

export const lesson1 = {
  id: 1,
  title: "What is Cryptocurrency?",
  section: "Crypto Foundations",
  totalSteps: 10,
  xpReward: 10,

  steps: [
    // Step 0: Mascot Introduction
    {
      type: "intro",
      mascot: mascots.soliHappy,
      message: "Hi! I'm Soli 👋 Today, we'll discover what cryptocurrency really is. Don't worry—we'll start simple and build up together!",
    },

    // Step 1: Main Explanation with image
    {
      type: "explanation",
      title: "What is Cryptocurrency?",
      image: mascots.cryptoCoins,
      content: "Cryptocurrency is digital money that exists only online. Unlike dollars or euros, it's not printed by governments or banks. Instead, it uses special computer code to track who owns what.",
    },

    // Step 2: More Explanation with different image
    {
      type: "explanation",
      title: "A Brief History",
      image: mascots.blockchainNetwork,
      content: "Bitcoin was the first cryptocurrency, created in 2009 by an anonymous person called Satoshi Nakamoto. Today, there are thousands of different cryptocurrencies, each with its own purpose.",
    },

    // Step 3: Key Takeaway with mascot
    {
      type: "explanation",
      mascot: mascots.soliTeacher,
      message: "🔑 Key Takeaway: Cryptocurrency is digital money secured by code, not controlled by banks or governments.",
    },

    // Step 4: Real-World Example with image
    {
      type: "explanation",
      title: "Real-World Example",
      image: mascots.argent,
      content: "Imagine Alice wants to send $100 to Bob in another country. With a bank, it takes 3 days and costs $25 in fees. With cryptocurrency, Alice can send it in seconds for less than $1!",
    },

    // Step 5: Exercise 1 - Multiple Choice WITH IMAGE
    {
      type: "exercise",
      exerciseType: "multipleChoice",
      image: mascots.cryptoCoins, // Always include image!
      question: "What makes cryptocurrency different from regular money?",
      options: [
        "It's more expensive to use",
        "It's controlled by banks",
        "It's digital and uses code to work",
        "It can only be used in one country",
      ],
      correctAnswer: 2,
      explanation: "Cryptocurrency is digital money that uses cryptographic code to secure transactions, unlike traditional money which is controlled by banks and governments.",
    },

    // Step 6: Exercise 2 - True/False WITH IMAGE
    {
      type: "exercise",
      exerciseType: "trueFalse",
      image: mascots.decentralized, // Always include image!
      statement: "Cryptocurrency is printed by governments.",
      correctAnswer: false,
      explanation: "Unlike traditional currencies, cryptocurrencies are not printed or controlled by any government. They are created through mining or other decentralized mechanisms.",
    },

    // Step 7: Explanation with mascot thinking
    {
      type: "explanation",
      mascot: mascots.soliThinking,
      message: "The word 'crypto' comes from 'cryptography', which means secret writing. Crypto uses complex math to keep transactions secure! 🔐",
    },

    // Step 8: Exercise 3 - Multiple Choice WITH IMAGE
    {
      type: "exercise",
      exerciseType: "multipleChoice",
      image: mascots.blockchain, // Always include image!
      question: "When was the first cryptocurrency (Bitcoin) created?",
      options: ["1999", "2005", "2009", "2015"],
      correctAnswer: 2,
      explanation: "Bitcoin was created in 2009 by an anonymous person or group known as Satoshi Nakamoto. It was the first decentralized cryptocurrency.",
    },

    // Step 9: Final True/False WITH IMAGE
    {
      type: "exercise",
      exerciseType: "trueFalse",
      image: mascots.soliTeacher, // Always include image!
      statement: "You need thousands of dollars to start learning about crypto.",
      correctAnswer: false,
      explanation: "Learning about crypto is free! You can start with any amount, even just a few dollars, when you're ready to actually buy some.",
    },
  ],
};
