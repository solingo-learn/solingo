import { Course, CourseProgression, ExerciseSet } from "@/types/course";

import { characters } from "./characters";
import { sectionOne } from "./sections/1";
import { sectionTwo } from "./sections/2";
import { sectionThree } from "./sections/3";
import { sectionFour } from "./sections/4";
import { sectionFive } from "./sections/5";
import { sectionSix } from "./sections/6";

export const courseContent: Course = {
  sections: [sectionOne, sectionTwo, sectionThree, sectionFour, sectionFive, sectionSix],
  characters: characters,
};

export function getExercise({
  sectionId,
  chapterId,
  lessonId,
  exerciseId,
}: CourseProgression): ExerciseSet | null {
  const section = courseContent.sections[sectionId];
  if (section) {
    const chapter = section.chapters[chapterId];
    if (chapter) {
      const lesson = chapter.lessons[lessonId];
      if (lesson && lesson.exercises && lesson.exercises.length > exerciseId) {
        return lesson.exercises[exerciseId];
      }
    }
  }
  return null;
}

export function nextProgress(
  current: CourseProgression
): CourseProgression | null {
  const { sectionId, chapterId, lessonId, exerciseId } = current;
  const section = courseContent.sections[sectionId];
  const chapter = section.chapters[chapterId];
  const lesson = chapter.lessons[lessonId];
  const exercisesCount = lesson.exercises.length;

  if (exerciseId < exercisesCount - 1) {
    return { ...current, exerciseId: exerciseId + 1 };
  } else if (lessonId < chapter.lessons.length - 1) {
    return { ...current, lessonId: lessonId + 1, exerciseId: 0 };
  } else if (chapterId < section.chapters.length - 1) {
    return { ...current, chapterId: chapterId + 1, lessonId: 0, exerciseId: 0 };
  } else if (sectionId < courseContent.sections.length - 1) {
    return {
      ...current,
      sectionId: sectionId + 1,
      chapterId: 0,
      lessonId: 0,
      exerciseId: 0,
    };
  }

  return null;
}
