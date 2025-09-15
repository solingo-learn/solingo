import React, { useState, useRef, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { router } from "expo-router";
import { Pressable, useWindowDimensions } from "react-native";
import { Image } from "expo-image";
import { View, Text } from "@/components/themed";
import { LessonHeader } from "@/components/lesson/lesson-header";
import { LessonScreen } from "@/components/lesson/lesson-screen";
import { MultipleChoice } from "@/components/lesson/exercise-types/multiple-choice";
import { TrueFalse } from "@/components/lesson/exercise-types/true-false";
import { VictoryAnimation } from "@/components/lesson/victory-animation";
import { OutOfHearts } from "@/components/lesson/out-of-hearts";
import { QuitConfirmation } from "@/components/lesson/quit-confirmation";
import { FirstLessonFeedback, shouldShowFirstLessonFeedback } from "@/components/lesson/first-lesson-feedback";
import { useSound } from "@/hooks/use-sound";
import { useLives } from "@/context/lives";
import { useUserStats } from "@/context/user-stats";
import { useSpacedRepetition } from "@/hooks/use-spaced-repetition";
import { getLesson } from "@/content/lessons";
import { themeColors } from "@/constants/colors";
import { layouts } from "@/constants/layouts";

const singeImage = require("@/assets/mascotte/singe.png");

export default function LessonPage() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const lessonNumber = parseInt(lessonId || "1", 10);
  
  const lesson = getLesson(lessonNumber);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [stepsCompleted, setStepsCompleted] = useState(0); // Track steps passed (correct or wrong) for progress bar
  const [showVictory, setShowVictory] = useState(false);
  const [showOutOfHearts, setShowOutOfHearts] = useState(false);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);
  const [showReviewIntro, setShowReviewIntro] = useState(false);
  const [showFirstLessonFeedback, setShowFirstLessonFeedback] = useState(false);
  
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;
  const maxContentWidth = isDesktop ? 480 : width;
  
  const { playCorrect, playWrong } = useSound();
  const { loseLife, lives } = useLives();
  const { completeLesson, updateStreak } = useUserStats();
  const spacedRepetition = useSpacedRepetition(lesson?.totalSteps || 10);
  
  // Track time spent for stats
  const startTime = useRef(Date.now());
  const [timeSpent, setTimeSpent] = useState("00:00");
  
  // Calculate bonus gems (based on no errors)
  const [errorsCount, setErrorsCount] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime.current) / 1000);
      const minutes = Math.floor(elapsed / 60);
      const seconds = elapsed % 60;
      setTimeSpent(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  if (!lesson) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center",
        backgroundColor: themeColors.dark.background,
      }}>
        <Text style={{ color: "#FFFFFF", fontSize: 18 }}>
          Lesson {lessonNumber} coming soon! 🚀
        </Text>
      </View>
    );
  }

  const currentStepData = lesson.steps[currentStep];

  const handleNext = () => {
    // Increment progress for intro/explanation steps
    if (currentStepData?.type === "intro" || currentStepData?.type === "explanation") {
      setStepsCompleted(prev => prev + 1);
    }
    
    // Check if we need to start review mode (only at end of lesson)
    if (currentStep >= lesson.totalSteps - 1) {
      if (spacedRepetition.hasFailedExercises()) {
        setShowReviewIntro(true);
        return;
      }
      setShowVictory(true);
      return;
    }

    // Move to next step
    setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStartReview = () => {
    setShowReviewIntro(false);
    // Pass current progress so the bar continues from where we left off
    spacedRepetition.startReview(stepsCompleted);
    const firstReview = spacedRepetition.getCurrentReviewExercise();
    if (firstReview) {
      setCurrentStep(firstReview.stepIndex);
    }
  };

  const handleCorrectAnswer = () => {
    playCorrect();
    
    if (spacedRepetition.isReviewMode) {
      // In review mode: remove exercise from queue, increment progress
      // Use returned values to avoid stale state issues
      const { isComplete, nextExercise } = spacedRepetition.markPassedInReview(currentStep);
      setStepsCompleted(prev => prev + 1); // Increment progress bar
      
      // Check if review is complete (all exercises passed)
      if (isComplete) {
        setShowVictory(true);
        return;
      }
      
      // Move to next exercise in queue
      if (nextExercise) {
        setCurrentStep(nextExercise.stepIndex);
      } else {
        setShowVictory(true);
      }
    } else {
      // Normal mode: increment progress and move to next step
      setStepsCompleted(prev => prev + 1);
      
      if (currentStep >= lesson.totalSteps - 1) {
        if (spacedRepetition.hasFailedExercises()) {
          setShowReviewIntro(true);
          return;
        }
        setShowVictory(true);
        return;
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handleWrongAnswer = () => {
    playWrong();
    loseLife();
    setErrorsCount(prev => prev + 1);
    
    if (lives <= 1) {
      setShowOutOfHearts(true);
      return; // Don't advance if out of hearts
    }
    
    if (spacedRepetition.isReviewMode) {
      // In review mode: move exercise to end of queue, go to next
      // Use returned value to avoid stale state issues
      const { nextExercise } = spacedRepetition.markFailedInReview(currentStep);
      
      // DON'T increment progress - they need to get it right
      // Move to next exercise in queue (which is now a different one)
      if (nextExercise) {
        setCurrentStep(nextExercise.stepIndex);
      }
    } else {
      // Normal mode: mark as failed, move to next but DON'T increment progress
      if (currentStepData?.type === "exercise") {
        spacedRepetition.markFailed(currentStep);
      }
      
      // Progress bar does NOT increase on wrong answer
      // User needs to complete this in review mode to fill the bar
      
      if (currentStep < lesson.totalSteps - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        // End of lesson, check if we need review
        if (spacedRepetition.hasFailedExercises()) {
          setShowReviewIntro(true);
        } else {
          setShowVictory(true);
        }
      }
    }
  };

  // Calculate bonus gems based on performance
  const calculateBonus = () => {
    if (errorsCount === 0) return 5; // Perfect run
    if (errorsCount <= 1) return 3;
    if (errorsCount <= 3) return 1;
    return 0;
  };

  const handleLessonComplete = async () => {
    // Save XP and gems
    const xpEarned = lesson?.xpReward || 10;
    const gemsEarned = calculateBonus();
    
    await completeLesson(lessonNumber, xpEarned, gemsEarned);
    await updateStreak();
    
    setShowVictory(false);
    
    // Check if we should show first lesson feedback
    const shouldShowFeedback = await shouldShowFirstLessonFeedback(lessonNumber);
    if (shouldShowFeedback) {
      setShowFirstLessonFeedback(true);
    } else {
      spacedRepetition.reset();
      router.push("/learn");
    }
  };

  const handleFeedbackClose = () => {
    setShowFirstLessonFeedback(false);
    spacedRepetition.reset();
    router.push("/learn");
  };

  const handleCloseAttempt = () => {
    setShowQuitConfirm(true);
  };

  const handleQuitConfirm = () => {
    setShowQuitConfirm(false);
    spacedRepetition.reset();
    router.push("/learn");
  };

  const handleSubscribe = () => {
    setShowOutOfHearts(false);
    router.push("/shop");
  };

  const handleWaitForHearts = () => {
    setShowOutOfHearts(false);
    router.push("/learn");
  };

  const renderStep = () => {
    if (!currentStepData) return null;

    switch (currentStepData.type) {
      case "intro":
        return (
          <LessonScreen
            key={`intro-${currentStep}-${lessonNumber}`}
            type="intro"
            tag={`LESSON ${lessonNumber}`}
            title={lesson.title}
            mascot={currentStepData.mascot}
            mascotMessage={currentStepData.message}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );

      case "explanation":
        return (
          <LessonScreen
            key={`exp-${currentStep}-${lessonNumber}`}
            type={currentStepData.mascot ? "keyTakeaway" : "explanation"}
            title={currentStepData.title}
            content={currentStepData.content}
            illustration={currentStepData.image}
            mascot={currentStepData.mascot}
            mascotMessage={currentStepData.message}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );

      case "exercise":
        if (currentStepData.exerciseType === "multipleChoice") {
          return (
            <MultipleChoice
              key={`mc-${currentStep}-${lessonNumber}`}
              question={currentStepData.question}
              options={currentStepData.options}
              correctAnswer={currentStepData.correctAnswer}
              illustration={currentStepData.image}
              hint={currentStepData.hint}
              explanation={currentStepData.explanation}
              onCorrect={handleCorrectAnswer}
              onWrong={handleWrongAnswer}
            />
          );
        }

        if (currentStepData.exerciseType === "trueFalse") {
          return (
            <TrueFalse
              key={`tf-${currentStep}-${lessonNumber}`}
              statement={currentStepData.statement}
              correctAnswer={currentStepData.correctAnswer}
              illustration={currentStepData.image}
              explanation={currentStepData.explanation}
              onCorrect={handleCorrectAnswer}
              onWrong={handleWrongAnswer}
            />
          );
        }

        return null;

      default:
        return null;
    }
  };

  // Review intro screen with monkey
  if (showReviewIntro) {
    return (
      <View style={{ flex: 1, backgroundColor: themeColors.dark.background }}>
        <LessonHeader
          currentStep={stepsCompleted}
          totalSteps={lesson.totalSteps}
          onClose={handleCloseAttempt}
          isReviewMode={false}
        />
        
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: layouts.padding * 2,
          }}
        >
          <View
            style={{
              width: "100%",
              maxWidth: maxContentWidth,
              alignItems: "center",
              gap: layouts.padding * 2,
            }}
          >
            {/* Monkey image */}
            <Image
              source={singeImage}
              contentFit="contain"
              style={{
                width: 180,
                height: 180,
              }}
            />
            
            {/* Title */}
            <Text
              style={{
                fontSize: 28,
                fontWeight: "800",
                color: "#FFFFFF",
                textAlign: "center",
              }}
            >
              Time to Review! 🔄
            </Text>
            
            {/* Message */}
            <Text
              style={{
                fontSize: 18,
                color: "rgba(255, 255, 255, 0.8)",
                textAlign: "center",
                lineHeight: 28,
              }}
            >
              Let's review the exercises you struggled with. Practice makes perfect!
            </Text>
            
            {/* Continue button */}
            <Pressable
              onPress={handleStartReview}
              style={({ pressed }) => ({
                backgroundColor: "#58CC02",
                paddingVertical: 18,
                paddingHorizontal: 48,
                borderRadius: 16,
                borderBottomWidth: 4,
                borderBottomColor: "#46A302",
                opacity: pressed ? 0.9 : 1,
                width: "100%",
                marginTop: layouts.padding,
              })}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "800",
                  color: "#FFFFFF",
                  textAlign: "center",
                  textTransform: "uppercase",
                }}
              >
                Continue
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  // Calculate progress bar values
  // In review mode: continue from base progress, add completed reviews
  // Total = base progress + initial review count (to reach 100% when all reviews done)
  const progressCurrent = spacedRepetition.isReviewMode 
    ? spacedRepetition.reviewProgress.baseProgress + spacedRepetition.reviewProgress.completed
    : stepsCompleted;
  const progressTotal = spacedRepetition.isReviewMode 
    ? spacedRepetition.reviewProgress.baseProgress + spacedRepetition.reviewProgress.total
    : lesson.totalSteps;

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.dark.background }}>
      <LessonHeader
        currentStep={progressCurrent}
        totalSteps={progressTotal}
        onClose={handleCloseAttempt}
        isReviewMode={spacedRepetition.isReviewMode}
      />

      {renderStep()}

      <VictoryAnimation
        visible={showVictory}
        onClose={handleLessonComplete}
        xpEarned={lesson.xpReward}
        bonusEarned={calculateBonus()}
        timeSpent={timeSpent}
        accuracy={Math.round(((lesson.totalSteps - errorsCount) / lesson.totalSteps) * 100)}
      />

      <OutOfHearts
        visible={showOutOfHearts}
        currentLevel={lessonNumber}
        onClose={() => setShowOutOfHearts(false)}
        onSubscribe={handleSubscribe}
        onWait={handleWaitForHearts}
      />

      <QuitConfirmation
        visible={showQuitConfirm}
        onCancel={() => setShowQuitConfirm(false)}
        onConfirm={handleQuitConfirm}
      />

      <FirstLessonFeedback
        visible={showFirstLessonFeedback}
        onClose={handleFeedbackClose}
      />
    </View>
  );
}
