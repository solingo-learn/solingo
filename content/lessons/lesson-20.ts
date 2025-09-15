// LESSON 20: Why Most Memecoins Fail
// 10 steps with varied images - EVERY exercise has an image!

import { mascots } from "@/config/mascots";

export const lesson20 = {
  id: 20,
  title: "Why Most Memecoins Fail",
  section: "Tokens & Memecoins",
  totalSteps: 10,
  xpReward: 15,

  steps: [
    // Step 0: Mascot Introduction
    {
      type: "intro",
      mascot: mascots.singeFache,
      message: "Last lesson of Section 4! 😤 Let's understand WHY most memecoins fail. This knowledge could save you from painful losses.",
    },

    // Step 1: No Real Value
    {
      type: "explanation",
      title: "Reason #1: No Real Value",
      image: mascots.chartDown,
      content: "Most memecoins have no utility, no product, no revenue. Their only 'value' comes from new buyers. When new buyers stop coming, price collapses. It's musical chairs.",
    },

    // Step 2: Insiders
    {
      type: "explanation",
      title: "Reason #2: Insider Advantage",
      image: mascots.whaleMarket,
      content: "Creators and early insiders often hold huge amounts. They bought at near-zero prices. When you see a memecoin 'trending,' insiders are already selling to you at profit.",
    },

    // Step 3: Key Takeaway
    {
      type: "explanation",
      mascot: mascots.soliWarning,
      message: "🔑 Key Takeaway: By the time you hear about a 'hot' memecoin, you're probably late. Early insiders make money—latecomers usually lose.",
    },

    // Step 4: Rug Pulls
    {
      type: "explanation",
      title: "Reason #3: Rug Pulls",
      image: mascots.scamAlert,
      content: "Many memecoins are outright scams. Creators hype the token, wait for people to buy, then drain the liquidity and disappear. The token becomes worthless instantly.",
    },

    // Step 5: Exercise 1 - MCQ WITH IMAGE
    {
      type: "exercise",
      exerciseType: "multipleChoice",
      image: mascots.chartDown,
      question: "Why do most memecoins eventually crash?",
      options: [
        "Government regulations",
        "No real utility—value depends only on new buyers",
        "Too much technology",
        "They're too popular",
      ],
      correctAnswer: 1,
    },

    // Step 6: Exercise 2 - True/False WITH IMAGE
    {
      type: "exercise",
      exerciseType: "trueFalse",
      image: mascots.whaleMarket,
      statement: "When a memecoin is trending, regular buyers usually have an advantage over insiders.",
      correctAnswer: false,
    },

    // Step 7: Attention Spans
    {
      type: "explanation",
      mascot: mascots.soliSad,
      message: "Reason #4: Short attention spans. Meme culture moves FAST. Today's hot token is forgotten tomorrow. Communities dissolve quickly when hype fades. 📉",
    },

    // Step 8: Exercise 3 - MCQ WITH IMAGE
    {
      type: "exercise",
      exerciseType: "multipleChoice",
      image: mascots.scamAlert,
      question: "What is a 'rug pull'?",
      options: [
        "A trading strategy",
        "When creators drain funds and abandon the project",
        "A type of NFT",
        "A security feature",
      ],
      correctAnswer: 1,
    },

    // Step 9: Final Exercise WITH IMAGE
    {
      type: "exercise",
      exerciseType: "trueFalse",
      image: mascots.soliTeacher,
      statement: "Understanding why memecoins fail can help you make better decisions.",
      correctAnswer: true,
    },
  ],
};

