// LESSON 25: Your Crypto Journey
// 10 steps with varied images - FINAL LESSON!

import { mascots } from "@/config/mascots";

export const lesson25 = {
  id: 25,
  title: "Your Crypto Journey",
  section: "Mindset & Responsibility",
  totalSteps: 10,
  xpReward: 25,

  steps: [
    // Step 0: Mascot Introduction
    {
      type: "intro",
      mascot: mascots.soliCelebrate,
      message: "Congratulations—you made it to the FINAL lesson! 🎉 Let's wrap up everything you've learned and talk about your journey ahead.",
    },

    // Step 1: What You Learned
    {
      type: "explanation",
      title: "What You've Learned",
      image: mascots.taureauGagne,
      content: "✅ Crypto & blockchain basics\n✅ How Solana works\n✅ Wallet security\n✅ Tokens & memecoins risks\n✅ Market mechanics\n\nYou now know more than 95% of beginners!",
    },

    // Step 2: Education First
    {
      type: "explanation",
      title: "Education Before Action",
      image: mascots.soliTeacher,
      content: "The most successful people in crypto are continuous learners. Keep reading, keep questioning, keep learning. This course is just the beginning!",
    },

    // Step 3: Key Takeaway
    {
      type: "explanation",
      mascot: mascots.soliHappy,
      message: "🔑 Final Takeaway: Knowledge is your best protection. Scams can't fool an educated person. Markets can't shake an informed holder. Keep learning!",
    },

    // Step 4: Responsibility
    {
      type: "explanation",
      title: "You Are Responsible",
      image: mascots.shieldSecurity,
      content: "In crypto, you are your own bank. This means freedom—but also responsibility. Protect your keys, do your research, and never risk more than you can afford to lose.",
    },

    // Step 5: Exercise 1 - MCQ WITH IMAGE
    {
      type: "exercise",
      exerciseType: "multipleChoice",
      image: mascots.soliTeacher,
      question: "What's the best protection in crypto?",
      options: [
        "Luck",
        "Following influencers",
        "Knowledge and education",
        "Buying the dip",
      ],
      correctAnswer: 2,
    },

    // Step 6: Exercise 2 - True/False WITH IMAGE
    {
      type: "exercise",
      exerciseType: "trueFalse",
      image: mascots.taureauGagne,
      statement: "This course taught you everything you need to know about crypto.",
      correctAnswer: false,
    },

    // Step 7: Next Steps
    {
      type: "explanation",
      mascot: mascots.soliThinking,
      message: "🚀 Next steps:\n• Practice with small amounts\n• Join communities (carefully)\n• Keep learning new topics\n• Stay humble and skeptical\n• Have fun exploring!",
    },

    // Step 8: Exercise 3 - MCQ WITH IMAGE
    {
      type: "exercise",
      exerciseType: "multipleChoice",
      image: mascots.shieldSecurity,
      question: "What should you NEVER risk in crypto?",
      options: [
        "Time learning",
        "Money you can't afford to lose",
        "Reading documentation",
        "Asking questions",
      ],
      correctAnswer: 1,
    },

    // Step 9: Final Celebration
    {
      type: "exercise",
      exerciseType: "trueFalse",
      image: mascots.soliCelebrate,
      statement: "You are now ready to continue your crypto education journey!",
      correctAnswer: true,
    },
  ],
};

