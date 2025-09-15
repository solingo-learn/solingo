import React, { useEffect, useState } from "react";
import { Modal, Pressable } from "react-native";
import { View, Text } from "@/components/themed";
import { Icon } from "@/components/icons";
import { useLives } from "@/context/lives";
import { useUserStats } from "@/context/user-stats";
import { layouts } from "@/constants/layouts";

const LIVES_COST = 50; // Cost in gems for 5 lives

interface OutOfHeartsProps {
  visible: boolean;
  currentLevel: number;
  onClose: () => void;
  onSubscribe: () => void;
  onWait: () => void;
}

export function OutOfHearts({
  visible,
  currentLevel,
  onClose,
  onSubscribe,
  onWait,
}: OutOfHeartsProps) {
  const { restoreAllLives, nextLifeIn } = useLives();
  const { stats, addGems } = useUserStats();
  const [canAfford, setCanAfford] = useState(false);

  // First 3 levels: give free hearts!
  const isBeginnerLevel = currentLevel <= 3;

  // Check if user can afford lives
  useEffect(() => {
    setCanAfford(stats.gems >= LIVES_COST);
  }, [stats.gems]);

  // Format countdown from seconds
  const formatTime = (totalSeconds: number) => {
    if (totalSeconds <= 0) return "00:00";
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleFreeHearts = () => {
    restoreAllLives();
    onClose();
  };

  const handleBuyHearts = async () => {
    if (stats.gems >= LIVES_COST) {
      // Deduct gems
      await addGems(-LIVES_COST);
      // Restore all lives
      restoreAllLives();
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          // No black overlay: keep it grey
          backgroundColor: "rgba(28, 28, 30, 0.92)",
          justifyContent: "center",
          alignItems: "center",
          padding: layouts.padding * 2,
        }}
      >
        <View
          style={{
            backgroundColor: "#1C1C1E",
            borderRadius: 24,
            padding: layouts.padding * 2,
            width: "100%",
            maxWidth: 380,
            alignItems: "center",
            gap: layouts.padding * 1.5,
            borderWidth: 1,
            borderColor: "#3A3A3C",
          }}
        >
          {/* Hearts icon */}
          <View style={{ marginBottom: 8, backgroundColor: "transparent" }}>
            <Text style={{ fontSize: 48 }}>💔</Text>
          </View>

          {/* Title */}
          <Text style={{ fontSize: 26, fontWeight: "800", textAlign: "center", color: "#FFFFFF" }}>
            {isBeginnerLevel
              ? "Keep Going! 💪"
              : "No More Hearts!"}
          </Text>

          {/* Message */}
          <Text
            style={{
              fontSize: 15,
              color: "#8E8E93",
              textAlign: "center",
              lineHeight: 22,
              paddingHorizontal: 8,
            }}
          >
            {isBeginnerLevel
              ? "Learning is hard! Here are 5 free lives to help you continue. You got this! 🦎"
              : "Wait for your hearts to refill, or use gems to get back in the game!"}
          </Text>

          {/* Actions */}
          {isBeginnerLevel ? (
            // Free hearts for first 3 levels
            <Pressable
              onPress={handleFreeHearts}
              style={({ pressed }) => ({
                width: "100%",
                paddingVertical: 16,
                backgroundColor: "#58CC02",
                borderRadius: 16,
                borderBottomWidth: 4,
                borderBottomColor: "#46A302",
                opacity: pressed ? 0.9 : 1,
              })}
            >
              <Text style={{ fontSize: 17, fontWeight: "800", color: "#FFFFFF", textAlign: "center" }}>
                Get 5 Free Lives! 🎁
              </Text>
            </Pressable>
          ) : (
            // Regular options - Wait or Buy
            <View style={{ width: "100%", gap: 12, backgroundColor: "transparent" }}>
              
              {/* Wait option with countdown */}
              <View
                style={{
                  width: "100%",
                  padding: 16,
                  backgroundColor: "#2C2C2E",
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: "#3A3A3C",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "transparent" }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "transparent" }}>
                    <Text style={{ fontSize: 28 }}>⏱️</Text>
                    <View style={{ backgroundColor: "transparent" }}>
                      <Text style={{ fontSize: 14, fontWeight: "600", color: "#8E8E93" }}>
                        Next heart in
                      </Text>
                      <Text style={{ fontSize: 26, fontWeight: "800", color: "#14F195" }}>
                        {formatTime(nextLifeIn)}
                      </Text>
                    </View>
                  </View>
                  <Pressable
                    onPress={onWait}
                    style={({ pressed }) => ({
                      paddingVertical: 10,
                      paddingHorizontal: 20,
                      backgroundColor: pressed ? "rgba(20, 241, 149, 0.1)" : "transparent",
                      borderRadius: 12,
                      borderWidth: 2,
                      borderColor: "#14F195",
                    })}
                  >
                    <Text style={{ fontSize: 14, fontWeight: "700", color: "#14F195" }}>
                      Wait
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* Separator */}
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 4, backgroundColor: "transparent" }}>
                <View style={{ flex: 1, height: 1, backgroundColor: "#3A3A3C" }} />
                <Text style={{ fontSize: 13, color: "#8E8E93" }}>or</Text>
                <View style={{ flex: 1, height: 1, backgroundColor: "#3A3A3C" }} />
              </View>

              {/* Buy option */}
              <Pressable
                onPress={handleBuyHearts}
                disabled={!canAfford}
                style={({ pressed }) => ({
                  width: "100%",
                  paddingVertical: 16,
                  backgroundColor: canAfford ? "#9945FF" : "#3A3A3C",
                  borderRadius: 16,
                  borderBottomWidth: 4,
                  borderBottomColor: canAfford ? "#7B35D9" : "#2C2C2E",
                  opacity: pressed && canAfford ? 0.9 : 1,
                })}
              >
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "transparent" }}>
                  <Text style={{ fontSize: 17, fontWeight: "800", color: "#FFFFFF" }}>
                    Get 5 Lives
                  </Text>
                  <View style={{ 
                    flexDirection: "row", 
                    alignItems: "center", 
                    gap: 4, 
                    backgroundColor: "rgba(255,255,255,0.15)", 
                    paddingHorizontal: 10, 
                    paddingVertical: 4, 
                    borderRadius: 12 
                  }}>
                    <Icon name="donut" size={18} color="#00D9FF" />
                    <Text style={{ fontSize: 15, fontWeight: "700", color: "#FFFFFF" }}>
                      {LIVES_COST}
                    </Text>
                  </View>
                </View>
              </Pressable>

              {/* Current gems display */}
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 4, backgroundColor: "transparent" }}>
                <Text style={{ fontSize: 13, color: "#8E8E93" }}>You have</Text>
                <Icon name="donut" size={16} color="#00D9FF" />
                <Text style={{ fontSize: 14, fontWeight: "700", color: canAfford ? "#14F195" : "#E74C3C" }}>
                  {stats.gems}
                </Text>
                {!canAfford && (
                  <Text style={{ fontSize: 13, color: "#E74C3C" }}>(need {LIVES_COST - stats.gems} more)</Text>
                )}
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}
