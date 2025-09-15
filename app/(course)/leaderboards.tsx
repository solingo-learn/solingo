import { useState, useEffect } from "react";
import { ScrollView, Pressable, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";

import { Metadata } from "@/components/metadata";
import { Text, View } from "@/components/themed";
import { layouts } from "@/constants/layouts";
import { useUserStats } from "@/context/user-stats";
import { useAuth } from "@/context/auth";

// League images
const leagueImages = {
  bronze: require("@/assets/ligue/liguegrise.png"),
  silver: require("@/assets/ligue/jaune.png"),
  gold: require("@/assets/ligue/ligueverte.png"),
  ruby: require("@/assets/ligue/liguerouge.png"),
  diamond: require("@/assets/ligue/diamant.png"),
};

// Unified colors for the page
const COLORS = {
  background: "#1C1C1E",
  cardBorder: "#3A3A3C",
  textPrimary: "#FFFFFF",
  textSecondary: "#8E8E93",
};

// League data - 5 leagues with icons
const leagues = [
  { name: "Bronze League", color: "#8E8E93", minLevel: 0, image: leagueImages.bronze },
  { name: "Silver League", color: "#FFD700", minLevel: 5, image: leagueImages.silver },
  { name: "Gold League", color: "#14F195", minLevel: 10, image: leagueImages.gold },
  { name: "Ruby League", color: "#E74C3C", minLevel: 15, image: leagueImages.ruby },
  { name: "Diamond League", color: "#B9F2FF", minLevel: 20, image: leagueImages.diamond },
];

// Realistic leaderboard data - US names, some crypto-themed, XP 0-300
const mockLeaderboard = [
  { rank: 1, name: "Mike_trades", xp: 285, avatar: "📈" },
  { rank: 2, name: "Jessica R.", xp: 270, avatar: "⭐" },
  { rank: 3, name: "Brandon W.", xp: 255, avatar: "🔥" },
  { rank: 4, name: "rich_dad_42", xp: 240, avatar: "💵" },
  { rank: 5, name: "Emily Chen", xp: 225, avatar: "🌟" },
  { rank: 6, name: "Jake Miller", xp: 210, avatar: "🎯" },
  { rank: 7, name: "hodl_king", xp: 195, avatar: "💎" },
  { rank: 8, name: "Sarah K.", xp: 175, avatar: "✨" },
  { rank: 9, name: "Chris_NYC", xp: 160, avatar: "🗽" },
  { rank: 10, name: "Taylor B.", xp: 145, avatar: "🚀" },
  // Promotion zone separator will be here
  { rank: 11, name: "Daniel_tx", xp: 130, avatar: "🤠" },
  { rank: 12, name: "Amanda Lee", xp: 115, avatar: "💫" },
  { rank: 13, name: "Kevin P.", xp: 95, avatar: "⚡" },
  { rank: 14, name: "You", xp: 0, avatar: "🦎", isCurrentUser: true },
  { rank: 15, name: "newbie_2024", xp: 45, avatar: "🌱" },
  { rank: 16, name: "Maria G.", xp: 30, avatar: "🌸" },
  { rank: 17, name: "to_the_moon", xp: 20, avatar: "🌙" },
  { rank: 18, name: "Jason_LA", xp: 10, avatar: "🏄" },
];

// Avatar colors
const avatarColors = [
  "#E74C3C", "#9B59B6", "#3498DB", "#1ABC9C", "#F39C12",
  "#E91E63", "#00BCD4", "#8BC34A", "#FF5722", "#607D8B",
  "#9945FF", "#14F195", "#00D9FF", "#F1C40F", "#2ECC71"
];

export default function Leaderboards() {
  const { stats } = useUserStats();
  const { user, profile, loading } = useAuth();
  const [timeRemaining, setTimeRemaining] = useState("");

  // Rediriger vers la page d'authentification si non connecté
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth?mode=signin&redirect=leaderboards");
    }
  }, [user, loading]);

  // Afficher un loader pendant le chargement ou si non connecté
  if (loading || !user) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.background, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#9945FF" />
        <Text style={{ color: COLORS.textSecondary, marginTop: 16 }}>
          Chargement...
        </Text>
      </View>
    );
  }

  // Calculate time until end of week (Sunday midnight)
  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const endOfWeek = new Date();
      endOfWeek.setDate(now.getDate() + (7 - now.getDay()));
      endOfWeek.setHours(23, 59, 59, 999);
      
      const diff = endOfWeek.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      
      setTimeRemaining(`${hours} hours`);
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 60000);
    return () => clearInterval(interval);
  }, []);

  // Determine current league based on lessons completed
  const currentLeagueIndex = Math.min(
    Math.floor(stats.lessonsCompleted / 5),
    leagues.length - 1
  );
  const currentLeague = leagues[currentLeagueIndex];

  const currentUsername =
    profile?.display_name ||
    user?.displayName ||
    user?.email?.split("@")[0] ||
    "You";

  // Create leaderboard with user inserted at correct position based on XP
  const createLeaderboard = () => {
    // Get other players (excluding placeholder user)
    const otherPlayers = mockLeaderboard
      .filter(p => !p.isCurrentUser)
      .map(p => ({ ...p, isCurrentUser: false }));
    
    // Create user entry with actual XP
    const userEntry = {
      rank: 0, // Will be calculated
      name: currentUsername,
      xp: stats.weeklyXp,
      avatar: "🦎",
      isCurrentUser: true,
    };
    
    // Insert user at correct position based on XP
    const allPlayers = [...otherPlayers, userEntry]
      .sort((a, b) => b.xp - a.xp)
      .map((player, index) => ({
        ...player,
        rank: index + 1,
      }));
    
    return allPlayers;
  };

  const leaderboardData = createLeaderboard();

  return (
    <>
      <Metadata title="Leaderboards" description="Compete with others" />
      <View style={{ flex: 1, backgroundColor: COLORS.background }}>
        {/* Header */}
        <View
          style={{
            paddingTop: 50,
            paddingHorizontal: layouts.padding,
            paddingBottom: layouts.padding,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.cardBorder,
          }}
        >
          {/* League Title with Icon */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <Image
              source={currentLeague.image}
              style={{ width: 40, height: 40 }}
              contentFit="contain"
            />
            <Text style={{ fontSize: 24, fontWeight: "800", color: currentLeague.color }}>
              {currentLeague.name}
            </Text>
            <Pressable>
              <Ionicons name="help-circle-outline" size={24} color={COLORS.textSecondary} />
            </Pressable>
          </View>

          {/* Timer */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 8 }}>
            <Ionicons name="time-outline" size={18} color={COLORS.textSecondary} />
            <Text style={{ fontSize: 14, color: COLORS.textSecondary }}>
              Challenge ends in: {timeRemaining}
            </Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {/* League Icons Section */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 24,
              gap: 12,
            }}
          >
            {leagues.map((league, index) => {
              const isCurrentLeague = index === currentLeagueIndex;
              const isUnlocked = index <= currentLeagueIndex;
              
              return (
                <View key={league.name} style={{ alignItems: "center" }}>
                  <View
                    style={{
                      width: isCurrentLeague ? 70 : 50,
                      height: isCurrentLeague ? 70 : 50,
                      borderRadius: isCurrentLeague ? 35 : 25,
                      borderWidth: isCurrentLeague ? 3 : 2,
                      borderColor: isCurrentLeague ? league.color : COLORS.cardBorder,
                      justifyContent: "center",
                      alignItems: "center",
                      opacity: isUnlocked ? 1 : 0.4,
                    }}
                  >
                    <Image
                      source={league.image}
                      style={{ 
                        width: isCurrentLeague ? 50 : 35, 
                        height: isCurrentLeague ? 50 : 35 
                      }}
                      contentFit="contain"
                    />
                  </View>
                </View>
              );
            })}
          </View>

          {/* Leaderboard List */}
          <View style={{ paddingHorizontal: layouts.padding }}>
            {leaderboardData.map((player, index) => {
              const isInPromotionZone = player.rank <= 10;
              const showPromotionSeparator = player.rank === 11;
              const avatarColor = avatarColors[index % avatarColors.length];

              return (
                <View key={player.rank}>
                  {/* Promotion Zone Separator */}
                  {showPromotionSeparator && (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingVertical: 12,
                        paddingHorizontal: 16,
                        backgroundColor: "rgba(20, 241, 149, 0.15)",
                        marginVertical: 8,
                        borderRadius: 8,
                        // Prevent themed Views from painting a default background
                        // that can appear as a black patch behind the label.
                        // Keep the separator fully transparent except for the intended green tint.
                      }}
                    >
                      <View style={{ flex: 1, height: 2, backgroundColor: "#14F195" }} />
                      <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 12, gap: 8, backgroundColor: "transparent" }}>
                        <Ionicons name="arrow-up" size={18} color="#14F195" />
                        <Text style={{ fontSize: 14, fontWeight: "700", color: "#14F195" }}>
                          Promotion Zone
                        </Text>
                        <Ionicons name="arrow-up" size={18} color="#14F195" />
                      </View>
                      <View style={{ flex: 1, height: 2, backgroundColor: "#14F195" }} />
                    </View>
                  )}

                  {/* Player Row */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 14,
                      paddingHorizontal: 12,
                      backgroundColor: player.isCurrentUser ? "rgba(20, 241, 149, 0.1)" : "transparent",
                      borderRadius: 12,
                      marginVertical: 2,
                      borderWidth: player.isCurrentUser ? 1 : 0,
                      borderColor: "#14F195",
                    }}
                  >
                    {/* Rank */}
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "700",
                        color: isInPromotionZone ? "#14F195" : COLORS.textPrimary,
                        width: 30,
                      }}
                    >
                      {player.rank}
                    </Text>

                    {/* Avatar */}
                    <View
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 22,
                        backgroundColor: avatarColor,
                        justifyContent: "center",
                        alignItems: "center",
                        marginRight: 12,
                      }}
                    >
                      <Text style={{ fontSize: 20 }}>{player.avatar}</Text>
                    </View>

                    {/* Name */}
                    <Text
                      style={{
                        flex: 1,
                        fontSize: 16,
                        fontWeight: "600",
                        color: player.isCurrentUser ? "#14F195" : COLORS.textPrimary,
                      }}
                    >
                      {player.isCurrentUser ? player.name : player.name}
                    </Text>

                    {/* XP */}
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "700",
                        color: player.isCurrentUser ? "#14F195" : COLORS.textSecondary,
                      }}
                    >
                      {player.xp} XP
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>

          {/* League Info */}
          <View
            style={{
              margin: layouts.padding,
              padding: 20,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: COLORS.cardBorder,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "700", color: COLORS.textPrimary, marginBottom: 12 }}>
              How it works
            </Text>
            <View style={{ gap: 8 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <Ionicons name="arrow-up-circle" size={20} color="#14F195" />
                <Text style={{ fontSize: 14, color: COLORS.textSecondary, flex: 1 }}>
                  Top 10 get promoted to the next league
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <Ionicons name="remove-circle" size={20} color="#F1C40F" />
                <Text style={{ fontSize: 14, color: COLORS.textSecondary, flex: 1 }}>
                  Ranks 11-12 stay in the current league
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <Ionicons name="arrow-down-circle" size={20} color="#E74C3C" />
                <Text style={{ fontSize: 14, color: COLORS.textSecondary, flex: 1 }}>
                  Bottom 3 get demoted to the previous league
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
}
