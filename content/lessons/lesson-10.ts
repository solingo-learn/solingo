// LESSON 10: Why Communities Matter
// 10 steps with varied images - EVERY exercise has an image!

import { mascots } from "@/config/mascots";

export const lesson10 = {
  id: 10,
  title: "Why Communities Matter",
  section: "Solana Ecosystem",
  totalSteps: 10,
  xpReward: 15,

  steps: [
    // Step 0: Mascot Introduction
    {
      type: "intro",
      mascot: mascots.soliHappy,
      message: "Last lesson of Section 2! 🎉 Let's talk about something often overlooked but super important: community. Crypto is nothing without its people!",
    },

    // Step 1: What is Community
    {
      type: "explanation",
      title: "The Power of Community",
      image: mascots.decentralized,
      content: "In crypto, community means the people who believe in and support a project. They build, promote, create content, and help newcomers. A strong community can make or break a project!",
    },

    // Step 2: Solana Community
    {
      type: "explanation",
      title: "Solana's Community",
      image: mascots.baleineCoeur,
      content: "Solana has one of the most active communities in crypto. Developers build apps, artists create NFTs, and users participate in governance. Events like Breakpoint bring thousands together!",
    },

    // Step 3: Key Takeaway
    {
      type: "explanation",
      mascot: mascots.soliTeacher,
      message: "🔑 Key Takeaway: Technology alone doesn't make a project successful. Active, passionate communities drive adoption and create real value.",
    },

    // Step 4: How to Join
    {
      type: "explanation",
      title: "Getting Involved",
      image: mascots.homme,
      content: "You don't need to be a developer to contribute! You can:\n• Join Discord servers\n• Follow projects on X (Twitter)\n• Attend virtual events\n• Share what you learn\n• Help answer questions",
    },

    // Step 5: Exercise 1 - MCQ WITH IMAGE
    {
      type: "exercise",
      exerciseType: "multipleChoice",
      image: mascots.decentralized,
      question: "What makes a crypto community valuable?",
      options: [
        "Only the price of the token",
        "Active members who build, help, and promote",
        "Having the most expensive NFTs",
        "Celebrity endorsements",
      ],
      correctAnswer: 1,
    },

    // Step 6: Exercise 2 - True/False WITH IMAGE
    {
      type: "exercise",
      exerciseType: "trueFalse",
      image: mascots.baleineCoeur,
      statement: "You need to be a developer to contribute to a crypto community.",
      correctAnswer: false,
    },

    // Step 7: Warning
    {
      type: "explanation",
      mascot: mascots.soliWarning,
      message: "⚠️ Be careful: Some 'communities' are just hype machines trying to pump prices. Look for projects with real builders, not just speculators!",
    },

    // Step 8: Exercise 3 - MCQ WITH IMAGE
    {
      type: "exercise",
      exerciseType: "multipleChoice",
      image: mascots.homme,
      question: "What's a red flag in a crypto community?",
      options: [
        "Active developers answering questions",
        "Regular updates and transparency",
        "Only talking about price and 'going to the moon'",
        "Educational content for beginners",
      ],
      correctAnswer: 2,
    },

    // Step 9: Final Exercise WITH IMAGE
    {
      type: "exercise",
      exerciseType: "trueFalse",
      image: mascots.soliCelebrate,
      statement: "A strong community can help a crypto project succeed long-term.",
      correctAnswer: true,
    },
  ],
};

