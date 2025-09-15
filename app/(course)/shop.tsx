import { useState } from "react";
import { ScrollView, Pressable, Modal, useWindowDimensions, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";

import { Metadata } from "@/components/metadata";
import { Icon } from "@/components/icons";
import { Text, View } from "@/components/themed";
import { layouts } from "@/constants/layouts";
import { useUserStats } from "@/context/user-stats";

const superSolingoImage = require("@/assets/mascotte/soli-celebrate.png");

// Shop items - using SVG icon names
const shopItems: {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  iconName: "heart" | "fire" | "bolt" | "donut";
  color: string;
}[] = [
  {
    id: "hearts_refill",
    name: "Heart Refill",
    description: "Refill all your hearts instantly",
    price: 350,
    currency: "gems",
    iconName: "heart",
    color: "#E74C3C",
  },
  {
    id: "streak_freeze",
    name: "Streak Freeze",
    description: "Protect your streak for one day",
    price: 200,
    currency: "gems",
    iconName: "fire",
    color: "#3498DB",
  },
  {
    id: "double_xp",
    name: "Double XP (1 hour)",
    description: "Earn double XP for the next hour",
    price: 500,
    currency: "gems",
    iconName: "bolt",
    color: "#9945FF",
  },
  {
    id: "timer_boost",
    name: "Timer Boost",
    description: "+10 seconds on timed challenges",
    price: 100,
    currency: "gems",
    iconName: "fire",
    color: "#14F195",
  },
];

// Premium benefits
const premiumBenefits = [
  { emoji: "📚", text: "Faster progress with unlimited practice" },
  { emoji: "⏱️", text: "No waiting: unlimited hearts" },
  { emoji: "🔕", text: "No ads, total focus" },
  { emoji: "🏆", text: "Premium badge and exclusive rewards" },
  { emoji: "🎯", text: "Priority access to new lessons" },
];

// Gem packs
const gemPacks = [
  { gems: 100, bonus: "" },
  { gems: 500, bonus: "+50 bonus" },
  { gems: 1200, bonus: "+200 bonus" },
  { gems: 3000, bonus: "+750 bonus" },
];

// Premium Fullscreen Modal Component
function PremiumFullscreen({ 
  visible, 
  onClose 
}: { 
  visible: boolean; 
  onClose: () => void;
}) {
  const { height } = useWindowDimensions();
  const showSoon = () => Alert.alert("Soon", "Premium is coming soon.");

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: "#000000" }}>
        {/* Background Image */}
        <Image
          source={superSolingoImage}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: height * 0.5,
          }}
          contentFit="cover"
        />

        {/* Gradient Overlay */}
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.3)", "rgba(0,0,0,0.7)", "rgba(0,0,0,0.95)", "#000000"]}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />

        {/* Close Button */}
        <Pressable
          onPress={onClose}
          style={{
            position: "absolute",
            top: 50,
            right: 16,
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 100,
          }}
        >
          <Ionicons name="close" size={24} color="#FFFFFF" />
        </Pressable>

        {/* Bottom Content */}
        <View
          style={{
            position: "absolute",
            left: 16,
            right: 16,
            bottom: 40,
            backgroundColor: "transparent",
          }}
        >
          {/* Title */}
          <Text
            style={{
              fontSize: 28,
              fontWeight: "800",
              color: "#FFFFFF",
              marginBottom: 8,
            }}
          >
            Unlimited Learning
          </Text>

          {/* Subtitle */}
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "rgba(255,255,255,0.9)",
              marginBottom: 4,
            }}
          >
            Unlimited hearts, never wait
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "rgba(255,255,255,0.9)",
              marginBottom: 16,
            }}
          >
            Ad-free premium access
          </Text>

          {/* Benefits */}
          <View style={{ gap: 8, marginBottom: 20, backgroundColor: "transparent" }}>
            {premiumBenefits.map((benefit, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  gap: 10,
                  backgroundColor: "transparent",
                }}
              >
                <Text style={{ fontSize: 18 }}>{benefit.emoji}</Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "rgba(255,255,255,0.9)",
                    flex: 1,
                  }}
                >
                  {benefit.text}
                </Text>
              </View>
            ))}
          </View>

          {/* Monthly CTA - Purple/Blue Gradient */}
          <Pressable
            onPress={showSoon}
            style={({ pressed }) => ({
              opacity: pressed ? 0.9 : 1,
              marginBottom: 10,
            })}
          >
            <LinearGradient
              colors={["#9945FF", "#6366F1"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                paddingVertical: 18,
                borderRadius: 14,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "800",
                  color: "#FFFFFF",
                }}
              >
                Start Premium — SOON
              </Text>
            </LinearGradient>
          </Pressable>

          {/* Yearly CTA - Green Gradient */}
          <Pressable
            onPress={showSoon}
            style={({ pressed }) => ({
              opacity: pressed ? 0.9 : 1,
              marginBottom: 10,
            })}
          >
            <LinearGradient
              colors={["#14F195", "#10B981"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                paddingVertical: 18,
                borderRadius: 14,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "800",
                  color: "#000000",
                }}
              >
                Yearly Premium — SOON
              </Text>
            </LinearGradient>
          </Pressable>

          {/* Restore Purchases */}
          <Pressable
            onPress={showSoon}
            style={{
              alignItems: "center",
              paddingVertical: 12,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "700",
                color: "#FFFFFF",
              }}
            >
              Restore Purchases (SOON)
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

