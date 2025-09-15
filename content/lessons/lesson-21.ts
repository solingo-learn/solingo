// LESSON 21: Supply & Demand
// 10 steps with varied images - EVERY exercise has an image!

import { mascots } from "@/config/mascots";

export const lesson21 = {
  id: 21,
  title: "Supply & Demand",
  section: "Market Mechanics",
  totalSteps: 10,
  xpReward: 15,

  steps: [
    // Step 0: Mascot Introduction
    {
      type: "intro",
      mascot: mascots.soliTeacher,
      message: "Welcome to Section 5: Market Mechanics! 📈 Let's start with the most basic economic principle: supply and demand. It drives ALL markets!",
    },

    // Step 1: Basic Concept
    {
      type: "explanation",
      title: "The Basic Principle",
      image: mascots.supplyDemand,
      content: "Supply = how much is available for sale\nDemand = how much people want to buy\n\nWhen demand exceeds supply, prices go up. When supply exceeds demand, prices go down. It's that simple!",
    },

    // Step 2: In Crypto
    {
      type: "explanation",
      title: "Supply & Demand in Crypto",
      image: mascots.chartUp,
      content: "Crypto prices are 100% driven by supply and demand. No company earnings, no government backing. Just: are more people buying or selling right now?",
    },

    // Step 3: Key Takeaway
    {
      type: "explanation",
      mascot: mascots.soliThinking,
      message: "🔑 Key Takeaway: Every price movement is supply vs demand. Understand this, and market movements start making sense!",
    },

    // Step 4: Token Supply
    {
      type: "explanation",
      title: "Token Supply Types",
      image: mascots.cryptoCoins,
      content: "• Fixed supply: Like Bitcoin (21M max)—scarcity\n• Inflationary: New tokens created over time\n• Deflationary: Tokens are burned (destroyed)\n\nSupply mechanics affect long-term price potential.",
    },

    // Step 5: Exercise 1 - MCQ WITH IMAGE
    {
      type: "exercise",
      exerciseType: "multipleChoice",
      image: mascots.supplyDemand,
      question: "What happens when demand exceeds supply?",
      options: [
        "Prices go down",
        "Prices stay the same",
        "Prices go up",
        "The market closes",
      ],
      correctAnswer: 2,
    },

    // Step 6: Exercise 2 - True/False WITH IMAGE
    {
      type: "exercise",
      exerciseType: "trueFalse",
      image: mascots.chartUp,
      statement: "Crypto prices are influenced by company earnings reports.",
      correctAnswer: false,
    },

    // Step 7: Demand Drivers
    {
      type: "explanation",
      mascot: mascots.soliHappy,
      message: "What creates demand? Utility, speculation, community, news, influencers, FOMO... Many factors! Understanding demand drivers helps explain price movements. 🧠",
    },

    // Step 8: Exercise 3 - MCQ WITH IMAGE
    {
      type: "exercise",
      exerciseType: "multipleChoice",
      image: mascots.cryptoCoins,
      question: "Bitcoin has a maximum supply of...",
      options: [
        "Unlimited",
        "21 million",
        "1 billion",
        "100 million",
      ],
      correctAnswer: 1,
    },

    // Step 9: Final Exercise WITH IMAGE
    {
      type: "exercise",
      exerciseType: "trueFalse",
      image: mascots.soliTeacher,
      statement: "Supply and demand is the primary driver of crypto prices.",
      correctAnswer: true,
    },
  ],
};

