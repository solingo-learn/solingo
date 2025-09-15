import React from "react";
import { Modal, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { View, Text } from "@/components/themed";
import { layouts } from "@/constants/layouts";

const soliSadIcon = require("@/assets/mascotte/soli-sad.png");

interface QuitConfirmationProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function QuitConfirmation({
  visible,
  onCancel,
  onConfirm,
}: QuitConfirmationProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          justifyContent: "center",
          alignItems: "center",
          padding: layouts.padding * 2,
        }}
      >
        <View
          style={{
            backgroundColor: "#1A1A1A",
            borderRadius: 24,
            padding: layouts.padding * 2,
            width: "100%",
            maxWidth: 360,
            alignItems: "center",
            gap: layouts.padding * 1.5,
            borderWidth: 1,
            borderColor: "#2A2A2A",
          }}
        >
          {/* Sad Mascot */}
          <Image
            source={soliSadIcon}
            contentFit="contain"
            style={{ width: 100, height: 100 }}
          />

          {/* Title */}
          <Text style={styles.title}>
            Wait, don't go!
          </Text>

          {/* Message */}
          <Text style={styles.message}>
            Your progress in this lesson won't be saved if you leave now.
          </Text>

          {/* Actions - Row layout */}
          <View style={styles.buttonsContainer}>
            {/* Stay Button (Keep Learning) */}
            <Pressable
              onPress={onCancel}
              style={({ pressed }) => [
                styles.button,
                styles.stayButton,
                { opacity: pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
              ]}
            >
              <Text style={styles.stayButtonText}>
                KEEP LEARNING
              </Text>
            </Pressable>

            {/* Quit Button */}
            <Pressable
              onPress={onConfirm}
              style={({ pressed }) => [
                styles.button,
                styles.quitButton,
                { opacity: pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
              ]}
            >
              <Text style={styles.quitButtonText}>
                QUIT
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    color: "#FFFFFF",
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    color: "#888888",
  },
  buttonsContainer: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
    marginTop: 8,
    backgroundColor: "transparent",
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  stayButton: {
    backgroundColor: "#14F195",
    borderBottomWidth: 4,
    borderBottomColor: "#0ED47A",
  },
  stayButtonText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#000000",
  },
  quitButton: {
    backgroundColor: "#2A2A2A",
    borderWidth: 2,
    borderColor: "#3A3A3A",
  },
  quitButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#888888",
  },
});
