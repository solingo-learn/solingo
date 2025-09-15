import { Chapter } from "@/types/course";

import { lessonOne } from "../../../1/chapters/1/lessons/1";

export const chapterThree: Chapter = {
  id: 3,
  title: {
    en: "Stay Safe",
    ja: "Stay Safe",
    my: "Stay Safe",
    th: "Stay Safe",
    cn: "Stay Safe",
    es: "Stay Safe",
    fr: "Stay Safe",
    hi: "Stay Safe",
    ru: "Stay Safe",
  },
  description: {
    en: "Protect your crypto assets",
    ja: "Protect your crypto assets",
    my: "Protect your crypto assets",
    th: "Protect your crypto assets",
    cn: "Protect your crypto assets",
    es: "Protect your crypto assets",
    fr: "Protect your crypto assets",
    hi: "Protect your crypto assets",
    ru: "Protect your crypto assets",
  },
  lessons: [lessonOne, lessonOne, lessonOne, lessonOne, lessonOne],
};

