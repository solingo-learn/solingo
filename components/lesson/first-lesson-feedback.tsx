import React, { useState } from "react";
import { Modal, Pressable, StyleSheet } from "react-native";
import { View, Text } from "@/components/themed";
import { Image } from "expo-image";
import { themeColors } from "@/constants/colors";
import { layouts } from "@/constants/layouts";
import AsyncStorage from "@react-native-async-storage/async-storage";

const soliHappyImage = require("@/assets/mascotte/soli-happy.png");

interface FirstLessonFeedbackProps {
  visible: boolean;
  onClose: () => void;
}

export function FirstLessonFeedback({ visible, onClose }: FirstLessonFeedbackProps) {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleRatingSelect = (rating: number) => {
    setSelectedRating(rating);
  };

  const handleSubmit = async () => {
    if (selectedRating !== null) {
      // Save that feedback was given
      await AsyncStorage.setItem("firstLessonFeedbackGiven", "true");
      await AsyncStorage.setItem("firstLessonRating", selectedRating.toString());
      setHasSubmitted(true);
      
      // Close after a short delay
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem("firstLessonFeedbackGiven", "true");
    onClose();
  };

  if (hasSubmitted) {
    return (
      <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
        <View style={styles.backdrop}>
          <View style={styles.container}>
            <Text style={styles.thankYouEmoji}>🎉</Text>
            <Text style={styles.thankYouTitle}>Thank you!</Text>
            <Text style={styles.thankYouText}>Your feedback helps us improve.</Text>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.container}>
          {/* Mascot */}
          <Image
            source={soliHappyImage}
            contentFit="contain"
            style={styles.mascot}
          />

          {/* Title */}
          <Text style={styles.title}>Your First Lesson! 🎓</Text>
          <Text style={styles.subtitle}>How was your experience?</Text>

          {/* Star Rating */}
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Pressable
                key={star}
                onPress={() => handleRatingSelect(star)}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.7 : 1,
                  transform: [{ scale: pressed ? 0.9 : 1 }],
                })}
              >
                <Text style={[
                  styles.star,
                  selectedRating !== null && star <= selectedRating && styles.starSelected
                ]}>
                  {selectedRating !== null && star <= selectedRating ? "⭐" : "☆"}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Rating Labels */}
          <View style={styles.labelsContainer}>
            <Text style={styles.labelText}>Could be better</Text>
            <Text style={styles.labelText}>Loved it!</Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttonsContainer}>
            <Pressable style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.skipButtonText}>Skip</Text>
            </Pressable>

            <Pressable
              style={[
                styles.submitButton,
                selectedRating === null && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={selectedRating === null}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// Check if feedback should be shown (first lesson completed, no feedback yet)
export async function shouldShowFirstLessonFeedback(lessonNumber: number): Promise<boolean> {
  if (lessonNumber !== 1) return false;
  
  try {
    const feedbackGiven = await AsyncStorage.getItem("firstLessonFeedbackGiven");
    return feedbackGiven !== "true";
  } catch {
    return false;
  }
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: layouts.padding * 2,
  },
  container: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: themeColors.dark.background,
    borderRadius: 24,
    padding: layouts.padding * 2,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  mascot: {
    width: 120,
    height: 120,
    marginBottom: layouts.padding,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    marginBottom: layouts.padding * 1.5,
  },
  starsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  star: {
    fontSize: 40,
    color: "rgba(255, 255, 255, 0.3)",
  },
  starSelected: {
    color: "#FFD700",
  },
  labelsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: layouts.padding * 1.5,
  },
  labelText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.5)",
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  skipButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
  },
  submitButton: {
    flex: 2,
    backgroundColor: "#58CC02",
    paddingVertical: 14,
    borderRadius: 12,
    borderBottomWidth: 4,
    borderBottomColor: "#46A302",
  },
  submitButtonDisabled: {
    backgroundColor: "rgba(88, 204, 2, 0.5)",
    borderBottomColor: "rgba(70, 163, 2, 0.5)",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
  },
  thankYouEmoji: {
    fontSize: 60,
    marginBottom: layouts.padding,
  },
  thankYouTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#58CC02",
    marginBottom: 8,
  },
  thankYouText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
  },
});
