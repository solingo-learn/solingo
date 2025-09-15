import { Chapter } from "@/types/course";

import { lessonOne } from "./lessons/1";

export const chapterOne: Chapter = {
  id: 1,
  title: {
    en: "Basics",
    ja: "Basics",
    my: "Basics",
    th: "Basics",
    cn: "Basics",
    es: "Basics",
    fr: "Basics",
    hi: "Basics",
    ru: "Basics",
  },
  description: {
    en: "Understand crypto fundamentals",
    ja: "Understand crypto fundamentals",
    my: "Understand crypto fundamentals",
    th: "Understand crypto fundamentals",
    cn: "Understand crypto fundamentals",
    es: "Understand crypto fundamentals",
    fr: "Understand crypto fundamentals",
    hi: "Understand crypto fundamentals",
    ru: "Understand crypto fundamentals",
  },
  lessons: [lessonOne, lessonOne, lessonOne, lessonOne, lessonOne],
};
