import React from "react";
import { View, ViewStyle } from "react-native";
import { Text } from "@/components/themed";

interface SpeechBubbleProps {
  children: React.ReactNode;
  pointDirection?: "left" | "right";
  backgroundColor?: string;
  borderColor?: string;
  style?: ViewStyle;
}

export function SpeechBubble({
  children,
  pointDirection = "left",
  backgroundColor = "#FFFFFF",
  borderColor = "rgba(255, 255, 255, 0.2)",
  style,
}: SpeechBubbleProps) {
  const isLeft = pointDirection === "left";

  return (
    <View
      style={[
        {
          position: "relative",
          backgroundColor,
          borderRadius: 16,
          borderWidth: 2,
          borderColor,
          padding: 16,
          // Shadow
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        },
        style,
      ]}
    >
      {/* Triangle pointer */}
      <View
        style={{
          position: "absolute",
          [isLeft ? "left" : "right"]: -12,
          top: 20,
          width: 0,
          height: 0,
          borderTopWidth: 10,
          borderTopColor: "transparent",
          borderBottomWidth: 10,
          borderBottomColor: "transparent",
          [isLeft ? "borderRightWidth" : "borderLeftWidth"]: 12,
          [isLeft ? "borderRightColor" : "borderLeftColor"]: backgroundColor,
        }}
      />
      
      {/* Border triangle (behind the fill) */}
      <View
        style={{
          position: "absolute",
          [isLeft ? "left" : "right"]: -14,
          top: 19,
          width: 0,
          height: 0,
          borderTopWidth: 11,
          borderTopColor: "transparent",
          borderBottomWidth: 11,
          borderBottomColor: "transparent",
          [isLeft ? "borderRightWidth" : "borderLeftWidth"]: 13,
          [isLeft ? "borderRightColor" : "borderLeftColor"]: borderColor,
          zIndex: -1,
        }}
      />

      {children}
    </View>
  );
}

// Simple text bubble variant
interface TextBubbleProps {
  text: string;
  pointDirection?: "left" | "right";
  textColor?: string;
  backgroundColor?: string;
}

export function TextBubble({
  text,
  pointDirection = "left",
  textColor = "#1a1a1a",
  backgroundColor = "#FFFFFF",
}: TextBubbleProps) {
  return (
    <SpeechBubble
      pointDirection={pointDirection}
      backgroundColor={backgroundColor}
    >
      <Text
        style={{
          fontSize: 16,
          lineHeight: 24,
          color: textColor,
        }}
      >
        {text}
      </Text>
    </SpeechBubble>
  );
}

