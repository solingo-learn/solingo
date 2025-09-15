// LESSON 12: Public & Private Keys
// 10 steps with varied images - EVERY exercise has an image!

import { mascots } from "@/config/mascots";

export const lesson12 = {
  id: 12,
  title: "Public & Private Keys",
  section: "Wallets & Security",
  totalSteps: 10,
  xpReward: 15,

  steps: [
    // Step 0: Mascot Introduction
    {
      type: "intro",
      mascot: mascots.soliTeacher,
      message: "Let's understand the most important concept in crypto security: public and private keys. 🔑 This knowledge will keep you safe!",
    },

    // Step 1: Public Key
    {
      type: "explanation",
      title: "Your Public Key (Address)",
      image: mascots.blockchainNetwork,
      content: "Your public key is like your email address. You can share it with anyone who wants to send you crypto. It's safe to share publicly—that's why it's called 'public'!",
    },

    // Step 2: Private Key
    {
      type: "explanation",
      title: "Your Private Key",
      image: mascots.shieldSecurity,
      content: "Your private key is like your email password. It proves you own your crypto. NEVER share it with anyone! If someone has your private key, they can steal everything.",
    },

    // Step 3: Key Takeaway
    {
      type: "explanation",
      mascot: mascots.soliWarning,
      message: "🔑 Key Takeaway: Public key = share freely. Private key = NEVER share, NEVER screenshot, NEVER type on websites!",
    },

    // Step 4: How They Work
    {
      type: "explanation",
      title: "How They Work Together",
      image: mascots.decentralized,
      content: "When you send crypto, you sign the transaction with your private key. Others can verify it's really you using your public key—without ever seeing your private key. It's math magic!",
    },

    // Step 5: Exercise 1 - MCQ WITH IMAGE
    {
      type: "exercise",
      exerciseType: "multipleChoice",
      image: mascots.blockchainNetwork,
      question: "Your public key is like...",
      options: [
        "Your password",
        "Your email address",
        "Your bank PIN",
        "Your social security number",
      ],
      correctAnswer: 1,
    },

    // Step 6: Exercise 2 - True/False WITH IMAGE
    {
      type: "exercise",
      exerciseType: "trueFalse",
      image: mascots.scamAlert,
      statement: "It's safe to share your private key with trusted friends.",
      correctAnswer: false,
    },

    // Step 7: Warning
    {
      type: "explanation",
      mascot: mascots.singeFache,
      message: "🚨 SCAM ALERT: No legitimate project, support team, or airdrop will EVER ask for your private key. Anyone who does is trying to steal from you!",
    },

    // Step 8: Exercise 3 - MCQ WITH IMAGE
    {
      type: "exercise",
      exerciseType: "multipleChoice",
      image: mascots.shieldSecurity,
      question: "What should you do if a website asks for your private key?",
      options: [
        "Enter it if the site looks official",
        "Close immediately—it's a scam",
        "Give it if they promise rewards",
        "Share only the first half",
      ],
      correctAnswer: 1,
    },

    // Step 9: Final Exercise WITH IMAGE
    {
      type: "exercise",
      exerciseType: "trueFalse",
      image: mascots.soliTeacher,
      statement: "Your private key proves ownership of your crypto.",
      correctAnswer: true,
    },
  ],
};

