// LESSON 14: Common Crypto Scams
// 10 steps with varied images - EVERY exercise has an image!

import { mascots } from "@/config/mascots";

export const lesson14 = {
  id: 14,
  title: "Common Crypto Scams",
  section: "Wallets & Security",
  totalSteps: 10,
  xpReward: 15,

  steps: [
    // Step 0: Mascot Introduction
    {
      type: "intro",
      mascot: mascots.singeFache,
      message: "Time to learn about the bad actors in crypto. 😤 Scammers are everywhere, but once you know their tricks, you won't fall for them!",
    },

    // Step 1: Phishing
    {
      type: "explanation",
      title: "Scam #1: Phishing",
      image: mascots.phishing,
      content: "Fake websites that look like real ones. They ask you to connect your wallet or enter your seed phrase. Always check URLs carefully! Bookmark official sites.",
    },

    // Step 2: Fake Airdrops
    {
      type: "explanation",
      title: "Scam #2: Fake Airdrops",
      image: mascots.scamAlert,
      content: "'You won 10,000 tokens! Connect wallet to claim!' Sound familiar? These trick you into signing malicious transactions that drain your wallet. Real airdrops don't ask you to connect first.",
    },

    // Step 3: Key Takeaway
    {
      type: "explanation",
      mascot: mascots.soliWarning,
      message: "🔑 Key Takeaway: If you have to connect your wallet or sign something to 'receive' free tokens, it's almost certainly a scam!",
    },

    // Step 4: Impersonation
    {
      type: "explanation",
      title: "Scam #3: Impersonation",
      image: mascots.homme,
      content: "Scammers pretend to be support staff, influencers, or team members in DMs. 'I can help you with your issue, just share your screen/seed phrase.' Real support NEVER DMs first!",
    },

    // Step 5: Exercise 1 - MCQ WITH IMAGE
    {
      type: "exercise",
      exerciseType: "multipleChoice",
      image: mascots.phishing,
      question: "What is phishing?",
      options: [
        "A type of crypto mining",
        "Fake websites designed to steal your info",
        "A trading strategy",
        "A type of NFT",
      ],
      correctAnswer: 1,
    },

    // Step 6: Exercise 2 - True/False WITH IMAGE
    {
      type: "exercise",
      exerciseType: "trueFalse",
      image: mascots.scamAlert,
      statement: "Real airdrops always require you to connect your wallet and sign transactions first.",
      correctAnswer: false,
    },

    // Step 7: Rug Pulls
    {
      type: "explanation",
      mascot: mascots.soliSad,
      message: "Rug pulls: Developers create hype, you buy their token, then they disappear with the money. Always research who's behind a project before participating!",
    },

    // Step 8: Exercise 3 - MCQ WITH IMAGE
    {
      type: "exercise",
      exerciseType: "multipleChoice",
      image: mascots.homme,
      question: "Someone DMs you claiming to be 'official support.' What should you do?",
      options: [
        "Share your screen to get help faster",
        "Give them your seed phrase so they can check",
        "Ignore—real support never DMs first",
        "Send them some SOL as verification",
      ],
      correctAnswer: 2,
    },

    // Step 9: Final Exercise WITH IMAGE
    {
      type: "exercise",
      exerciseType: "trueFalse",
      image: mascots.singeFache,
      statement: "You should always verify website URLs before connecting your wallet.",
      correctAnswer: true,
    },
  ],
};

