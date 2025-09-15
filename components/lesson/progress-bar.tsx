import React from "react";
import { Animated } from "react-native";
import { View, Text } from "@/components/themed";
import { useTheme } from "@/context/theme";
import { layouts } from "@/constants/layouts";

interface ProgressBarProps {
  current: number;
  total: number;
  showLabel?: boolean;
}

export function ProgressBar({ 
  current, 
  total, 
  showLabel = true 
}: ProgressBarProps) {
  const { mutedForeground } = useTheme();
  
  const progress = Math.min((current / total) * 100, 100);

  return (
    <View style={{ gap: layouts.padding / 2 }}>
      {/* Progress bar container */}
      <View style={{
        height: 16,
        backgroundColor: "#3a3a3a", // Dark gray background
        borderRadius: 12,
        overflow: "hidden",
      }}>
        {/* Progress fill */}
        <View style={{
          width: `${progress}%`,
          height: "100%",
          backgroundColor: "#58CC02", // Duolingo green
          borderRadius: 12,
        }}>
          {/* Highlight effect (top shine) */}
          {progress > 0 && (
            <View style={{
              position: "absolute",
              top: 2,
              left: 8,
              right: 8,
              height: 5,
              backgroundColor: "#7FE030", // Lighter green
              borderRadius: 8,
            }} />
          )}
        </View>
      </View>
      
      {/* Label */}
      {showLabel && (
        <Text style={{
          fontSize: 12,
          color: mutedForeground,
          textAlign: "center",
        }}>
          {current} / {total}
        </Text>
      )}
    </View>
  );
}

