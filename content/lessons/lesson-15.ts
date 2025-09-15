// LESSON 15: Staying Safe Long Term
// 10 steps with varied images - EVERY exercise has an image!

import { mascots } from "@/config/mascots";

export const lesson15 = {
  id: 15,
  title: "Staying Safe Long Term",
  section: "Wallets & Security",
  totalSteps: 10,
  xpReward: 15,

  steps: [
    // Step 0: Mascot Introduction
    {
      type: "intro",
      mascot: mascots.soliTeacher,
      message: "Last lesson of Section 3! 🛡️ Let's build habits that will keep you safe in crypto for years to come. Security is a practice, not a one-time thing!",
    },

    // Step 1: Use Multiple Wallets
    {
      type: "explanation",
      title: "Tip #1: Use Multiple Wallets",
      image: mascots.walletIcon,
      content: "Don't keep everything in one wallet! Use a 'hot' wallet with small amounts for daily use, and a 'cold' wallet or separate account for larger holdings.",
    },

    // Step 2: Regular Checks
    {
      type: "explanation",
      title: "Tip #2: Check Permissions",
      image: mascots.shieldSecurity,
      content: "Regularly review which apps can access your wallet. Revoke permissions for apps you no longer use. Sites like Solana.fm help you check connected apps.",
    },

    // Step 3: Key Takeaway
    {
      type: "explanation",
      mascot: mascots.soliThinking,
      message: "🔑 Key Takeaway: Good security is layered. Multiple wallets + careful signing + regular reviews = strong protection!",
    },

    // Step 4: Read Before Signing
    {
      type: "explanation",
      title: "Tip #3: Read Before You Sign",
      image: mascots.securite,
      content: "Every transaction you sign could give permissions. Before clicking 'Approve':\n• What am I signing?\n• What permissions am I giving?\n• Is this the official site?\n\nWhen in doubt, don't sign!",
    },

    // Step 5: Exercise 1 - MCQ WITH IMAGE
    {
      type: "exercise",
      exerciseType: "multipleChoice",
      image: mascots.walletIcon,
      question: "Why should you use multiple wallets?",
      options: [
        "To confuse hackers with many addresses",
        "To separate daily use funds from main holdings",
        "Because one wallet has limited space",
        "It's not recommended",
      ],
      correctAnswer: 1,
    },

    // Step 6: Exercise 2 - True/False WITH IMAGE
    {
      type: "exercise",
      exerciseType: "trueFalse",
      image: mascots.shieldSecurity,
      statement: "You should regularly review and revoke unused app permissions.",
      correctAnswer: true,
    },

    // Step 7: Stay Updated
    {
      type: "explanation",
      mascot: mascots.soliHappy,
      message: "💡 Tip #4: Stay informed! Follow security researchers, join community channels, and keep learning. Scams evolve, so your knowledge should too!",
    },

    // Step 8: Exercise 3 - MCQ WITH IMAGE
    {
      type: "exercise",
      exerciseType: "multipleChoice",
      image: mascots.securite,
      question: "What should you do before signing any transaction?",
      options: [
        "Sign quickly before the offer expires",
        "Read what you're approving and verify the site",
        "Always sign if it looks official",
        "Ask someone else to sign for you",
      ],
      correctAnswer: 1,
    },

    // Step 9: Final Exercise WITH IMAGE
    {
      type: "exercise",
      exerciseType: "trueFalse",
      image: mascots.soliCelebrate,
      statement: "Security is a one-time setup, not an ongoing practice.",
      correctAnswer: false,
    },
  ],
};

