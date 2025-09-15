import { useEffect, useState } from "react";
import { router, useSegments } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useCourse } from "@/context/course";
import { useAuth } from "@/context/auth";

interface Props {
  children: React.ReactNode;
}

export function ProtectedRouteProvider({ children }: Props) {
  const segments = useSegments();
  const { courseId } = useCourse();
  const { user, loading } = useAuth();
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null);

  const inCourseGroup = segments[0] === "(course)";
  const inLessonGroup = segments[0] === "(lesson)";
  const inGuestGroup = segments[0] === "(guest)";

  // Check onboarding status
  useEffect(() => {
    const checkOnboarding = async () => {
      // Check onboarding for all platforms (mobile and web)
      const completed = await AsyncStorage.getItem("onboarding_completed");
      setOnboardingCompleted(completed === "true");
    };
    checkOnboarding();
  }, [segments]); // Re-check when segments change

  useEffect(() => {
    // Wait for loading to complete and onboarding status to be checked
    if (loading || onboardingCompleted === null) return;

    // If onboarding not completed and not in guest group, redirect to guest/onboarding
    if (!onboardingCompleted && !inGuestGroup) {
      router.replace("/(guest)");
      return;
    }

    // If no courseId and trying to access course/lesson pages, redirect to guest
    if (!courseId && (inCourseGroup || inLessonGroup)) {
      router.replace("/(guest)");
      return;
    }

    // If courseId exists, onboarding completed, and not in course/lesson group, redirect to learn
    if (courseId && onboardingCompleted && !inGuestGroup && !(inCourseGroup || inLessonGroup)) {
      router.replace("/learn");
    }
  }, [segments, courseId, loading, onboardingCompleted, user]);

  return <>{children}</>;
}
