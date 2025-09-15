import React from "react";
import { Modal, Pressable, StyleSheet, Dimensions } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";

import { Text, View } from "@/components/themed";

const superSolingoImage = require("@/assets/mascotte/soli-happy.png");

const { width, height } = Dimensions.get("window");

interface PremiumFullscreenProps {
  visible: boolean;
  onClose: () => void;
  onBuyMonthly?: () => void;
  onBuyYearly?: () => void;
  onRestorePurchases?: () => void;
  monthlyPrice?: string;
  yearlyPrice?: string;
}

export function PremiumFullscreen({
  visible,
  onClose,
  onBuyMonthly,
  onBuyYearly,
  onRestorePurchases,
  monthlyPrice = "$4.99/month",
  yearlyPrice = "$29.99/year",
}: PremiumFullscreenProps) {
  const benefits = [
    { emoji: "💎", text: "Unlimited hearts, never wait" },
    { emoji: "⚡", text: "Learn faster with no interruptions" },
    { emoji: "🚫", text: "No ads, total focus" },
    { emoji: "🏆", text: "Exclusive premium badge" },
    { emoji: "📊", text: "Advanced progress tracking" },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Background Image */}
        <Image
          source={superSolingoImage}
          style={styles.backgroundImage}
          contentFit="cover"
        />

        {/* Gradient Overlay */}
        <View style={styles.gradient} />

        {/* Close Button */}
        <Pressable style={styles.closeButton} onPress={onClose}>
          <View style={styles.closeButtonBlur}>
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </View>
        </Pressable>

        {/* Bottom Content */}
        <View style={styles.bottomContent}>
          {/* Title */}
          <Text style={styles.title}>Super Solingo</Text>
          <Text style={styles.subtitle}>Unlimited Learning Experience</Text>

          {/* Benefits */}
          <View style={styles.benefitsContainer}>
            {benefits.map((benefit, index) => (
              <View key={index} style={styles.benefitRow}>
                <Text style={styles.benefitEmoji}>{benefit.emoji}</Text>
                <Text style={styles.benefitText}>{benefit.text}</Text>
              </View>
            ))}
          </View>

          {/* Monthly CTA - Solana Purple */}
          <Pressable style={[styles.ctaButton, styles.ctaPurple]} onPress={onBuyMonthly}>
            <Text style={styles.ctaText}>
              Start Premium — {monthlyPrice}
            </Text>
          </Pressable>

          {/* Yearly CTA - Solana Green */}
          <Pressable style={[styles.ctaButton, styles.ctaGreen]} onPress={onBuyYearly}>
            <View style={styles.ctaContent}>
              <Text style={styles.ctaTextDark}>
                Yearly Premium — {yearlyPrice}
              </Text>
              <View style={styles.saveBadge}>
                <Text style={styles.saveBadgeText}>SAVE 50%</Text>
              </View>
            </View>
          </Pressable>

          {/* Restore Purchases */}
          <Pressable style={styles.restoreButton} onPress={onRestorePurchases}>
            <Text style={styles.restoreText}>Restore Purchases</Text>
          </Pressable>

          {/* Terms */}
          <Text style={styles.termsText}>
            Cancel anytime. Terms & Privacy Policy apply.
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: width,
    height: height * 0.65,
  },
  gradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 16,
    zIndex: 100,
  },
  closeButtonBlur: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  bottomContent: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 40,
    backgroundColor: "transparent",
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "rgba(255,255,255,0.9)",
    marginBottom: 20,
  },
  benefitsContainer: {
    marginBottom: 24,
    backgroundColor: "transparent",
  },
  benefitRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "transparent",
  },
  benefitEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  benefitText: {
    fontSize: 15,
    fontWeight: "600",
    color: "rgba(255,255,255,0.95)",
    flex: 1,
  },
  ctaButton: {
    marginBottom: 10,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  ctaPurple: {
    backgroundColor: "#9945FF",
  },
  ctaGreen: {
    backgroundColor: "#14F195",
  },
  ctaContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "transparent",
  },
  ctaText: {
    fontSize: 17,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  ctaTextDark: {
    fontSize: 17,
    fontWeight: "800",
    color: "#000000",
  },
  saveBadge: {
    backgroundColor: "#000",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  saveBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#14F195",
  },
  restoreButton: {
    alignItems: "center",
    paddingVertical: 12,
    marginTop: 4,
  },
  restoreText: {
    fontSize: 15,
    fontWeight: "700",
    color: "rgba(255,255,255,0.8)",
  },
  termsText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
    textAlign: "center",
    marginTop: 8,
  },
});

