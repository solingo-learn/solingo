import React from "react";
import { Modal, Pressable, StyleSheet, ScrollView, Linking, Platform } from "react-native";
import { Image } from "expo-image";
import { View, Text } from "@/components/themed";
import { useLives } from "@/context/lives";
import { useTheme } from "@/context/theme";
import { Ionicons } from "@expo/vector-icons";

const soliSadImage = require("@/assets/mascotte/soli-sad.png");
const soliHappyImage = require("@/assets/mascotte/soli-happy.png");

// Tweet text for sharing
const TWEET_TEXT = `I'm learning about the Solana blockchain with @learnsolana! 🚀💜

CA: BygYYihmnVcmmAM6xfnaKPoApiaTaHAt3diEhS5upump

Join me on this crypto journey! 🦎`;
const TWEET_URL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(TWEET_TEXT)}`;

interface LivesPopupProps {
  visible: boolean;
  onClose: () => void;
}

export function LivesPopup({ visible, onClose }: LivesPopupProps) {
  const { lives, maxLives, hasUnlimitedLives, unlimitedExpiresAt, nextLifeIn, enableUnlimitedLives } = useLives();
  const { background, foreground, card, border, mutedForeground } = useTheme();

  const isFull = lives >= maxLives;
  const mascotImage = isFull || hasUnlimitedLives ? soliHappyImage : soliSadImage;

  // Format time until next life
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Format remaining unlimited time
  const formatUnlimitedRemaining = () => {
    if (!unlimitedExpiresAt) return "";
    const remaining = unlimitedExpiresAt - Date.now();
    const days = Math.floor(remaining / (24 * 60 * 60 * 1000));
    const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    if (days > 0) return `${days}d ${hours}h remaining`;
    return `${hours}h remaining`;
  };

  // Handle share to X (Twitter)
  const handleShareToX = async () => {
    try {
      // Give 3 days of unlimited lives
      await enableUnlimitedLives(3);
      
      // Open Twitter intent
      if (Platform.OS === "web") {
        window.open(TWEET_URL, "_blank");
      } else {
        await Linking.openURL(TWEET_URL);
      }
      
      onClose();
    } catch (error) {
      console.error("Error sharing to X:", error);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={{ flex: 1, backgroundColor: "transparent" }} />
      </Pressable>

      {/* Bottom Sheet */}
      <View style={[styles.bottomSheet, { backgroundColor: background }]}>
        {/* Handle */}
        <View style={[styles.handle, { backgroundColor: border }]} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {/* Mascot */}
          <Image
            source={mascotImage}
            contentFit="contain"
            style={styles.mascot}
          />

          {/* Title */}
          <Text style={[styles.title, { color: foreground }]}>
            {hasUnlimitedLives
              ? "Unlimited Hearts!"
              : isFull
              ? "Hearts Full!"
              : "Low on Hearts"}
          </Text>

          {/* Hearts Display */}
          <View style={[styles.heartsContainer, { backgroundColor: "transparent" }]}>
            {hasUnlimitedLives ? (
              <View style={[styles.unlimitedHeart, { backgroundColor: "transparent" }]}>
                <Ionicons name="heart" size={40} color="#E74C3C" />
                <Text style={styles.infinityText}>∞</Text>
              </View>
            ) : (
              Array.from({ length: maxLives }).map((_, index) => (
                <Ionicons
                  key={index}
                  name={index < lives ? "heart" : "heart-outline"}
                  size={32}
                  color={index < lives ? "#E74C3C" : mutedForeground}
                  style={{ marginHorizontal: 3 }}
                />
              ))
            )}
          </View>

          {/* Status Text */}
          {!hasUnlimitedLives && (
            <Text style={[styles.statusText, { color: mutedForeground }]}>
              {isFull
                ? "You have all your hearts!"
                : `${lives} of ${maxLives} hearts`}
            </Text>
          )}

          {/* Unlimited remaining time */}
          {hasUnlimitedLives && unlimitedExpiresAt && (
            <View style={[styles.timerContainer, { backgroundColor: "rgba(20, 241, 149, 0.15)" }]}>
              <Ionicons name="infinite" size={18} color="#14F195" />
              <Text style={[styles.timerText, { color: "#14F195" }]}>
                {formatUnlimitedRemaining()}
              </Text>
            </View>
          )}

          {/* Next Life Timer */}
          {!hasUnlimitedLives && !isFull && nextLifeIn > 0 && (
            <View style={[styles.timerContainer, { backgroundColor: card }]}>
              <Ionicons name="time-outline" size={18} color="#9945FF" />
              <Text style={[styles.timerText, { color: foreground }]}>
                Next heart in {formatTime(nextLifeIn)}
              </Text>
            </View>
          )}

          {/* Unlimited Hearts Offer - Only show if not already unlimited */}
          {!hasUnlimitedLives && (
            <View style={[styles.offerCard, { backgroundColor: "rgba(153, 69, 255, 0.1)", borderColor: "#9945FF" }]}>
              <View style={[styles.offerHeader, { backgroundColor: "transparent" }]}>
                <Ionicons name="heart" size={24} color="#E74C3C" />
                <Text style={[styles.offerTitle, { color: foreground }]}>Unlimited Hearts</Text>
                <Text style={styles.offerBadge}>FREE</Text>
              </View>
              <Text style={[styles.offerDescription, { color: mutedForeground }]}>
                Share Solingo on X and get 3 days of unlimited hearts!
              </Text>
              
              {/* Share to X Button */}
              <Pressable
                style={styles.shareButton}
                onPress={handleShareToX}
              >
                <Ionicons name="logo-twitter" size={20} color="#FFF" />
                <Text style={styles.shareButtonText}>Share to X</Text>
              </Pressable>
            </View>
          )}

          {/* Info Card */}
          <View style={[styles.infoCard, { backgroundColor: card }]}>
            <View style={[styles.infoCardHeader, { backgroundColor: "transparent" }]}>
              <Ionicons name="information-circle" size={20} color="#9945FF" />
              <Text style={[styles.infoCardTitle, { color: foreground }]}>How Hearts Work</Text>
            </View>
            <Text style={[styles.infoCardText, { color: mutedForeground }]}>
              You lose a heart when you answer incorrectly. Hearts regenerate one every hour.
            </Text>
          </View>

          {/* Close Button */}
          <View style={[styles.buttonsContainer, { backgroundColor: "transparent" }]}>
            <Pressable
              style={styles.closeButton}
              onPress={onClose}
            >
              <Text style={styles.closeButtonText}>
                {isFull || hasUnlimitedLives ? "Start Learning!" : "Got it"}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  bottomSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "70%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
  },
  content: {
    padding: 20,
    alignItems: "center",
  },
  mascot: {
    width: 100,
    height: 100,
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 12,
  },
  heartsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  unlimitedHeart: {
    flexDirection: "row",
    alignItems: "center",
  },
  infinityText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#14F195",
    marginLeft: 6,
  },
  statusText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 12,
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 16,
  },
  timerText: {
    fontSize: 13,
    marginLeft: 6,
    fontWeight: "600",
  },
  offerCard: {
    width: "100%",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
  },
  offerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  offerTitle: {
    fontSize: 18,
    fontWeight: "800",
    flex: 1,
  },
  offerBadge: {
    backgroundColor: "#14F195",
    color: "#000",
    fontSize: 12,
    fontWeight: "800",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: "hidden",
  },
  offerDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1DA1F2",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  shareButtonText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  infoCard: {
    width: "100%",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  infoCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  infoCardTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 6,
  },
  infoCardText: {
    fontSize: 13,
    lineHeight: 18,
  },
  buttonsContainer: {
    flexDirection: "row",
    width: "100%",
    gap: 10,
  },
  closeButton: {
    flex: 1,
    backgroundColor: "#14F195",
    paddingVertical: 14,
    borderRadius: 14,
  },
  closeButtonText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1A1A1A",
    textAlign: "center",
  },
});
