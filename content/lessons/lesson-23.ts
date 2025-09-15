// LESSON 23: Market Emotions
// 10 steps with varied images - EVERY exercise has an image!

import { mascots } from "@/config/mascots";

export const lesson23 = {
  id: 23,
  title: "Market Emotions",
  section: "Market Mechanics",
  totalSteps: 10,
  xpReward: 15,

  steps: [
    // Step 0: Mascot Introduction
    {
      type: "intro",
      mascot: mascots.soliThinking,
      message: "Markets aren't driven by logic alone—emotions play a HUGE role! 🧠 Understanding fear and greed will help you think more clearly.",
    },

    // Step 1: Fear and Greed
    {
      type: "explanation",
      title: "The Two Main Emotions",
      image: mascots.taurauxEtOne,
      content: "FEAR: Makes people sell (panic selling, FUD)\nGREED: Makes people buy (FOMO, euphoria)\n\nMarkets swing between these two emotions constantly. Smart participants recognize which is dominant.",
    },

    // Step 2: FOMO
    {
      type: "explanation",
      title: "Understanding FOMO",
      image: mascots.chartUp,
      content: "FOMO = Fear Of Missing Out. When you see prices pumping, you feel the urge to buy NOW or miss the gains. This emotion causes people to buy at tops—the worst time!",
    },

    // Step 3: Key Takeaway
    {
      type: "explanation",
      mascot: mascots.soliWarning,
      message: "🔑 Key Takeaway: When everyone is excited, it's often time to be cautious. When everyone is panicking, opportunities may appear. Emotions are often backwards!",
    },

    // Step 4: FUD
    {
      type: "explanation",
      title: "Understanding FUD",
      image: mascots.chartDown,
      content: "FUD = Fear, Uncertainty, Doubt. Negative news, rumors, or sentiment that makes people sell in panic. Sometimes justified, often exaggerated. Don't make decisions in panic!",
    },

    // Step 5: Exercise 1 - MCQ WITH IMAGE
    {
      type: "exercise",
      exerciseType: "multipleChoice",
      image: mascots.taurauxEtOne,
      question: "What does FOMO stand for?",
      options: [
        "Fear Of Major Orders",
        "Fear Of Missing Out",
        "First On Market Opportunity",
        "Fast Online Money Operation",
      ],
      correctAnswer: 1,
    },

    // Step 6: Exercise 2 - True/False WITH IMAGE
    {
      type: "exercise",
      exerciseType: "trueFalse",
      image: mascots.chartUp,
      statement: "Buying when prices are pumping and you feel excited is usually a good strategy.",
      correctAnswer: false,
    },

    // Step 7: Crowd Psychology
    {
      type: "explanation",
      mascot: mascots.soliHappy,
      message: "💡 The crowd is usually wrong at extremes. Peak euphoria = potential top. Maximum fear = potential bottom. This doesn't mean 'buy the dip' always works—but awareness helps!",
    },

    // Step 8: Exercise 3 - MCQ WITH IMAGE
    {
      type: "exercise",
      exerciseType: "multipleChoice",
      image: mascots.chartDown,
      question: "What does FUD stand for?",
      options: [
        "Funds Under Development",
        "Fear, Uncertainty, Doubt",
        "Fast Up/Down",
        "Future Uncertain Data",
      ],
      correctAnswer: 1,
    },

    // Step 9: Final Exercise WITH IMAGE
    {
      type: "exercise",
      exerciseType: "trueFalse",
      image: mascots.soliTeacher,
      statement: "Making decisions when you're emotional often leads to poor outcomes.",
      correctAnswer: true,
    },
  ],
};

