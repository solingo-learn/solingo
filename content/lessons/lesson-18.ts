// LESSON 18: Hype vs Fundamentals
// 10 steps with varied images - EVERY exercise has an image!

import { mascots } from "@/config/mascots";

export const lesson18 = {
  id: 18,
  title: "Hype vs Fundamentals",
  section: "Tokens & Memecoins",
  totalSteps: 10,
  xpReward: 15,

  steps: [
    // Step 0: Mascot Introduction
    {
      type: "intro",
      mascot: mascots.soliThinking,
      message: "How do you tell a good project from a scam? 🤔 Let's learn to separate hype from fundamentals—a skill that will save you from many bad decisions!",
    },

    // Step 1: What is Hype
    {
      type: "explanation",
      title: "Understanding Hype",
      image: mascots.chartUp,
      content: "Hype is excitement driven by marketing, influencers, and FOMO (fear of missing out). It creates short-term price pumps but rarely sustains long-term value.",
    },

    // Step 2: What are Fundamentals
    {
      type: "explanation",
      title: "Understanding Fundamentals",
      image: mascots.blockchain,
      content: "Fundamentals are the actual substance: real technology, working products, transparent teams, actual users, sustainable business models. These create lasting value.",
    },

    // Step 3: Key Takeaway
    {
      type: "explanation",
      mascot: mascots.soliTeacher,
      message: "🔑 Key Takeaway: Hype can make prices go up fast—and crash just as fast. Fundamentals create slower but more sustainable growth. Know the difference!",
    },

    // Step 4: Red Flags
    {
      type: "explanation",
      title: "Hype Red Flags",
      image: mascots.scamAlert,
      content: "🚩 Red flags:\n• 'Guaranteed' returns\n• Anonymous teams\n• Only price talk, no product\n• Paid influencer promotions\n• Pressure to 'buy now!'\n• Too-good-to-be-true promises",
    },

    // Step 5: Exercise 1 - MCQ WITH IMAGE
    {
      type: "exercise",
      exerciseType: "multipleChoice",
      image: mascots.chartUp,
      question: "What typically drives hype?",
      options: [
        "Working technology and real users",
        "Marketing, influencers, and FOMO",
        "Long-term business plans",
        "Government regulations",
      ],
      correctAnswer: 1,
    },

    // Step 6: Exercise 2 - True/False WITH IMAGE
    {
      type: "exercise",
      exerciseType: "trueFalse",
      image: mascots.scamAlert,
      statement: "If influencers are promoting a token, it's definitely a good project.",
      correctAnswer: false,
    },

    // Step 7: Green Flags
    {
      type: "explanation",
      mascot: mascots.soliHappy,
      message: "✅ Green flags: Public team, working product, real users, transparent communication, focus on building (not just marketing), admits risks and challenges.",
    },

    // Step 8: Exercise 3 - MCQ WITH IMAGE
    {
      type: "exercise",
      exerciseType: "multipleChoice",
      image: mascots.blockchain,
      question: "Which is a sign of good fundamentals?",
      options: [
        "Celebrity endorsement",
        "Promises of 100x returns",
        "Working product with real users",
        "Pressure to buy immediately",
      ],
      correctAnswer: 2,
    },

    // Step 9: Final Exercise WITH IMAGE
    {
      type: "exercise",
      exerciseType: "trueFalse",
      image: mascots.soliThinking,
      statement: "A project with anonymous team and only price talk is a red flag.",
      correctAnswer: true,
    },
  ],
};

