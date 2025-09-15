// LESSON 5: Crypto Risks 101
// 10 steps with varied images - EVERY exercise has an image!

import { mascots } from "@/config/mascots";

export const lesson5 = {
  id: 5,
  title: "Crypto Risks 101",
  section: "Crypto Foundations",
  totalSteps: 10,
  xpReward: 10,

  steps: [
    // Step 0: Mascot Introduction
    {
      type: "intro",
      mascot: mascots.soliWarning,
      message: "Before we go further, let's talk about something important: risks. ⚠️ Understanding risks will help you stay safe in the crypto world.",
    },

    // Step 1: Volatility
    {
      type: "explanation",
      title: "Risk #1: Volatility",
      image: mascots.chartVolatile,
      content: "Crypto prices can change dramatically—sometimes 50% or more in a single day! What's worth $100 today could be worth $50 tomorrow, or $200. This unpredictability is called volatility.",
    },

    // Step 2: Scams
    {
      type: "explanation",
      title: "Risk #2: Scams",
      image: mascots.scamAlert,
      content: "The crypto space has many scammers. They promise guaranteed profits, free money, or exclusive deals. Remember: if it sounds too good to be true, it probably is!",
    },

    // Step 3: Key Takeaway
    {
      type: "explanation",
      mascot: mascots.soliSad,
      message: "🔑 Key Takeaway: Never share your seed phrase or private keys with anyone. No legitimate project will ever ask for them!",
    },

    // Step 4: Losing Access
    {
      type: "explanation",
      title: "Risk #3: Losing Access",
      image: mascots.walletIcon,
      content: "If you lose your wallet password or seed phrase, your crypto is gone forever. There's no 'forgot password' button, no customer support to help you. You are your own bank!",
    },

    // Step 5: Exercise 1 - MCQ WITH IMAGE
    {
      type: "exercise",
      exerciseType: "multipleChoice",
      image: mascots.chartVolatile,
      question: "What does 'volatility' mean in crypto?",
      options: [
        "Crypto is very popular",
        "Prices can change dramatically and quickly",
        "Crypto is guaranteed to go up",
        "Transactions are fast",
      ],
      correctAnswer: 1,
    },

    // Step 6: Exercise 2 - True/False WITH IMAGE
    {
      type: "exercise",
      exerciseType: "trueFalse",
      image: mascots.scamAlert,
      statement: "Legitimate crypto projects will ask for your seed phrase to verify your account.",
      correctAnswer: false,
    },

    // Step 7: Warning
    {
      type: "explanation",
      mascot: mascots.singeFache,
      message: "🚨 Red flags: 'Guaranteed 100x returns!' 'Send 1 SOL, get 2 back!' 'Limited time offer!' These are almost always scams. Stay skeptical!",
    },

    // Step 8: Exercise 3 - MCQ WITH IMAGE
    {
      type: "exercise",
      exerciseType: "multipleChoice",
      image: mascots.shieldSecurity,
      question: "What happens if you lose your seed phrase?",
      options: [
        "Customer support can reset it",
        "You can use email recovery",
        "Your crypto is lost forever",
        "The bank will help you",
      ],
      correctAnswer: 2,
    },

    // Step 9: Final Exercise WITH IMAGE
    {
      type: "exercise",
      exerciseType: "trueFalse",
      image: mascots.soliWarning,
      statement: "You should always verify information from multiple trusted sources before making decisions.",
      correctAnswer: true,
    },
  ],
};

