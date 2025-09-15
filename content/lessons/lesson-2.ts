// LESSON 2: What is Blockchain?
// 10 steps with varied images - EVERY exercise has an image!

import { mascots } from "@/config/mascots";

export const lesson2 = {
  id: 2,
  title: "What is Blockchain?",
  section: "Crypto Foundations",
  totalSteps: 10,
  xpReward: 10,

  steps: [
    // Step 0: Mascot Introduction
    {
      type: "intro",
      mascot: mascots.soliTeacher,
      message: "Great job on Lesson 1! 🎉 Now let's understand the technology behind crypto: the blockchain. It's simpler than you think!",
    },

    // Step 1: Main Explanation
    {
      type: "explanation",
      title: "What is Blockchain?",
      image: mascots.blockchainNetwork,
      content: "A blockchain is like a digital notebook that records every transaction. Once something is written, it can never be erased or changed. It's shared across thousands of computers worldwide.",
    },

    // Step 2: How it Works
    {
      type: "explanation",
      title: "How Does It Work?",
      image: mascots.blockchain,
      content: "Imagine a chain of blocks. Each block contains transaction data. When a block is full, a new one is created and linked to the previous one. This creates an unbreakable chain of information.",
    },

    // Step 3: Key Takeaway
    {
      type: "explanation",
      mascot: mascots.soliThinking,
      message: "🔑 Key Takeaway: Blockchain is a shared, permanent record that no single person or company controls. That's what makes it trustworthy!",
    },

    // Step 4: Real Example
    {
      type: "explanation",
      title: "Real-World Analogy",
      image: mascots.decentralized,
      content: "Think of blockchain like a Google Doc that everyone can see, but no one can delete or change past entries. Every edit is recorded forever, and everyone has the same copy.",
    },

    // Step 5: Exercise 1 - MCQ WITH IMAGE
    {
      type: "exercise",
      exerciseType: "multipleChoice",
      image: mascots.blockchain,
      question: "What happens when data is recorded on a blockchain?",
      options: [
        "It can be easily deleted",
        "Only the owner can see it",
        "It becomes permanent and unchangeable",
        "It expires after 30 days",
      ],
      correctAnswer: 2,
    },

    // Step 6: Exercise 2 - True/False WITH IMAGE
    {
      type: "exercise",
      exerciseType: "trueFalse",
      image: mascots.blockchainNetwork,
      statement: "A blockchain is controlled by a single company.",
      correctAnswer: false,
    },

    // Step 7: More explanation
    {
      type: "explanation",
      mascot: mascots.soliHappy,
      message: "Fun fact: The Bitcoin blockchain has been running since 2009 without ever going offline! That's over 15 years of continuous operation. 💪",
    },

    // Step 8: Exercise 3 - MCQ WITH IMAGE
    {
      type: "exercise",
      exerciseType: "multipleChoice",
      image: mascots.shieldSecurity,
      question: "Why is blockchain considered secure?",
      options: [
        "It's protected by police",
        "Data is shared across many computers and can't be changed",
        "It requires a password",
        "Only banks can access it",
      ],
      correctAnswer: 1,
    },

    // Step 9: Final Exercise WITH IMAGE
    {
      type: "exercise",
      exerciseType: "trueFalse",
      image: mascots.reseauxBlockchain,
      statement: "Blockchain technology was invented specifically for Bitcoin.",
      correctAnswer: true,
    },
  ],
};
