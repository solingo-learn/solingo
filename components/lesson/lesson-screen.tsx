import React from "react";
import { 
  Pressable, 
  ScrollView, 
  useWindowDimensions,
} from "react-native";
import { View, Text } from "@/components/themed";
import { Image } from "expo-image";
import { useTheme } from "@/context/theme";
import { layouts } from "@/constants/layouts";
import { themeColors } from "@/constants/colors";

interface LessonScreenProps {
  type: "intro" | "explanation" | "exercise" | "keyTakeaway";
  mascot?: any;
  mascotMessage?: string;
  title?: string;
  content?: string;
  illustration?: any;
  tag?: string;
  onNext?: () => void;
  onPrevious?: () => void;
  children?: React.ReactNode;
}

export function LessonScreen({
  type,
  mascot,
  mascotMessage,
  title,
  content,
  illustration,
  tag,
  onNext,
  onPrevious,
  children,
}: LessonScreenProps) {
  const { mutedForeground, background } = useTheme();
  const { width, height } = useWindowDimensions();
  
  // Responsive breakpoints
  const isDesktop = width > 768;
  const maxContentWidth = isDesktop ? 480 : width;
  const imageHeight = isDesktop ? height * 0.4 : height * 0.35;
  
  // Get tag text based on type
  const getTagText = () => {
    if (tag) return tag;
    switch (type) {
      case "intro": return "LESSON";
      case "explanation": return "EXPLANATION";
      case "keyTakeaway": return "KEY TAKEAWAY";
      case "exercise": return "EXERCISE";
      default: return "";
    }
  };
  
  // Tag colors based on type
  const getTagColors = () => {
    switch (type) {
      case "intro": return { bg: "#14F195", text: "#000000" }; // Solana green
      case "explanation": return { bg: "#9945FF", text: "#FFFFFF" }; // Solana purple
      case "keyTakeaway": return { bg: "#FF6B6B", text: "#FFFFFF" }; // Red
      case "exercise": return { bg: "#3498DB", text: "#FFFFFF" }; // Blue
      default: return { bg: "#666666", text: "#FFFFFF" };
    }
  };
  
  const tagColors = getTagColors();

  // For explanation/intro screens: tap left/right to navigate
  if (type === "intro" || type === "explanation" || type === "keyTakeaway") {
    
    const handlePress = (e: any) => {
      // Use pageX for consistent positioning across all elements
      const tapX = e.nativeEvent.pageX;
      const screenMiddle = width / 2;
      
      if (tapX < screenMiddle) {
        onPrevious && onPrevious();
      } else {
        onNext && onNext();
      }
    };
    
    return (
      <View style={{ 
        flex: 1, 
        backgroundColor: themeColors.dark.background,
        alignItems: "center",
      }}>
        <Pressable
          style={{ 
            flex: 1, 
            width: "100%",
            maxWidth: maxContentWidth,
          }}
          onPress={handlePress}
        >
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            scrollEnabled={true}
          >
            {/* Main Image Section - Pure Black Background */}
            <View
              style={{
                width: "100%",
                height: imageHeight,
                backgroundColor: "#000000", // Pure black
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
              }}
            >
              
              {/* Mascot or Illustration */}
              {mascot ? (
                <Image
                  source={mascot}
                  contentFit="contain"
                  style={{
                    width: isDesktop ? 280 : 220,
                    height: isDesktop ? 280 : 220,
                  }}
                />
              ) : illustration ? (
                <Image
                  source={illustration}
                  contentFit="contain"
                  style={{
                    width: isDesktop ? 280 : 220,
                    height: isDesktop ? 280 : 220,
                  }}
                />
              ) : null}
            </View>

            {/* Content Section */}
            <View
              style={{
                flex: 1,
                padding: layouts.padding * 1.5,
                gap: layouts.padding,
              }}
            >
              {/* Tag Badge - Finelo Style */}
              <View
                style={{
                  alignSelf: "flex-start",
                  backgroundColor: tagColors.bg,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 6,
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: "800",
                    color: tagColors.text,
                    letterSpacing: 1,
                  }}
                >
                  {getTagText()}
                </Text>
              </View>

              {/* Title */}
              {title && (
                <Text
                  style={{
                    fontSize: isDesktop ? 28 : 24,
                    fontWeight: "800",
                    color: "#FFFFFF",
                    lineHeight: isDesktop ? 36 : 32,
                  }}
                >
                  {title}
                </Text>
              )}

              {/* Mascot Message (as main text) */}
              {mascotMessage && (
                <Text
                  style={{
                    fontSize: isDesktop ? 18 : 16,
                    lineHeight: isDesktop ? 28 : 26,
                    color: "rgba(255, 255, 255, 0.85)",
                  }}
                >
                  {mascotMessage}
                </Text>
              )}

              {/* Content text */}
              {content && (
                <Text
                  style={{
                    fontSize: isDesktop ? 18 : 16,
                    lineHeight: isDesktop ? 28 : 26,
                    color: "rgba(255, 255, 255, 0.85)",
                  }}
                >
                  {content}
                </Text>
              )}

              {/* Spacer */}
              <View style={{ flex: 1, minHeight: 40 }} />

              {/* Tap hint - subtle */}
              <View 
                style={{ 
                  alignItems: "center", 
                  paddingBottom: layouts.padding,
                  opacity: 0.4,
                }}
              >
                <Text style={{ fontSize: 13, color: mutedForeground }}>
                  ← Tap left to go back • Tap right to continue →
                </Text>
              </View>
            </View>
          </ScrollView>
        </Pressable>
      </View>
    );
  }

  // For exercise screens: render children with full-screen layout
  return (
    <View 
      style={{ 
        flex: 1, 
        backgroundColor: themeColors.dark.background,
        alignItems: "center",
      }}
    >
      <View
        style={{
          flex: 1,
          width: "100%",
          maxWidth: maxContentWidth,
        }}
      >
        {children}
      </View>
    </View>
  );
}
