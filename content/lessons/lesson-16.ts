// LESSON 16: What is a Token?
// 10 steps with varied images - EVERY exercise has an image!

import { mascots } from "@/config/mascots";

export const lesson16 = {
  id: 16,
  title: "What is a Token?",
  section: "Tokens & Memecoins",
  totalSteps: 10,
  xpReward: 15,

  steps: [
    // Step 0: Mascot Introduction
    {
      type: "intro",
      mascot: mascots.soliCelebrate,
      message: "Welcome to Section 4: Tokens & Memecoins! 🎉 This is where things get interesting—and where you need to be extra careful. Let's start with tokens!",
    },

    // Step 1: Token Definition
    {
      type: "explanation",
      title: "Tokens Explained",
      image: mascots.cryptoCoins,
      content: "A token is a crypto asset built on an existing blockchain. On Solana, anyone can create a token in minutes. Tokens can represent anything: utility, governance, memes, or absolutely nothing!",
    },

    // Step 2: Types of Tokens
    {
      type: "explanation",
      title: "Types of Tokens",
      image: mascots.decentralized,
      content: "• Utility tokens: Access services (like arcade tokens)\n• Governance tokens: Vote on project decisions\n• Stablecoins: Pegged to dollars (like USDC)\n• Memecoins: Community/fun tokens\n• Scam tokens: Created to steal money",
    },

    // Step 3: Key Takeaway
    {
      type: "explanation",
      mascot: mascots.soliTeacher,
      message: "🔑 Key Takeaway: Not all tokens are equal. Anyone can create one in minutes. The real question is: does it have actual value or utility?",
    },

    // Step 4: Token Creation
    {
      type: "explanation",
      title: "How Easy is Token Creation?",
      image: mascots.blockchain,
      content: "On Solana, creating a token costs about $0.01 and takes 2 minutes. There are no requirements, no verification. This means thousands of new tokens appear daily—most worthless or scams!",
    },

    // Step 5: Exercise 1 - MCQ WITH IMAGE
    {
      type: "exercise",
      exerciseType: "multipleChoice",
      image: mascots.cryptoCoins,
      question: "What is a token?",
      options: [
        "Only Bitcoin",
        "A crypto asset built on an existing blockchain",
        "Physical coins you can hold",
        "A type of NFT",
      ],
      correctAnswer: 1,
    },

    // Step 6: Exercise 2 - True/False WITH IMAGE
    {
      type: "exercise",
      exerciseType: "trueFalse",
      image: mascots.blockchain,
      statement: "Creating a token on Solana is expensive and requires approval.",
      correctAnswer: false,
    },

    // Step 7: Warning
    {
      type: "explanation",
      mascot: mascots.soliWarning,
      message: "⚠️ Just because a token exists doesn't mean it has value. Most tokens created daily will go to zero. Research before engaging with any token!",
    },

    // Step 8: Exercise 3 - MCQ WITH IMAGE
    {
      type: "exercise",
      exerciseType: "multipleChoice",
      image: mascots.decentralized,
      question: "Which type of token lets you vote on project decisions?",
      options: [
        "Stablecoin",
        "Memecoin",
        "Governance token",
        "NFT",
      ],
      correctAnswer: 2,
    },

    // Step 9: Final Exercise WITH IMAGE
    {
      type: "exercise",
      exerciseType: "trueFalse",
      image: mascots.soliThinking,
      statement: "You should research a token before interacting with it.",
      correctAnswer: true,
    },
  ],
};

