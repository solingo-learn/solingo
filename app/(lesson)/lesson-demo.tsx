import React, { useState } from "react";
import { View } from "@/components/themed";
import { LessonHeader } from "@/components/lesson/lesson-header";
import { LessonScreen } from "@/components/lesson/lesson-screen";
import { MultipleChoice } from "@/components/lesson/exercise-types/multiple-choice";
import { TrueFalse } from "@/components/lesson/exercise-types/true-false";
import { VictoryAnimation } from "@/components/lesson/victory-animation";
import { OutOfHearts } from "@/components/lesson/out-of-hearts";
import { QuitConfirmation } from "@/components/lesson/quit-confirmation";
import { useSound } from "@/hooks/use-sound";
import { useLives } from "@/context/lives";
import { useSpacedRepetition } from "@/hooks/use-spaced-repetition";
import { getLessonMascot } from "@/config/mascots";
import { router } from "expo-router";

const CURRENT_LEVEL = 1; // This lesson is Level 1
const EXERCISE_STEPS = [4, 5, 7, 9]; // Steps that are exercises

// Demo Lesson 1: What is Cryptocurrency?
export default function LessonDemo() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showVictory, setShowVictory] = useState(false);
  const [showOutOfHearts, setShowOutOfHearts] = useState(false);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);
  
  const { playCorrect, playWrong } = useSound();
  const { loseLife, lives } = useLives();
  const spacedRepetition = useSpacedRepetition(10);

  const totalSteps = 10;

  const handleNext = () => {
    // Check if we need to start review mode
    if (spacedRepetition.shouldStartReview(currentStep)) {
      spacedRepetition.startReview();
      return;
    }

    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else if (spacedRepetition.canValidateLevel()) {
      // Lesson complete!
      setShowVictory(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCorrectAnswer = () => {
    playCorrect();
    
    if (spacedRepetition.isReviewMode) {
      // Use returned values to avoid stale state issues
      const { isComplete, nextExercise } = spacedRepetition.markPassedInReview(currentStep);
      
      // Check if review is complete
      if (isComplete) {
        setShowVictory(true);
        return;
      }
      
      // Move to next review exercise
      if (nextExercise) {
        setCurrentStep(nextExercise.stepIndex);
      } else {
        setShowVictory(true);
      }
    } else {
      handleNext();
    }
  };

  const handleWrongAnswer = () => {
    playWrong();
    loseLife();
    
    // Mark for spaced repetition
    if (EXERCISE_STEPS.includes(currentStep)) {
      spacedRepetition.markFailed(currentStep);
    }
    
    if (lives <= 1) {
      // Out of lives!
      setShowOutOfHearts(true);
    }
  };

  const handleLessonComplete = () => {
    setShowVictory(false);
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
    // TODO: Navigate to subscription screen
    setShowOutOfHearts(false);
    router.push("/shop");
  };

  const handleWaitForHearts = () => {
    setShowOutOfHearts(false);
    router.push("/learn");
  };

  const renderStep = () => {
    switch (currentStep) {
      // Step 0: Mascot Introduction
      case 0:
        return (
          <LessonScreen
            type="intro"
            mascot={getLessonMascot(1, "intro")}
            mascotMessage="Hi! I'm Soli 👋 Today, we'll discover what cryptocurrency really is. Don't worry—we'll start simple and build up together!"
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );

      // Step 1: Main Explanation
      case 1:
        return (
          <LessonScreen
            type="explanation"
            title="What is Cryptocurrency?"
            content="Cryptocurrency is digital money that exists only online. Unlike dollars or euros, it's not printed by governments or banks. Instead, it uses special computer code to track who owns what."
            illustration={getLessonMascot(1, "explanation")}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );

      // Step 2: Key Takeaway
      case 2:
        return (
          <LessonScreen
            type="explanation"
            title="Key Takeaway"
            content="🔑 Cryptocurrency is digital money secured by code, not controlled by banks."
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );

      // Step 3: Real-World Example
      case 3:
        return (
          <LessonScreen
            type="explanation"
            title="Real-World Example"
            content="Imagine Alice wants to send $100 to Bob in another country. With a bank, it takes 3 days and costs $25 in fees. With cryptocurrency, Alice can send it in seconds for less than $1."
            illustration={getLessonMascot(1, "explanation")}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );

      // Step 4: Exercise 1 - Multiple Choice
      case 4:
        return (
          <LessonScreen type="exercise">
            <MultipleChoice
              question="What makes cryptocurrency different from regular money?"
              options={[
                "It's more expensive",
                "It's controlled by banks",
                "It's digital and uses code to work",
                "It can only be used online",
              ]}
              correctAnswer={2}
              onCorrect={handleCorrectAnswer}
              onWrong={handleWrongAnswer}
            />
          </LessonScreen>
        );

      // Step 5: Exercise 2 - True/False
      case 5:
        return (
          <LessonScreen type="exercise">
            <TrueFalse
              statement="Cryptocurrency is printed by governments."
              correctAnswer={false}
              onCorrect={handleCorrectAnswer}
              onWrong={handleWrongAnswer}
            />
          </LessonScreen>
        );

      // Step 6: Explanation after exercise
      case 6:
        return (
          <LessonScreen
            type="explanation"
            content="Crypto is created by computer code, not printed by anyone. That's what makes it decentralized!"
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );

      // Step 7: Exercise 3 - Multiple Choice
      case 7:
        return (
          <LessonScreen type="exercise">
            <MultipleChoice
              question="The first cryptocurrency ever created was _______ in 2009."
              options={["Ethereum", "Bitcoin", "Dogecoin", "Solana"]}
              correctAnswer={1}
              onCorrect={handleCorrectAnswer}
              onWrong={handleWrongAnswer}
            />
          </LessonScreen>
        );

      // Step 8: Practical Tip
      case 8:
        return (
          <LessonScreen
            type="explanation"
            title="Practical Tip"
            content="💡 You don't need to understand all the technical details to use crypto. Start by learning the basics, and the rest will make sense over time!"
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );

      // Step 9: Mini Quiz
      case 9:
        return (
          <LessonScreen type="exercise">
            <TrueFalse
              statement="Cryptocurrency is digital money."
              correctAnswer={true}
              onCorrect={handleCorrectAnswer}
              onWrong={handleWrongAnswer}
            />
          </LessonScreen>
        );

      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <LessonHeader
        currentStep={currentStep + 1}
        totalSteps={totalSteps}
        onClose={handleCloseAttempt}
        isReviewMode={spacedRepetition.isReviewMode}
      />

      {renderStep()}

      {/* Victory Animation */}
      <VictoryAnimation
        visible={showVictory}
        onClose={handleLessonComplete}
        xpEarned={10}
      />

      {/* Out of Hearts Popup */}
      <OutOfHearts
        visible={showOutOfHearts}
        currentLevel={CURRENT_LEVEL}
        onClose={() => setShowOutOfHearts(false)}
        onSubscribe={handleSubscribe}
        onWait={handleWaitForHearts}
      />

      {/* Quit Confirmation */}
      <QuitConfirmation
        visible={showQuitConfirm}
        onCancel={() => setShowQuitConfirm(false)}
        onConfirm={handleQuitConfirm}
      />
    </View>
  );
}

