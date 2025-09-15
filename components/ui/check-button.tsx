import React, { useState } from "react";
import { Pressable, useWindowDimensions } from "react-native";
import { Text, View } from "@/components/themed";
import { layouts } from "@/constants/layouts";

interface CheckButtonProps {
  onPress: () => void;
  disabled?: boolean;
  label?: string;
  variant?: "check" | "continue" | "correct" | "wrong";
}

export function CheckButton({
  onPress,
  disabled = false,
  label = "CHECK",
  variant = "check",
}: CheckButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;

  const getColors = () => {
    if (disabled) {
      return {
        bg: "#3a3a3a",
        border: "#2a2a2a",
        shadow: "#252525",
        text: "#666666",
      };
    }
    
    switch (variant) {
      case "correct":
        return {
          bg: "#58CC02",
          border: "#58CC02",
          shadow: "#46A302",
          text: "#ffffff",
        };
      case "wrong":
        return {
          bg: "#E74C3C",
          border: "#E74C3C",
          shadow: "#B93D30",
          text: "#ffffff",
        };
      case "continue":
        return {
          bg: "#58CC02",
          border: "#58CC02",
          shadow: "#46A302",
          text: "#ffffff",
        };
      default: // check - Duolingo green
        return {
          bg: "#58CC02",
          border: "#58CC02",
          shadow: "#46A302",
          text: "#ffffff",
        };
    }
  };

  const colors = getColors();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={{
        width: "100%",
      }}
    >
      <View
        style={{
          height: isDesktop ? 58 : 54,
          borderRadius: 16,
          backgroundColor: colors.bg,
          borderWidth: 0,
          borderBottomWidth: isPressed ? 2 : 4,
          borderBottomColor: colors.shadow,
          justifyContent: "center",
          alignItems: "center",
          marginTop: isPressed ? 2 : 0,
          // Inner highlight effect
          shadowColor: "#FFFFFF",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: disabled ? 0 : 0.15,
          shadowRadius: 0,
        }}
      >
        {/* Inner shine effect */}
        {!disabled && (
          <View
            style={{
              position: "absolute",
              top: 3,
              left: 16,
              right: 16,
              height: 4,
              borderRadius: 4,
              backgroundColor: "rgba(255, 255, 255, 0.25)",
            }}
          />
        )}
        
        <Text
          style={{
            color: colors.text,
            fontSize: isDesktop ? 18 : 16,
            fontWeight: "800",
            textTransform: "uppercase",
            letterSpacing: 1.5,
          }}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}
