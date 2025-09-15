import { Modal, Pressable, useWindowDimensions } from "react-native";
import { Text, View } from "@/components/themed";

interface LevelTooltipProps {
  visible: boolean;
  title: string;
  backgroundColor: string;
  borderColor: string;
  buttonRect: { x: number; y: number; width: number; height: number };
  isLocked: boolean;
  isCompleted: boolean;
  onClose: () => void;
  onStart: () => void;
}

export function LevelTooltip({
  visible,
  title,
  backgroundColor,
  borderColor,
  buttonRect,
  isLocked,
  isCompleted,
  onClose,
  onStart,
}: LevelTooltipProps) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  // Calculate tooltip position
  const tooltipWidth = 250;
  const tooltipHeight = 140;
  
  let tooltipX = buttonRect.x + buttonRect.width / 2 - tooltipWidth / 2;
  let tooltipY = buttonRect.y - tooltipHeight - 16;

  // Keep within screen bounds
  if (tooltipX < 16) tooltipX = 16;
  if (tooltipX + tooltipWidth > screenWidth - 16) tooltipX = screenWidth - tooltipWidth - 16;
  if (tooltipY < 100) tooltipY = buttonRect.y + buttonRect.height + 16;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
        onPress={onClose}
      >
        <View
          style={{
            position: "absolute",
            left: tooltipX,
            top: tooltipY,
            width: tooltipWidth,
            backgroundColor: "#1A1A1A",
            borderRadius: 16,
            padding: 16,
            borderWidth: 2,
            borderColor: backgroundColor,
            shadowColor: backgroundColor,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          {/* Triangle pointer */}
          <View
            style={{
              position: "absolute",
              bottom: -10,
              left: tooltipWidth / 2 - 10,
              width: 0,
              height: 0,
              borderLeftWidth: 10,
              borderRightWidth: 10,
              borderTopWidth: 10,
              borderLeftColor: "transparent",
              borderRightColor: "transparent",
              borderTopColor: backgroundColor,
            }}
          />

          {/* Title */}
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: "#FFFFFF",
              textAlign: "center",
              marginBottom: 12,
            }}
          >
            {title}
          </Text>

          {/* Status */}
          <Text
            style={{
              fontSize: 13,
              color: "#888888",
              textAlign: "center",
              marginBottom: 16,
            }}
          >
            {isCompleted ? "✓ Completed" : isLocked ? "🔒 Complete previous levels first" : "Ready to learn!"}
          </Text>

          {/* Start Button */}
          {!isLocked && (
            <Pressable
              onPress={onStart}
              style={({ pressed }) => ({
                backgroundColor: backgroundColor,
                paddingVertical: 12,
                borderRadius: 12,
                borderBottomWidth: 4,
                borderBottomColor: borderColor,
                opacity: pressed ? 0.9 : 1,
              })}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "800",
                  color: "#FFFFFF",
                  textAlign: "center",
                }}
              >
                {isCompleted ? "PRACTICE" : "START"}
              </Text>
            </Pressable>
          )}
        </View>
      </Pressable>
    </Modal>
  );
}
