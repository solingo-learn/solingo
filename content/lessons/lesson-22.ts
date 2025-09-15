// LESSON 22: What is Volatility?
// 10 steps with varied images - EVERY exercise has an image!

import { mascots } from "@/config/mascots";

export const lesson22 = {
  id: 22,
  title: "What is Volatility?",
  section: "Market Mechanics",
  totalSteps: 10,
  xpReward: 15,

  steps: [
    // Step 0: Mascot Introduction
    {
      type: "intro",
      mascot: mascots.taureau,
      message: "Crypto is famous for wild price swings! 🎢 Let's understand volatility—what it means, why it happens, and how to think about it.",
    },

    // Step 1: What is Volatility
    {
      type: "explanation",
      title: "Volatility Defined",
      image: mascots.chartVolatile,
      content: "Volatility measures how much and how fast prices change. High volatility = big swings (up or down). Low volatility = stable, gradual movements. Crypto is VERY volatile!",
    },

    // Step 2: Why Crypto is Volatile
    {
      type: "explanation",
      title: "Why is Crypto So Volatile?",
      image: mascots.chartUp,
      content: "• 24/7 markets (never closes)\n• Smaller market size than stocks\n• Emotional trading\n• Speculation dominates\n• News spreads instantly\n• Leverage amplifies moves",
    },

    // Step 3: Key Takeaway
    {
      type: "explanation",
      mascot: mascots.soliWarning,
      message: "🔑 Key Takeaway: Volatility is neither good nor bad—it's a characteristic. It creates opportunities AND risks. Be prepared for 20-50% swings!",
    },

    // Step 4: Real Examples
    {
      type: "explanation",
      title: "Volatility in Action",
      image: mascots.chartDown,
      content: "Bitcoin has dropped 80%+ multiple times in history. It has also risen 1000%+ in single years. Memecoins can move 99% in a single day—up OR down.",
    },

    // Step 5: Exercise 1 - MCQ WITH IMAGE
    {
      type: "exercise",
      exerciseType: "multipleChoice",
      image: mascots.chartVolatile,
      question: "What does high volatility mean?",
      options: [
        "Prices only go up",
        "Prices only go down",
        "Prices change dramatically and quickly",
        "Prices never change",
      ],
      correctAnswer: 2,
    },

    // Step 6: Exercise 2 - True/False WITH IMAGE
    {
      type: "exercise",
      exerciseType: "trueFalse",
      image: mascots.chartUp,
      statement: "Crypto markets close on weekends like stock markets.",
      correctAnswer: false,
    },

    // Step 7: Managing Volatility
    {
      type: "explanation",
      mascot: mascots.soliTeacher,
      message: "💡 Tips for volatile markets:\n• Don't panic sell during dips\n• Don't FOMO buy at peaks\n• Only use money you can afford to lose\n• Zoom out—look at longer timeframes",
    },

    // Step 8: Exercise 3 - MCQ WITH IMAGE
    {
      type: "exercise",
      exerciseType: "multipleChoice",
      image: mascots.chartDown,
      question: "Which is NOT a reason crypto is volatile?",
      options: [
        "24/7 trading",
        "Smaller market size",
        "Government guarantees",
        "Emotional trading",
      ],
      correctAnswer: 2,
    },

    // Step 9: Final Exercise WITH IMAGE
    {
      type: "exercise",
      exerciseType: "trueFalse",
      image: mascots.taureau,
      statement: "Being prepared for volatility helps you make better decisions.",
      correctAnswer: true,
    },
  ],
};

