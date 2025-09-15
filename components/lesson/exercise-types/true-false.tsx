import React, { useRef, useState } from "react";
import { Pressable, ScrollView, useWindowDimensions } from "react-native";
import { View, Text } from "@/components/themed";
import { CheckButton } from "@/components/ui/check-button";
import { Image } from "expo-image";
import { useTheme } from "@/context/theme";
import { layouts } from "@/constants/layouts";
import { themeColors } from "@/constants/colors";

interface TrueFalseProps {
  statement: string;
  correctAnswer: boolean;
  illustration?: any;
  explanation?: string;
  onCorrect: () => void;
  onWrong: () => void;
}

export function TrueFalse({
  statement,
  correctAnswer,
  illustration,
  explanation,
  onCorrect,
  onWrong,
}: TrueFalseProps) {
  const { border, mutedForeground } = useTheme();
  const { width, height } = useWindowDimensions();
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const didContinueRef = useRef(false);

  // Responsive
  const isDesktop = width > 768;
  const maxContentWidth = isDesktop ? 480 : width;
  const imageHeight = isDesktop ? 180 : 150;

  const isCorrectAnswer = selectedAnswer === correctAnswer;

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
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
      setSelectedAnswer(null);
      didContinueRef.current = false;
    }
  };

  const getButtonStyle = (value: boolean) => {
    const isSelected = selectedAnswer === value;
    const isCorrect = value === correctAnswer;
    const isWrongSelected = isSelected && value !== correctAnswer;

    if (!submitted) {
      return {
        borderColor: isSelected 
          ? (value ? "#14F195" : "#E74C3C") 
          : "rgba(255, 255, 255, 0.2)",
        backgroundColor: isSelected 
          ? (value ? "rgba(20, 241, 149, 0.15)" : "rgba(231, 76, 60, 0.15)") 
          : "rgba(255, 255, 255, 0.05)",
      };
    }

    if (isCorrect) {
      return {
        borderColor: "#58CC02",
        backgroundColor: "rgba(88, 204, 2, 0.2)",
      };
    }

    if (isWrongSelected) {
      return {
        borderColor: "#E74C3C",
        backgroundColor: "rgba(231, 76, 60, 0.2)",
      };
    }

    return {
      borderColor: "rgba(255, 255, 255, 0.1)",
      backgroundColor: "rgba(255, 255, 255, 0.02)",
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
              backgroundColor: "#F1C40F",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 6,
            }}
          >
            <Text
              style={{
                fontSize: 11,
                fontWeight: "800",
                color: "#000000",
                letterSpacing: 1,
              }}
            >
              TRUE OR FALSE
            </Text>
          </View>

          {/* Statement */}
          <Text 
            style={{ 
              fontSize: isDesktop ? 24 : 20, 
              fontWeight: "800",
              color: "#FFFFFF",
              lineHeight: isDesktop ? 32 : 28,
              marginTop: layouts.padding,
            }}
          >
            {statement}
          </Text>

          {/* Spacer */}
          <View style={{ flex: 1, minHeight: 20 }} />

          {/* True/False Buttons - Large and Clear */}
          <View style={{ gap: 16 }}>
            {/* TRUE Button */}
            <Pressable
              onPress={() => !submitted && setSelectedAnswer(true)}
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
                  justifyContent: "center",
                  padding: 20,
                  borderRadius: 16,
                  borderWidth: 3,
                  borderColor: getButtonStyle(true).borderColor,
                  backgroundColor: getButtonStyle(true).backgroundColor,
                  gap: 12,
                }}
              >
                <Text style={{ fontSize: 28 }}>✓</Text>
                <Text 
                  style={{ 
                    fontSize: 22, 
                    fontWeight: "800",
                    color: "#FFFFFF",
                  }}
                >
                  TRUE
                </Text>
                {submitted && correctAnswer === true && (
                  <Text style={{ fontSize: 22, marginLeft: 8 }}>✓</Text>
                )}
              </View>
            </Pressable>

            {/* FALSE Button */}
            <Pressable
              onPress={() => !submitted && setSelectedAnswer(false)}
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
                  justifyContent: "center",
                  padding: 20,
                  borderRadius: 16,
                  borderWidth: 3,
                  borderColor: getButtonStyle(false).borderColor,
                  backgroundColor: getButtonStyle(false).backgroundColor,
                  gap: 12,
                }}
              >
                <Text style={{ fontSize: 28 }}>✗</Text>
                <Text 
                  style={{ 
                    fontSize: 22, 
                    fontWeight: "800",
                    color: "#FFFFFF",
                  }}
                >
                  FALSE
                </Text>
                {submitted && correctAnswer === false && (
                  <Text style={{ fontSize: 22, marginLeft: 8 }}>✓</Text>
                )}
              </View>
            </Pressable>
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
                  {explanation || `The correct answer is ${correctAnswer ? "TRUE" : "FALSE"}.`}
                </Text>
              )}
            </View>
          )}
          
          <CheckButton
            onPress={submitted ? handleContinue : handleSubmit}
            // When submitted, CONTINUE must always be pressable
            disabled={submitted ? false : selectedAnswer === null}
            label={submitted ? "CONTINUE" : "CHECK"}
            variant={submitted ? "continue" : "check"}
          />
        </View>
      </View>
    </View>
  );
}
