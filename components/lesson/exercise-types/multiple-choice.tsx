import React, { useRef, useState } from "react";
import { Pressable, ScrollView, useWindowDimensions } from "react-native";
import { View, Text } from "@/components/themed";
import { CheckButton } from "@/components/ui/check-button";
import { Image } from "expo-image";
import { useTheme } from "@/context/theme";
import { layouts } from "@/constants/layouts";
import { themeColors } from "@/constants/colors";

interface MultipleChoiceProps {
  question: string;
  options: string[];
  correctAnswer: number;
  illustration?: any;
  hint?: string;
  explanation?: string;
  onCorrect: () => void;
  onWrong: () => void;
}

export function MultipleChoice({
  question,
  options,
  correctAnswer,
  illustration,
  hint,
  explanation,
  onCorrect,
  onWrong,
}: MultipleChoiceProps) {
  const { border, mutedForeground } = useTheme();
  const { width, height } = useWindowDimensions();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const didContinueRef = useRef(false);

  // Responsive
  const isDesktop = width > 768;
  const maxContentWidth = isDesktop ? 480 : width;
  const imageHeight = isDesktop ? 180 : 150;

  const isCorrectAnswer = selectedIndex === correctAnswer;

  const handleSubmit = () => {
    if (selectedIndex === null) return;
    didContinueRef.current = false;
    setSubmitted(true);
  };

  const handleContinue = () => {
    // Prevent multiple calls to onCorrect/onWrong (losing multiple lives)
    if (didContinueRef.current) return;
    didContinueRef.current = true;

    if (isCorrectAnswer) {
      onCorrect();
    } else {
      onWrong();
      // If we stay on the same exercise (e.g. review queue has only this one),
      // reset local state so the user can retry instead of being stuck on a disabled CONTINUE.
      setSubmitted(false);
      setSelectedIndex(null);
      didContinueRef.current = false;
    }
  };

  const getOptionStyle = (index: number) => {
    const isSelected = selectedIndex === index;
    const isCorrect = index === correctAnswer;
    const isWrongSelected = isSelected && index !== correctAnswer;

    if (!submitted) {
      return {
        borderColor: isSelected ? "#9945FF" : "rgba(255, 255, 255, 0.2)",
        backgroundColor: isSelected ? "rgba(153, 69, 255, 0.15)" : "rgba(255, 255, 255, 0.05)",
        shadowColor: isSelected ? "#9945FF" : "transparent",
      };
    }

    if (isCorrect) {
      return {
        borderColor: "#58CC02",
        backgroundColor: "rgba(88, 204, 2, 0.2)",
        shadowColor: "#58CC02",
      };
    }

    if (isWrongSelected) {
      return {
        borderColor: "#E74C3C",
        backgroundColor: "rgba(231, 76, 60, 0.2)",
        shadowColor: "#E74C3C",
      };
    }

    return {
      borderColor: "rgba(255, 255, 255, 0.1)",
      backgroundColor: "rgba(255, 255, 255, 0.02)",
      shadowColor: "transparent",
    };
  };

  return (
    <View 
      style={{ 
        flex: 1, 
        backgroundColor: themeColors.dark.background,
      }}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ 
          flexGrow: 1,
          maxWidth: maxContentWidth,
          alignSelf: "center",
          width: "100%",
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Image Section - Pure Black */}
        {illustration && (
          <View
            style={{
              width: "100%",
              height: imageHeight,
              backgroundColor: "#000000",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: layouts.padding,
            }}
          >
            <Image
              source={illustration}
              contentFit="contain"
              style={{
                width: isDesktop ? 160 : 130,
                height: isDesktop ? 160 : 130,
              }}
            />
          </View>
        )}

        {/* Content */}
        <View
          style={{
            flex: 1,
            padding: layouts.padding * 1.5,
            gap: layouts.padding * 1.5,
          }}
        >
          {/* Tag */}
          <View
            style={{
              alignSelf: "flex-start",
              backgroundColor: "#3498DB",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 6,
            }}
          >
            <Text
              style={{
                fontSize: 11,
                fontWeight: "800",
                color: "#FFFFFF",
                letterSpacing: 1,
              }}
            >
              QUIZ
            </Text>
          </View>

          {/* Question */}
          <Text 
            style={{ 
              fontSize: isDesktop ? 24 : 20, 
              fontWeight: "800",
              color: "#FFFFFF",
              lineHeight: isDesktop ? 32 : 28,
            }}
          >
            {question}
          </Text>

          {/* Hint */}
          {hint && (
            <Text
              style={{
                fontSize: 14,
                color: mutedForeground,
                fontStyle: "italic",
              }}
            >
              {hint}
            </Text>
          )}

          {/* Options - Finelo Style Cards */}
          <View style={{ gap: 12, marginTop: layouts.padding }}>
            {options.map((option, index) => {
              const style = getOptionStyle(index);
              const isSelected = selectedIndex === index;

              return (
                <Pressable
                  key={index}
                  onPress={() => !submitted && setSelectedIndex(index)}
                  disabled={submitted}
                  style={({ pressed }) => ({
                    opacity: pressed && !submitted ? 0.8 : 1,
                    transform: [{ scale: pressed && !submitted ? 0.98 : 1 }],
                  })}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      padding: 16,
                      borderRadius: 16,
                      borderWidth: 2,
                      borderColor: style.borderColor,
                      backgroundColor: style.backgroundColor,
                      shadowColor: style.shadowColor,
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.3,
                      shadowRadius: 4,
                      elevation: isSelected ? 4 : 0,
                    }}
                  >
                    {/* Selection indicator */}
                    <View
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        borderWidth: 2,
                        borderColor: isSelected ? style.borderColor : "rgba(255, 255, 255, 0.3)",
                        backgroundColor: isSelected ? style.borderColor : "transparent",
                        marginRight: 14,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {isSelected && (
                        <View
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: "#FFFFFF",
                          }}
                        />
                      )}
                    </View>

                    {/* Option text */}
                    <Text 
                      style={{ 
                        flex: 1,
                        fontSize: 16, 
                        fontWeight: "600",
                        color: "#FFFFFF",
                      }}
                    >
                      {option}
                    </Text>

                    {/* Correct/Wrong indicator after submit */}
                    {submitted && index === correctAnswer && (
                      <Text style={{ fontSize: 20 }}>✓</Text>
                    )}
                    {submitted && selectedIndex === index && index !== correctAnswer && (
                      <Text style={{ fontSize: 20 }}>✗</Text>
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Check Button - Fixed */}
      <View
        style={{
          padding: layouts.padding * 1.5,
          paddingBottom: layouts.padding * 2,
          backgroundColor: themeColors.dark.background,
          borderTopWidth: 1,
          borderTopColor: "rgba(255, 255, 255, 0.1)",
          alignItems: "center",
        }}
      >
        <View style={{ width: "100%", maxWidth: maxContentWidth }}>
          {/* Result feedback banner */}
          {submitted && (
            <View
              style={{
                // No black behind the feedback: use grey card + colored border
                backgroundColor: "#2C2C2E",
                borderWidth: 1,
                borderColor: isCorrectAnswer ? "rgba(88, 204, 2, 0.5)" : "rgba(231, 76, 60, 0.5)",
                borderRadius: 12,
                padding: 12,
                marginBottom: 12,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "transparent" }}>
                <Text style={{ fontSize: 24 }}>
                  {isCorrectAnswer ? "🎉" : "😕"}
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: isCorrectAnswer ? "#58CC02" : "#E74C3C",
                  }}
                >
                  {isCorrectAnswer ? "Great job!" : "Not quite right..."}
                </Text>
              </View>
              {/* Show explanation when wrong */}
              {!isCorrectAnswer && (
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.8)",
                    marginTop: 8,
                    lineHeight: 20,
                  }}
                >
                  {explanation || `The correct answer is: ${options[correctAnswer]}`}
                </Text>
              )}
            </View>
          )}
          
          <CheckButton
            onPress={submitted ? handleContinue : handleSubmit}
            // When submitted, CONTINUE must always be pressable
            disabled={submitted ? false : selectedIndex === null}
            label={submitted ? "CONTINUE" : "CHECK"}
            variant={submitted ? "continue" : "check"}
          />
        </View>
      </View>
    </View>
  );
}
