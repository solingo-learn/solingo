// LESSON 24: Reading Charts (Basics)
// 10 steps with varied images - EVERY exercise has an image!

import { mascots } from "@/config/mascots";

export const lesson24 = {
  id: 24,
  title: "Reading Charts (Basics)",
  section: "Market Mechanics",
  totalSteps: 10,
  xpReward: 15,

  steps: [
    // Step 0: Mascot Introduction
    {
      type: "intro",
      mascot: mascots.soliTeacher,
      message: "Charts can look intimidating, but the basics are simple! 📊 Let's learn to read basic price charts—a useful skill for understanding market movements.",
    },

    // Step 1: What Charts Show
    {
      type: "explanation",
      title: "What Charts Show",
      image: mascots.chartUp,
      content: "Price charts display historical price movements over time. X-axis = time (minutes, hours, days). Y-axis = price. They help visualize trends and patterns.",
    },

    // Step 2: Candlesticks
    {
      type: "explanation",
      title: "Understanding Candlesticks",
      image: mascots.chartVolatile,
      content: "Green candle = price went UP during that period\nRed candle = price went DOWN\n\nThe 'body' shows open/close prices. The 'wicks' show high/low. Each candle is a time period.",
    },

    // Step 3: Key Takeaway
    {
      type: "explanation",
      mascot: mascots.soliThinking,
      message: "🔑 Key Takeaway: Charts show HISTORY, not the future. They help understand what happened, not predict what will happen. Use them for context, not prophecy!",
    },

    // Step 4: Timeframes
    {
      type: "explanation",
      title: "Different Timeframes",
      image: mascots.chartDown,
      content: "• 1-minute: Very short-term, noisy\n• 1-hour: Short-term trends\n• 1-day: Medium-term view\n• 1-week: Long-term trends\n\nAlways check multiple timeframes for context!",
    },

    // Step 5: Exercise 1 - MCQ WITH IMAGE
    {
      type: "exercise",
      exerciseType: "multipleChoice",
      image: mascots.chartUp,
      question: "What does a green candlestick indicate?",
      options: [
        "Price went down",
        "Price went up",
        "Market is closed",
        "Volume is high",
      ],
      correctAnswer: 1,
    },

    // Step 6: Exercise 2 - True/False WITH IMAGE
    {
      type: "exercise",
      exerciseType: "trueFalse",
      image: mascots.chartVolatile,
      statement: "Charts can accurately predict future prices.",
      correctAnswer: false,
    },

    // Step 7: Simple Patterns
    {
      type: "explanation",
      mascot: mascots.soliHappy,
      message: "📈 Uptrend: Higher highs, higher lows\n📉 Downtrend: Lower highs, lower lows\n➡️ Sideways: Price moving in a range\n\nThat's the basics! Don't overcomplicate it.",
    },

    // Step 8: Exercise 3 - MCQ WITH IMAGE
    {
      type: "exercise",
      exerciseType: "multipleChoice",
      image: mascots.chartDown,
      question: "Why should you check multiple timeframes?",
      options: [
        "To find the 'correct' one",
        "To get different perspectives and context",
        "Shorter timeframes are always better",
        "Longer timeframes are always better",
      ],
      correctAnswer: 1,
    },

    // Step 9: Final Exercise WITH IMAGE
    {
      type: "exercise",
      exerciseType: "trueFalse",
      image: mascots.soliTeacher,
      statement: "A red candlestick means the price went down during that time period.",
      correctAnswer: true,
    },
  ],
};

