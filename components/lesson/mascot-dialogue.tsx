import React from "react";
import { Image } from "expo-image";
import { View, Text } from "@/components/themed";
import { SpeechBubble } from "@/components/ui/speech-bubble";
import { layouts } from "@/constants/layouts";
import { useWindowDimensions } from "react-native";

interface MascotDialogueProps {
  mascot: any; // Image source
  message: string;
  size?: "small" | "medium" | "large";
  bubblePosition?: "right" | "bottom";
  darkMode?: boolean;
}

export function MascotDialogue({ 
  mascot, 
  message, 
  size = "medium",
  bubblePosition = "right",
  darkMode = true,
}: MascotDialogueProps) {
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;
  
  const mascotSize = {
    small: isDesktop ? 70 : 60,
    medium: isDesktop ? 100 : 80,
    large: isDesktop ? 140 : 120,
  }[size];

  // Colors based on dark mode
  const bubbleBg = darkMode ? "rgba(255, 255, 255, 0.95)" : "#FFFFFF";
  const textColor = "#1a1a1a";
  const borderColor = darkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.1)";

  // Horizontal layout (mascot on left, bubble on right)
  if (bubblePosition === "right") {
    return (
      <View style={{ 
        flexDirection: "row", 
        gap: layouts.padding,
        alignItems: "flex-start",
      }}>
        {/* Mascot Image */}
        <View style={{ 
          width: mascotSize, 
          height: mascotSize,
          flexShrink: 0,
        }}>
          <Image
            source={mascot}
            contentFit="contain"
            style={{ width: "100%", height: "100%" }}
          />
        </View>

        {/* Speech Bubble */}
        <View style={{ flex: 1 }}>
          <SpeechBubble
            pointDirection="left"
            backgroundColor={bubbleBg}
            borderColor={borderColor}
          >
            <Text style={{ 
              fontSize: isDesktop ? 17 : 15,
              lineHeight: isDesktop ? 26 : 24,
              color: textColor,
            }}>
              {message}
            </Text>
          </SpeechBubble>
        </View>
      </View>
    );
  }

  // Vertical layout (mascot on top, bubble below)
  return (
    <View style={{ 
      alignItems: "center",
      gap: layouts.padding,
    }}>
      {/* Mascot Image */}
      <View style={{ 
        width: mascotSize * 1.5, 
        height: mascotSize * 1.5,
      }}>
        <Image
          source={mascot}
          contentFit="contain"
          style={{ width: "100%", height: "100%" }}
        />
      </View>

      {/* Speech Bubble (no pointer for vertical) */}
      <View
        style={{
          backgroundColor: bubbleBg,
          borderRadius: 16,
          borderWidth: 2,
          borderColor,
          padding: 16,
          width: "100%",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <Text style={{ 
          fontSize: isDesktop ? 17 : 15,
          lineHeight: isDesktop ? 26 : 24,
          color: textColor,
          textAlign: "center",
        }}>
          {message}
        </Text>
      </View>
    </View>
  );
}
