// LESSON 19: Market Cap Explained
// 10 steps with varied images - EVERY exercise has an image!

import { mascots } from "@/config/mascots";

export const lesson19 = {
  id: 19,
  title: "Market Cap Explained",
  section: "Tokens & Memecoins",
  totalSteps: 10,
  xpReward: 15,

  steps: [
    // Step 0: Mascot Introduction
    {
      type: "intro",
      mascot: mascots.soliTeacher,
      message: "Let's learn about market cap—one of the most important metrics for understanding a token's size and potential. 📊 It's simpler than it sounds!",
    },

    // Step 1: What is Market Cap
    {
      type: "explanation",
      title: "What is Market Cap?",
      image: mascots.argent,
      content: "Market Cap = Price × Total Supply\n\nIf a token costs $1 and there are 1 million tokens, the market cap is $1 million. It represents the total 'value' of all tokens combined.",
    },

    // Step 2: Why It Matters
    {
      type: "explanation",
      title: "Why Market Cap Matters",
      image: mascots.chartUp,
      content: "Price alone is misleading! A $0.0001 token isn't necessarily 'cheap'—it might have trillions of tokens (huge market cap). A $1000 token might be 'cheaper' if supply is tiny.",
    },

    // Step 3: Key Takeaway
    {
      type: "explanation",
      mascot: mascots.soliThinking,
      message: "🔑 Key Takeaway: Don't look at price—look at market cap. A token at $0.001 with 100 trillion supply is NOT cheap!",
    },

    // Step 4: Market Cap Categories
    {
      type: "explanation",
      title: "Market Cap Sizes",
      image: mascots.baleine,
      content: "• Large cap: $1B+ (Bitcoin, Solana)\n• Mid cap: $100M - $1B\n• Small cap: $10M - $100M\n• Micro cap: Under $10M\n\nSmaller = higher risk AND higher potential volatility",
    },

    // Step 5: Exercise 1 - MCQ WITH IMAGE
    {
      type: "exercise",
      exerciseType: "multipleChoice",
      image: mascots.argent,
      question: "How is market cap calculated?",
      options: [
        "Price ÷ Supply",
        "Price × Supply",
        "Supply ÷ Price",
        "Price + Supply",
      ],
      correctAnswer: 1,
    },

    // Step 6: Exercise 2 - True/False WITH IMAGE
    {
      type: "exercise",
      exerciseType: "trueFalse",
      image: mascots.chartUp,
      statement: "A token priced at $0.0001 is always a good deal because it's 'cheap.'",
      correctAnswer: false,
    },

    // Step 7: Diluted Market Cap
    {
      type: "explanation",
      mascot: mascots.soliWarning,
      message: "⚠️ Watch for 'Fully Diluted Market Cap'—this includes tokens not yet released. If only 10% of tokens exist now, the real cap could be 10x higher when all release!",
    },

    // Step 8: Exercise 3 - MCQ WITH IMAGE
    {
      type: "exercise",
      exerciseType: "multipleChoice",
      image: mascots.baleine,
      question: "Which is generally considered higher risk?",
      options: [
        "Large cap tokens",
        "Mid cap tokens",
        "Micro cap tokens",
        "All have equal risk",
      ],
      correctAnswer: 2,
    },

    // Step 9: Final Exercise WITH IMAGE
    {
      type: "exercise",
      exerciseType: "trueFalse",
      image: mascots.soliTeacher,
      statement: "Market cap is more important than price when evaluating a token's size.",
      correctAnswer: true,
    },
  ],
};

