import React from "react";
import { Pressable, Animated } from "react-native";
import { View, Text } from "@/components/themed";
import { Image } from "expo-image";

const soliIcon = require("@/assets/mascotte/soli-happy.png");

interface LevelNodeProps {
  levelNumber: number;
  isCompleted: boolean;
  isCurrent: boolean;
  isLocked: boolean;
  onPress: () => void;
}

export function LevelNode({
  levelNumber,
  isCompleted,
  isCurrent,
  isLocked,
  onPress,
}: LevelNodeProps) {
  // Colors based on state
  const getColors = () => {
    if (isCompleted) {
      return {
        bg: "#14F195", // Solana green
        border: "#0ED47A",
        text: "#000000",
        glow: "rgba(20, 241, 149, 0.4)",
      };
    }
    if (isCurrent) {
      return {
        bg: "#9945FF", // Solana purple
        border: "#7B2FE0",
        text: "#FFFFFF",
        glow: "rgba(153, 69, 255, 0.4)",
      };
    }
    // Locked
    return {
      bg: "#2A2A2A",
      border: "#3A3A3A",
      text: "#666666",
      glow: "transparent",
    };
  };

  const colors = getColors();
  const nodeSize = 70;

  return (
    <Pressable
      onPress={isLocked ? undefined : onPress}
      disabled={isLocked}
      style={({ pressed }) => ({
        opacity: pressed && !isLocked ? 0.8 : 1,
        transform: [{ scale: pressed && !isLocked ? 0.95 : 1 }],
      })}
    >
      <View
        style={{
          width: nodeSize,
          height: nodeSize,
          borderRadius: nodeSize / 2,
          backgroundColor: colors.bg,
          borderWidth: 4,
          borderColor: colors.border,
          justifyContent: "center",
          alignItems: "center",
          // Glow effect for completed/current
          shadowColor: colors.glow,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: isCompleted || isCurrent ? 1 : 0,
          shadowRadius: 12,
          elevation: isCompleted || isCurrent ? 8 : 0,
        }}
      >
        {/* Completed ring animation effect */}
        {isCompleted && (
          <View
            style={{
              position: "absolute",
              width: nodeSize + 12,
              height: nodeSize + 12,
              borderRadius: (nodeSize + 12) / 2,
              borderWidth: 3,
              borderColor: "#14F195",
              opacity: 0.5,
            }}
          />
        )}

        {/* Star for current level */}
        {isCurrent && (
          <View
            style={{
              position: "absolute",
              top: -8,
              right: -8,
              backgroundColor: "#FFD700",
              borderRadius: 12,
              width: 24,
              height: 24,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 14 }}>⭐</Text>
          </View>
        )}

        {/* Lock icon for locked levels */}
        {isLocked ? (
          <Text style={{ fontSize: 24, opacity: 0.5 }}>🔒</Text>
        ) : isCompleted ? (
          <Text style={{ fontSize: 24 }}>✓</Text>
        ) : (
          <Text
            style={{
              fontSize: 22,
              fontWeight: "800",
              color: colors.text,
            }}
          >
            {levelNumber}
          </Text>
        )}
      </View>

      {/* Level number below */}
      <Text
        style={{
          fontSize: 12,
          fontWeight: "600",
          color: isLocked ? "#666666" : "#FFFFFF",
          textAlign: "center",
          marginTop: 6,
        }}
      >
        Level {levelNumber}
      </Text>
    </Pressable>
  );
}