// Couleurs unifiées pour la page
const COLORS = {
  background: "#1C1C1E",
  cardBorder: "#3A3A3C",
  accent: "#9945FF",
  textPrimary: "#FFFFFF",
  textSecondary: "#8E8E93",
};

export default function Shop() {
  const { stats } = useUserStats();
  const [showPremium, setShowPremium] = useState(false);
  const showSoon = () => Alert.alert("Soon", "This feature is coming soon.");

  return (
    <>
      <Metadata title="Shop" description="Get power-ups and premium" />
      <View style={{ flex: 1, backgroundColor: COLORS.background }}>
        {/* Header */}
        <View
          style={{
            paddingTop: 50,
            paddingHorizontal: layouts.padding,
            paddingBottom: layouts.padding,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.cardBorder,
            backgroundColor: "transparent",
          }}
        >
          <Text style={{ fontSize: 28, fontWeight: "800", color: COLORS.textPrimary }}>
            Shop
          </Text>
          {/* Gems balance */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 8,
              gap: 6,
              backgroundColor: "transparent",
            }}
          >
            <Icon name="donut" size={20} color="#00D9FF" />
            <Text style={{ fontSize: 18, fontWeight: "700", color: "#00D9FF" }}>
              {stats.gems}
            </Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={{ padding: layouts.padding, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
        {/* Super Solingo Premium Banner */}
        <Pressable
          onPress={() => {
            // Keep the premium page for preview, but block purchases as requested.
            setShowPremium(true);
          }}
            style={({ pressed }) => ({
              opacity: pressed ? 0.95 : 1,
              marginBottom: 24,
            })}
          >
            <View
              style={{
                borderRadius: 20,
                overflow: "hidden",
                borderWidth: 2,
                borderColor: COLORS.accent,
                backgroundColor: "transparent",
              }}
            >
              {/* Image Banner */}
              <View style={{ height: 140, overflow: "hidden", backgroundColor: "transparent" }}>
                <Image
                  source={superSolingoImage}
                  style={{ width: "100%", height: "100%" }}
                  contentFit="cover"
                />
                {/* Gradient overlay */}
                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,0.8)"]}
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 60,
                  }}
                />
              </View>

              {/* Content */}
              <View style={{ padding: 20, backgroundColor: "transparent" }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8, backgroundColor: "transparent" }}>
                  <Text style={{ fontSize: 24 }}>👑</Text>
                  <Text style={{ fontSize: 22, fontWeight: "800", color: "#FFFFFF" }}>
                    Super Solingo
                  </Text>
            </View>

                <Text style={{ fontSize: 14, color: COLORS.textSecondary, marginBottom: 16 }}>
                  Unlimited hearts • No ads • Exclusive content
                </Text>

                {/* Try Free Button */}
                <LinearGradient
                  colors={["#9945FF", "#6366F1"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    paddingVertical: 14,
                    borderRadius: 12,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "800",
                      color: "#FFFFFF",
                    }}
                  >
                    SOON
            </Text>
                </LinearGradient>
              </View>
          </View>
        </Pressable>

          {/* Power-ups Section */}
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: COLORS.textPrimary,
              marginBottom: 16,
            }}
          >
            Power-ups
          </Text>
          
          <View style={{ gap: 12, marginBottom: 32, backgroundColor: "transparent" }}>
            {shopItems.map((item) => (
              <View
                  key={item.id}
                style={{
                  borderRadius: 16,
                  padding: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: COLORS.cardBorder,
                  backgroundColor: "transparent",
                }}
                >
                  {/* Icon */}
                  <View
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 12,
                    backgroundColor: `${item.color}20`,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Icon name={item.iconName} size={28} color={item.color} />
                  </View>
                  
                  {/* Info */}
                <View style={{ flex: 1, marginLeft: 14, backgroundColor: "transparent" }}>
                  <Text style={{ fontSize: 16, fontWeight: "700", color: COLORS.textPrimary }}>
                    {item.name}
                  </Text>
                  <Text style={{ fontSize: 13, color: COLORS.textSecondary, marginTop: 2 }}>
                    {item.description}
                  </Text>
                </View>

                {/* Price Button */}
                <Pressable
                  style={({ pressed }) => ({
                    backgroundColor: stats.gems >= item.price ? "#14F195" : "#333333",
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                    opacity: pressed ? 0.9 : 1,
                  })}
                >
                  <Icon
                    name="donut"
                    size={16}
                    color={stats.gems >= item.price ? "#000000" : "#666666"}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "700",
                      color: stats.gems >= item.price ? "#000000" : "#666666",
                    }}
                  >
                      {item.price}
                    </Text>
                </Pressable>
              </View>
            ))}
        </View>

          {/* Gems Section */}
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: COLORS.textPrimary,
              marginBottom: 16,
            }}
          >
            Get Gems
          </Text>
          
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, backgroundColor: "transparent" }}>
            {gemPacks.map((pack, index) => (
              <View
                key={index}
                style={{
                  borderRadius: 16,
                  padding: 16,
                  width: "47%",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: COLORS.cardBorder,
                  backgroundColor: "transparent",
                }}
              >
                <Icon name="donut" size={34} color="#00D9FF" />
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: "800",
                    color: "#00D9FF",
                    marginTop: 8,
                  }}
                >
                  {pack.gems}
                </Text>
                {pack.bonus && (
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#14F195",
                      fontWeight: "600",
                      marginTop: 2,
                    }}
                  >
                    {pack.bonus}
                  </Text>
                )}
                <Pressable
                  onPress={showSoon}
                  style={({ pressed }) => ({
                    backgroundColor: "#9945FF",
                    paddingHorizontal: 24,
                    paddingVertical: 10,
                    borderRadius: 10,
                    marginTop: 12,
                    opacity: pressed ? 0.9 : 1,
                  })}
                >
                  <Text style={{ fontSize: 14, fontWeight: "700", color: "#FFFFFF" }}>
                  SOON
                </Text>
              </Pressable>
              </View>
            ))}
        </View>

          {/* Footer note */}
          <Text
            style={{
              fontSize: 12,
              color: COLORS.textSecondary,
              textAlign: "center",
              marginTop: 32,
            }}
          >
            Purchases coming soon.
          </Text>
        </ScrollView>
        </View>

      {/* Premium Fullscreen Modal */}
      <PremiumFullscreen
        visible={showPremium}
        onClose={() => setShowPremium(false)}
      />
    </>
  );
}
