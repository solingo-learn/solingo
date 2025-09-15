import React from "react";
import { Pressable, useWindowDimensions, Platform } from "react-native";
import { View, Text } from "@/components/themed";
import { ProgressBar } from "./progress-bar";
import { useLives } from "@/context/lives";
import { useTheme } from "@/context/theme";
import { layouts } from "@/constants/layouts";
import { themeColors } from "@/constants/colors";
import { Icon } from "@/components/icons";

interface LessonHeaderProps {
  currentStep: number;
  totalSteps: number;
  onClose: () => void;
  isReviewMode?: boolean;
}

export function LessonHeader({ 
  currentStep, 
  totalSteps,
  onClose,
  isReviewMode = false,
}: LessonHeaderProps) {
  const { mutedForeground } = useTheme();
  const { lives, hasUnlimitedLives } = useLives();
  const { width } = useWindowDimensions();
  
  // Responsive
  const isDesktop = width > 768;
  const maxContentWidth = isDesktop ? 480 : width;
  const paddingTop = Platform.OS === "web" ? layouts.padding * 1.5 : layouts.padding * 3;

  return (
    <View style={{
      backgroundColor: themeColors.dark.background,
      paddingTop: paddingTop,
      paddingBottom: layouts.padding,
      paddingHorizontal: layouts.padding,
      alignItems: "center",
      borderBottomWidth: 1,
      borderBottomColor: "rgba(255, 255, 255, 0.05)",
    }}>
      <View style={{
        width: "100%",
        maxWidth: maxContentWidth,
        gap: layouts.padding / 2,
      }}>
        {/* Top row: Close button + Progress + Hearts */}
        <View style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: layouts.padding,
        }}>
          {/* Close button (X) - Finelo style */}
          <Pressable
            onPress={onClose}
            style={({ pressed }) => ({
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: pressed ? "rgba(255, 255, 255, 0.1)" : "transparent",
              justifyContent: "center",
              alignItems: "center",
            })}
          >
            <Text style={{ fontSize: 24, color: "rgba(255, 255, 255, 0.6)" }}>
              ✕
            </Text>
          </Pressable>

          {/* Progress bar in middle - Takes most space */}
          <View style={{ flex: 1 }}>
            <ProgressBar 
              current={currentStep} 
              total={totalSteps}
              showLabel={false}
            />
          </View>

          {/* Hearts display */}
          <View style={{ 
            flexDirection: "row", 
            alignItems: "center", 
            gap: 4,
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 14,
          }}>
            <Icon name="heart" size={18} color={hasUnlimitedLives ? "#14F195" : "#E74C3C"} />
            <Text style={{ 
              fontSize: 15, 
              fontWeight: "800", 
              color: hasUnlimitedLives ? "#14F195" : "#E74C3C",
            }}>
              {hasUnlimitedLives ? "∞" : lives}
            </Text>
          </View>
        </View>

        {/* Review mode indicator */}
        {isReviewMode && (
          <View style={{
            backgroundColor: "rgba(255, 165, 0, 0.15)",
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 8,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}>
            <Text style={{ fontSize: 16 }}>🔄</Text>
            <Text style={{ 
              fontSize: 13, 
              color: "#FFA500", 
              fontWeight: "600",
            }}>
              Review Mode - Complete these to finish!
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
