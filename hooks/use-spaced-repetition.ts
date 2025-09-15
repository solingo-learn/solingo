import { useState, useCallback } from "react";

interface FailedExercise {
  stepIndex: number;
  attempts: number;
}

export function useSpacedRepetition(totalSteps: number) {
  const [failedExercises, setFailedExercises] = useState<FailedExercise[]>([]);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [initialReviewCount, setInitialReviewCount] = useState(0); // Track initial count for progress
  const [reviewCompletedCount, setReviewCompletedCount] = useState(0); // Track how many reviews passed
  const [baseProgress, setBaseProgress] = useState(0); // Progress before review mode started

  // Mark an exercise as failed during normal lesson
  const markFailed = useCallback((stepIndex: number) => {
    setFailedExercises((prev) => {
      const existing = prev.find((e) => e.stepIndex === stepIndex);
      if (existing) {
        return prev.map((e) =>
          e.stepIndex === stepIndex
            ? { ...e, attempts: e.attempts + 1 }
            : e
        );
      }
      return [...prev, { stepIndex, attempts: 1 }];
    });
  }, []);

  // Mark an exercise as passed in review - remove from queue
  // Returns { isComplete, nextExercise } to avoid stale state issues
  const markPassedInReview = useCallback((stepIndex: number): { isComplete: boolean; nextExercise: FailedExercise | null } => {
    let isComplete = false;
    let nextExercise: FailedExercise | null = null;
    
    setFailedExercises((prev) => {
      const newList = prev.filter((e) => e.stepIndex !== stepIndex);
      // Calculate next state synchronously
      isComplete = newList.length === 0;
      nextExercise = newList.length > 0 ? newList[0] : null;
      return newList;
    });
    setReviewCompletedCount((prev) => prev + 1);
    
    return { isComplete, nextExercise };
  }, []);

  // Mark an exercise as failed in review - move to end of queue
  // Returns { nextExercise } to avoid stale state issues
  const markFailedInReview = useCallback((stepIndex: number): { nextExercise: FailedExercise | null } => {
    let nextExercise: FailedExercise | null = null;
    
    setFailedExercises((prev) => {
      const failedExercise = prev.find((e) => e.stepIndex === stepIndex);
      if (!failedExercise) return prev;
      
      // Remove from current position and add to end
      const filtered = prev.filter((e) => e.stepIndex !== stepIndex);
      const newList = [...filtered, { ...failedExercise, attempts: failedExercise.attempts + 1 }];
      
      // Next exercise is now the first in the new list
      nextExercise = newList.length > 0 ? newList[0] : null;
      return newList;
    });
    
    return { nextExercise };
  }, []);

  // Check if we need to enter review mode
  const shouldStartReview = useCallback(
    (currentStep: number) => {
      // If we're at the last step and have failed exercises
      return currentStep >= totalSteps - 1 && failedExercises.length > 0;
    },
    [totalSteps, failedExercises]
  );

  // Start review mode - capture current progress
  const startReview = useCallback((currentProgress: number) => {
    setInitialReviewCount(failedExercises.length);
    setBaseProgress(currentProgress); // Save progress before review
    setReviewCompletedCount(0);
    setIsReviewMode(true);
  }, [failedExercises.length]);

  // Get current review exercise (always first in queue)
  const getCurrentReviewExercise = useCallback(() => {
    if (!isReviewMode || failedExercises.length === 0) return null;
    return failedExercises[0]; // Always get first item in queue
  }, [isReviewMode, failedExercises]);

  // Check if all reviews are completed
  const isReviewComplete = useCallback(() => {
    return isReviewMode && failedExercises.length === 0;
  }, [isReviewMode, failedExercises]);

  // Check if level can be validated
  const canValidateLevel = useCallback(() => {
    return failedExercises.length === 0;
  }, [failedExercises]);

  // Check if there are failed exercises
  const hasFailedExercises = useCallback(() => {
    return failedExercises.length > 0;
  }, [failedExercises]);

  // Reset for new lesson
  const reset = useCallback(() => {
    setFailedExercises([]);
    setIsReviewMode(false);
    setInitialReviewCount(0);
    setReviewCompletedCount(0);
    setBaseProgress(0);
  }, []);

  // Get remaining exercises count in review queue
  const getRemainingCount = useCallback(() => {
    return failedExercises.length;
  }, [failedExercises]);

  return {
    failedExercises,
    isReviewMode,
    markFailed,
    markPassedInReview,
    markFailedInReview,
    shouldStartReview,
    startReview,
    getCurrentReviewExercise,
    isReviewComplete,
    canValidateLevel,
    hasFailedExercises,
    getRemainingCount,
    reset,
    // Progress info for the bar
    reviewProgress: {
      completed: reviewCompletedCount,
      total: initialReviewCount,
      baseProgress: baseProgress, // Progress before review started
    },
  };
}
