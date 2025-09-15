import React, { useState } from "react";
import { Pressable, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { View, Text } from "@/components/themed";
import { Icon } from "@/components/icons";
import { LivesPopup } from "@/components/home/lives-popup";
import { StreakPopup } from "@/components/home/streak-popup";
import { useUserStats } from "@/context/user-stats";
import { useLives } from "@/context/lives";
import { layouts } from "@/constants/layouts";
import { useTheme } from "@/context/theme";

interface StatItemProps {
  iconName: "fire" | "donut" | "bolt" | "heart";
  value: string | number;
  onPress?: () => void;
  highlight?: boolean;
}

function StatItem({ iconName, value, onPress, highlight }: StatItemProps) {
  const { foreground } = useTheme();
  
  // Custom colors for specific icons
  const getIconColor = () => {
    if (iconName === "fire" && highlight) return "#FF9500";
    if (iconName === "donut") return "#00D9FF";
    if (iconName === "bolt") return "#9945FF";
    if (iconName === "heart") return "#E74C3C";
    return foreground;
  };

  const getTextColor = () => {
    if (iconName === "fire" && highlight) return "#FF9500";
    if (iconName === "donut") return "#00D9FF";
    if (iconName === "bolt") return "#9945FF";
    if (iconName === "heart") return "#E74C3C";
    return foreground;
  };
  
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 6,
        backgroundColor: pressed ? "rgba(128,128,128,0.1)" : "transparent",
        borderRadius: 12,
      })}
    >
      <Icon name={iconName} size={18} color={getIconColor()} />
      <Text
        style={{
          fontSize: 15,
          fontWeight: "800",
          color: getTextColor(),
        }}
      >
        {value}
      </Text>
    </Pressable>
  );
}

export function StatsBar() {
  const { stats } = useUserStats();
  const { lives, hasUnlimitedLives } = useLives();
  const { width } = useWindowDimensions();
  const isSmall = width < 400;
  
  const [livesPopupVisible, setLivesPopupVisible] = useState(false);
  const [streakPopupVisible, setStreakPopupVisible] = useState(false);

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: isSmall ? 4 : 8,
          paddingHorizontal: layouts.padding,
          paddingVertical: layouts.padding / 2,
        }}
      >
        {/* Streak - Opens Streak Popup */}
        <StatItem
          iconName="fire"
          value={stats.streak}
          onPress={() => setStreakPopupVisible(true)}
          highlight={stats.streak > 0}
        />

        {/* Gems */}
        <StatItem
          iconName="donut"
          value={stats.gems}
          onPress={() => router.push("/shop")}
        />

        {/* XP */}
        <StatItem
          iconName="bolt"
          value={stats.totalXp}
          onPress={() => router.push("/leaderboards")}
        />

        {/* Hearts - Opens Lives Popup */}
        <StatItem
          iconName="heart"
          value={hasUnlimitedLives ? "∞" : lives}
          onPress={() => setLivesPopupVisible(true)}
        />
      </View>

      {/* Lives Popup */}
      <LivesPopup
        visible={livesPopupVisible}
        onClose={() => setLivesPopupVisible(false)}
      />

      {/* Streak Popup */}
      <StreakPopup
        visible={streakPopupVisible}
        onClose={() => setStreakPopupVisible(false)}
      />
    </>
  );
}

// Compact version for lesson header
export function StatsBarCompact() {
  const { stats } = useUserStats();
  const { lives, hasUnlimitedLives } = useLives();
  const { foreground } = useTheme();
  const [livesPopupVisible, setLivesPopupVisible] = useState(false);
  const [streakPopupVisible, setStreakPopupVisible] = useState(false);

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
        {/* Streak - Clickable */}
        <Pressable
          onPress={() => setStreakPopupVisible(true)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 3,
          }}
        >
          <Icon name="fire" size={14} color={stats.streak > 0 ? "#FF9500" : foreground} />
          <Text style={{ fontSize: 13, fontWeight: "700", color: stats.streak > 0 ? "#FF9500" : foreground }}>
            {stats.streak}
          </Text>
        </Pressable>

        {/* XP */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
          <Icon name="bolt" size={14} color="#9945FF" />
          <Text style={{ fontSize: 13, fontWeight: "700", color: "#9945FF" }}>
            {stats.totalXp}
          </Text>
        </View>

        {/* Hearts - Clickable */}
        <Pressable
          onPress={() => setLivesPopupVisible(true)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 3,
            backgroundColor: "rgba(128, 128, 128, 0.1)",
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
          }}
        >
          <Icon name="heart" size={14} color="#E74C3C" />
          <Text
            style={{
              fontSize: 13,
              fontWeight: "700",
              color: "#E74C3C",
            }}
          >
            {hasUnlimitedLives ? "∞" : lives}
          </Text>
        </Pressable>
      </View>

      {/* Lives Popup */}
      <LivesPopup
        visible={livesPopupVisible}
        onClose={() => setLivesPopupVisible(false)}
      />

      {/* Streak Popup */}
      <StreakPopup
        visible={streakPopupVisible}
        onClose={() => setStreakPopupVisible(false)}
      />
    </>
  );
}
