// LESSON 17: What are Memecoins?
// 10 steps with varied images - EVERY exercise has an image!

import { mascots } from "@/config/mascots";

export const lesson17 = {
  id: 17,
  title: "What are Memecoins?",
  section: "Tokens & Memecoins",
  totalSteps: 10,
  xpReward: 15,

  steps: [
    // Step 0: Mascot Introduction
    {
      type: "intro",
      mascot: mascots.singe,
      message: "Let's talk about memecoins! 🐒 They're fun, they're wild, and they're VERY risky. Understanding them is important—whether you engage or not!",
    },

    // Step 1: What are Memecoins
    {
      type: "explanation",
      title: "Memecoins Explained",
      image: mascots.joyeux,
      content: "Memecoins are tokens inspired by memes, jokes, or internet culture. They typically have no utility beyond community and speculation. Dogecoin and Shiba Inu were early examples.",
    },

    // Step 2: Why They Exist
    {
      type: "explanation",
      title: "Why Do People Create Them?",
      image: mascots.singe,
      content: "• Community building and fun\n• Speculation and trading\n• Social experiments\n• Quick profit attempts (often scams)\n\nMotivations vary wildly—from genuine community projects to outright theft.",
    },

    // Step 3: Key Takeaway
    {
      type: "explanation",
      mascot: mascots.soliWarning,
      message: "🔑 Key Takeaway: Memecoins are EXTREMELY high risk. Most go to zero. Treat any money spent on them as money you're willing to lose completely.",
    },

    // Step 4: The Reality
    {
      type: "explanation",
      title: "The Harsh Reality",
      image: mascots.chartDown,
      content: "Over 99% of memecoins fail. For every success story you hear, thousands of people lost money. The winners are usually early insiders, not regular people who see it 'trending.'",
    },

    // Step 5: Exercise 1 - MCQ WITH IMAGE
    {
      type: "exercise",
      exerciseType: "multipleChoice",
      image: mascots.joyeux,
      question: "What typically backs the value of a memecoin?",
      options: [
        "Gold reserves",
        "Company profits",
        "Community interest and speculation",
        "Government guarantees",
      ],
      correctAnswer: 2,
    },

    // Step 6: Exercise 2 - True/False WITH IMAGE
    {
      type: "exercise",
      exerciseType: "trueFalse",
      image: mascots.chartDown,
      statement: "Most memecoins eventually succeed and increase in value.",
      correctAnswer: false,
    },

    // Step 7: Not Financial Advice
    {
      type: "explanation",
      mascot: mascots.soliTeacher,
      message: "📚 We're not telling you what to do with your money. We're giving you knowledge so YOU can make informed decisions. Education, not financial advice!",
    },

    // Step 8: Exercise 3 - MCQ WITH IMAGE
    {
      type: "exercise",
      exerciseType: "multipleChoice",
      image: mascots.singe,
      question: "What percentage of memecoins typically fail?",
      options: [
        "About 10%",
        "About 50%",
        "Over 99%",
        "None, they all succeed",
      ],
      correctAnswer: 2,
    },

    // Step 9: Final Exercise WITH IMAGE
    {
      type: "exercise",
      exerciseType: "trueFalse",
      image: mascots.soliWarning,
      statement: "You should only use money you can afford to lose completely when dealing with memecoins.",
      correctAnswer: true,
    },
  ],
};

