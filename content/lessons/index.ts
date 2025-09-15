// All 25 Solingo Lessons
// Complete course content for crypto education

import { lesson1 } from "./lesson-1";
import { lesson2 } from "./lesson-2";
import { lesson3 } from "./lesson-3";
import { lesson4 } from "./lesson-4";
import { lesson5 } from "./lesson-5";
import { lesson6 } from "./lesson-6";
import { lesson7 } from "./lesson-7";
import { lesson8 } from "./lesson-8";
import { lesson9 } from "./lesson-9";
import { lesson10 } from "./lesson-10";
import { lesson11 } from "./lesson-11";
import { lesson12 } from "./lesson-12";
import { lesson13 } from "./lesson-13";
import { lesson14 } from "./lesson-14";
import { lesson15 } from "./lesson-15";
import { lesson16 } from "./lesson-16";
import { lesson17 } from "./lesson-17";
import { lesson18 } from "./lesson-18";
import { lesson19 } from "./lesson-19";
import { lesson20 } from "./lesson-20";
import { lesson21 } from "./lesson-21";
import { lesson22 } from "./lesson-22";
import { lesson23 } from "./lesson-23";
import { lesson24 } from "./lesson-24";
import { lesson25 } from "./lesson-25";

// Export all lessons
export {
  lesson1,
  lesson2,
  lesson3,
  lesson4,
  lesson5,
  lesson6,
  lesson7,
  lesson8,
  lesson9,
  lesson10,
  lesson11,
  lesson12,
  lesson13,
  lesson14,
  lesson15,
  lesson16,
  lesson17,
  lesson18,
  lesson19,
  lesson20,
  lesson21,
  lesson22,
  lesson23,
  lesson24,
  lesson25,
};

// Lesson registry for easy access by ID
const lessonsRegistry: Record<number, any> = {
  1: lesson1,
  2: lesson2,
  3: lesson3,
  4: lesson4,
  5: lesson5,
  6: lesson6,
  7: lesson7,
  8: lesson8,
  9: lesson9,
  10: lesson10,
  11: lesson11,
  12: lesson12,
  13: lesson13,
  14: lesson14,
  15: lesson15,
  16: lesson16,
  17: lesson17,
  18: lesson18,
  19: lesson19,
  20: lesson20,
  21: lesson21,
  22: lesson22,
  23: lesson23,
  24: lesson24,
  25: lesson25,
};

// Helper function to get lesson by ID
export function getLesson(lessonId: number) {
  return lessonsRegistry[lessonId] || null;
}

// Get all lessons as array
export function getAllLessons() {
  return Object.values(lessonsRegistry);
}

// Course structure for navigation
export const courseStructure = {
  sections: [
    {
      id: 1,
      title: "Crypto Foundations",
      lessons: [1, 2, 3, 4, 5],
    },
    {
      id: 2,
      title: "Solana Ecosystem",
      lessons: [6, 7, 8, 9, 10],
    },
    {
      id: 3,
      title: "Wallets & Security",
      lessons: [11, 12, 13, 14, 15],
    },
    {
      id: 4,
      title: "Tokens & Memecoins",
      lessons: [16, 17, 18, 19, 20],
    },
    {
      id: 5,
      title: "Market Mechanics & Mindset",
      lessons: [21, 22, 23, 24, 25],
    },
  ],
  totalLessons: 25,
};
