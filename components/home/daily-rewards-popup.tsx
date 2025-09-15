import { useState, useEffect } from "react";
import { Modal, Pressable } from "react-native";
import { Image } from "expo-image";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

import { Text, View } from "@/components/themed";
import { layouts } from "@/constants/layouts";
import { useUserStats } from "@/context/user-stats";

const soliHappyIcon = require("@/assets/mascotte/soli-happy.png");

// Daily rewards configuration
const dailyRewards = [
  { day: 1, type: "chest", label: "Mystery Box", icon: "🎁", gems: 10 },
  { day: 2, type: "gems", label: "50 Gems", icon: "💎", gems: 50 },
  { day: 3, type: "avatar", label: "New Avatar", icon: "🦎", gems: 0 },
  { day: 4, type: "gems", label: "100 Gems", icon: "💎", gems: 100 },
  { day: 5, type: "gems", label: "150 Gems", icon: "💎", gems: 150 },
  { day: 6, type: "gems", label: "200 Gems", icon: "💎", gems: 200 },
  { day: 7, type: "special", label: "Super Reward", icon: "👑", gems: 500 },
];

interface DailyRewardsPopupProps {
  visible: boolean;
  onClose: () => void;
}

export function DailyRewardsPopup({ visible, onClose }: DailyRewardsPopupProps) {
  const { addGems } = useUserStats();
  const [currentStreak, setCurrentStreak] = useState(1);
  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    const loadStreak = async () => {
      try {
        const streak = await AsyncStorage.getItem("daily_reward_streak");
        if (streak) {
          setCurrentStreak(parseInt(streak, 10));
        }
      } catch (error) {
        console.log("Error loading streak:", error);
      }
    };
    loadStreak();
  }, []);

  const handleClaim = async () => {
    const reward = dailyRewards[(currentStreak - 1) % 7];
    
    // Add gems if applicable
    if (reward.gems > 0) {
      addGems(reward.gems);
    }

    // Update streak
    const newStreak = currentStreak >= 7 ? 1 : currentStreak + 1;
    setCurrentStreak(newStreak);
    await AsyncStorage.setItem("daily_reward_streak", newStreak.toString());
    await AsyncStorage.setItem("last_daily_claim", new Date().toDateString());

    setClaimed(true);
    setTimeout(() => {
      onClose();
      setClaimed(false);
    }, 1000);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          justifyContent: "flex-end",
        }}
      >
        {/* Top decoration area */}
        <View
          style={{
            height: 200,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "transparent",
          }}
        >
          {/* Checkmark circle */}
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: "#9945FF",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Ionicons name="checkmark" size={40} color="#FFFFFF" />
          </View>

          {/* Mascot */}
          <Image
            source={soliHappyIcon}
            style={{ width: 100, height: 100 }}
            contentFit="contain"
          />
        </View>

        {/* Content Card */}
        <View
          style={{
            backgroundColor: "#1A1A1A",
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
            padding: layouts.padding * 1.5,
            paddingBottom: 40,
          }}
        >
          {/* Title */}
          <Text
            style={{
              fontSize: 24,
              fontWeight: "800",
              color: "#FFFFFF",
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            Get rewards by coming{"\n"}back every day!
          </Text>

          {/* Rewards Grid */}
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              backgroundColor: "transparent",
              gap: 10,
              marginTop: 20,
              marginBottom: 24,
            }}
          >
            {/* Days 1-3 */}
            <View style={{ flexDirection: "row", gap: 10, width: "100%", backgroundColor: "transparent" }}>
              {dailyRewards.slice(0, 3).map((reward, index) => {
                const isActive = currentStreak === reward.day;
                const isPast = currentStreak > reward.day;

                return (
                  <View
                    key={reward.day}
                    style={{
                      flex: 1,
                      backgroundColor: isActive ? "#2A2A4A" : "#252525",
                      borderRadius: 12,
                      padding: 12,
                      alignItems: "center",
                      borderWidth: isActive ? 2 : 0,
                      borderColor: "#9945FF",
                      opacity: isPast ? 0.5 : 1,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "600",
                        color: isActive ? "#9945FF" : "#888888",
                        marginBottom: 6,
                      }}
                    >
                      Day {reward.day}
                    </Text>
                    <Text
                      style={{
                        fontSize: 11,
                        color: "#FFFFFF",
                        marginBottom: 8,
                        textAlign: "center",
                      }}
                    >
                      {reward.label}
                    </Text>
                    <Text style={{ fontSize: 28 }}>{reward.icon}</Text>
                    {isPast && (
                      <View
                        style={{
                          position: "absolute",
                          top: 4,
                          right: 4,
                          backgroundColor: "transparent",
                        }}
                      >
                        <Ionicons name="checkmark-circle" size={18} color="#14F195" />
                      </View>
                    )}
                  </View>
                );
              })}
            </View>

            {/* Days 4-6 */}
            <View style={{ flexDirection: "row", gap: 10, width: "100%", backgroundColor: "transparent" }}>
              {dailyRewards.slice(3, 6).map((reward) => {
                const isActive = currentStreak === reward.day;
                const isPast = currentStreak > reward.day;

                return (
                  <View
                    key={reward.day}
                    style={{
                      flex: 1,
                      backgroundColor: isActive ? "#2A2A4A" : "#252525",
                      borderRadius: 12,
                      padding: 12,
                      alignItems: "center",
                      borderWidth: isActive ? 2 : 0,
                      borderColor: "#9945FF",
                      opacity: isPast ? 0.5 : 1,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "600",
                        color: isActive ? "#9945FF" : "#888888",
                        marginBottom: 6,
                      }}
                    >
                      Day {reward.day}
                    </Text>
                    <Text
                      style={{
                        fontSize: 11,
                        color: "#FFFFFF",
                        marginBottom: 8,
                        textAlign: "center",
                      }}
                    >
                      {reward.label}
                    </Text>
                    <Text style={{ fontSize: 28 }}>{reward.icon}</Text>
                    {isPast && (
                      <View
                        style={{
                          position: "absolute",
                          top: 4,
                          right: 4,
                          backgroundColor: "transparent",
                        }}
                      >
                        <Ionicons name="checkmark-circle" size={18} color="#14F195" />
                      </View>
                    )}
                  </View>
                );
              })}
            </View>

            {/* Day 7 - Special */}
            <View
              style={{
                width: "100%",
                backgroundColor: currentStreak === 7 ? "#2A2A4A" : "#252525",
                borderRadius: 12,
                padding: 16,
                flexDirection: "row",
                alignItems: "center",
                borderWidth: currentStreak === 7 ? 2 : 0,
                borderColor: "#9945FF",
              }}
            >
              <View style={{ flex: 1, backgroundColor: "transparent" }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: currentStreak === 7 ? "#9945FF" : "#888888",
                    marginBottom: 4,
                  }}
                >
                  Day 7
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "700",
                    color: "#FFFFFF",
                  }}
                >
                  Super Solingo Reward:{"\n"}500 Gems + Mystery Box!
                </Text>
              </View>
              <Text style={{ fontSize: 48 }}>👑</Text>
            </View>
          </View>

          {/* Claim Button */}
          <Pressable
            onPress={handleClaim}
            disabled={claimed}
            style={({ pressed }) => ({
              backgroundColor: claimed ? "#14F195" : "#9945FF",
              paddingVertical: 18,
              borderRadius: 16,
              alignItems: "center",
              opacity: pressed ? 0.9 : 1,
            })}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "800",
                color: "#FFFFFF",
              }}
            >
              {claimed ? "Claimed! ✓" : "Claim Reward"}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

// Hook to check if daily reward should be shown
export function useDailyReward() {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    const checkDailyReward = async () => {
      try {
        const lastClaim = await AsyncStorage.getItem("last_daily_claim");
        const today = new Date().toDateString();

        if (lastClaim !== today) {
          // Show popup after a short delay
          setTimeout(() => setShouldShow(true), 1500);
        }
      } catch (error) {
        console.log("Error checking daily reward:", error);
      }
    };

    checkDailyReward();
  }, []);

  const dismissPopup = () => setShouldShow(false);

  return { shouldShow, dismissPopup };
}
