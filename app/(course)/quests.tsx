import { useState, useEffect } from "react";
import { ScrollView, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Text, View } from "@/components/themed";
import { useTheme } from "@/context/theme";
import { Icon, IconName } from "@/components/icons";

const soliHappyImage = require("@/assets/mascotte/soli-happy.png");
const chestImage = require("@/assets/mascotte/crypto-coins.png");

// Quest types
interface Quest {
  id: string;
  title: string;
  description: string;
  iconName: IconName;
  iconColor: string;
  target: number;
  progress: number;
  reward: number;
  rewardType: "xp" | "gems";
  isCompleted: boolean;
  isClaimed: boolean;
}

// Default daily quests
const defaultQuests: Quest[] = [
  {
    id: "earn_xp",
    title: "Earn 10 XP",
    description: "Complete lessons to earn XP",
    iconName: "bolt",
    iconColor: "#FFD700",
    target: 10,
    progress: 0,
    reward: 5,
    rewardType: "gems",
    isCompleted: false,
    isClaimed: false,
  },
  {
    id: "complete_lesson",
    title: "Complete 1 Lesson",
    description: "Finish any lesson",
    iconName: "fire",
    iconColor: "#FF6B35",
    target: 1,
    progress: 0,
    reward: 10,
    rewardType: "xp",
    isCompleted: false,
    isClaimed: false,
  },
  {
    id: "perfect_lesson",
    title: "Perfect Score",
    description: "Complete a lesson without mistakes",
    iconName: "donut",
    iconColor: "#00D9FF",
    target: 1,
    progress: 0,
    reward: 15,
    rewardType: "gems",
    isCompleted: false,
    isClaimed: false,
  },
];

// Badges data
interface Badge {
  id: string;
  title: string;
  description: string;
  iconName: IconName;
  iconColor: string;
  isUnlocked: boolean;
  progress: number;
  target: number;
}

const badges: Badge[] = [
  {
    id: "first_lesson",
    title: "First Steps",
    description: "Complete your first lesson",
    iconName: "fire",
    iconColor: "#FF9500",
    isUnlocked: false,
    progress: 0,
    target: 1,
  },
  {
    id: "streak_7",
    title: "Week Warrior",
    description: "Maintain a 7-day streak",
    iconName: "fire",
    iconColor: "#FF6B35",
    isUnlocked: false,
    progress: 0,
    target: 7,
  },
  {
    id: "xp_100",
    title: "XP Hunter",
    description: "Earn 100 XP total",
    iconName: "bolt",
    iconColor: "#FFD700",
    isUnlocked: false,
    progress: 0,
    target: 100,
  },
  {
    id: "perfect_5",
    title: "Perfectionist",
    description: "Get 5 perfect scores",
    iconName: "donut",
    iconColor: "#00D9FF",
    isUnlocked: false,
    progress: 0,
    target: 5,
  },
  {
    id: "chapter_complete",
    title: "Chapter Master",
    description: "Complete an entire chapter",
    iconName: "targetCircle",
    iconColor: "#14F195",
    isUnlocked: false,
    progress: 0,
    target: 1,
  },
  {
    id: "hearts_full",
    title: "Heart Keeper",
    description: "Keep all hearts for 3 days",
    iconName: "heart",
    iconColor: "#E74C3C",
    isUnlocked: false,
    progress: 0,
    target: 3,
  },
];

export default function Quests() {
  const { background, foreground, border, mutedForeground } = useTheme();
  const cardBg = "transparent";
  const [activeTab, setActiveTab] = useState<"quests" | "badges">("quests");
  const [quests, setQuests] = useState<Quest[]>(defaultQuests);
  const [timeRemaining, setTimeRemaining] = useState("");

  const normalizeQuestIconName = (iconName: string): IconName => {
    // Migrate from old icon names stored in AsyncStorage
    const map: Record<string, IconName> = {
      "flash-outline": "bolt",
      "star-outline": "fire",
      "diamond-outline": "donut",
      "time-outline": "fire",
      "heart-outline": "heart",
      "trophy-outline": "targetCircle",
      "flame-outline": "fire",
      "⚡": "bolt",
      "⭐": "fire",
      "💎": "donut",
      "🔥": "fire",
      "❤️": "heart",
      "🏆": "targetCircle",
    };
    if (map[iconName]) return map[iconName];
    return "bolt";
  };

  // Calculate time until midnight (quest reset)
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeRemaining(`${hours}h ${minutes}m`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, []);

  // Load quests from storage
  useEffect(() => {
    const loadQuests = async () => {
      try {
        const saved = await AsyncStorage.getItem("daily_quests");
        const savedDate = await AsyncStorage.getItem("quests_date");
        const today = new Date().toDateString();

        if (saved && savedDate === today) {
          const parsed = JSON.parse(saved) as any[];
          const migrated = parsed.map((q) => ({
            ...q,
            iconName: normalizeQuestIconName((q as any).icon ?? (q as any).iconName ?? "bolt"),
            iconColor: (q as any).iconColor ?? "#FFD700",
          }));
          setQuests(migrated as Quest[]);
          // Persist migrated format so we don't show old strings again
          await AsyncStorage.setItem("daily_quests", JSON.stringify(migrated));
        } else {
          // Reset quests for new day
          await AsyncStorage.setItem("daily_quests", JSON.stringify(defaultQuests));
          await AsyncStorage.setItem("quests_date", today);
          setQuests(defaultQuests);
        }
      } catch (e) {
        console.log("Error loading quests:", e);
      }
    };
    loadQuests();
  }, []);

  // Claim reward
  const claimReward = async (questId: string) => {
    const updatedQuests = quests.map((q) =>
      q.id === questId ? { ...q, isClaimed: true } : q
    );
    setQuests(updatedQuests);
    await AsyncStorage.setItem("daily_quests", JSON.stringify(updatedQuests));
  };

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      {/* Tab Header */}
      <View style={[styles.tabHeader, { backgroundColor: background, borderBottomColor: border }]}>
        <Pressable
          style={[
            styles.tab,
            activeTab === "quests" && [styles.activeTab, { borderBottomColor: "#14F195" }],
          ]}
          onPress={() => setActiveTab("quests")}
        >
          <Text style={[styles.tabText, { color: mutedForeground }, activeTab === "quests" && { color: "#14F195" }]}>
            QUESTS
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.tab,
            activeTab === "badges" && [styles.activeTab, { borderBottomColor: "#14F195" }],
          ]}
          onPress={() => setActiveTab("badges")}
        >
          <Text style={[styles.tabText, { color: mutedForeground }, activeTab === "badges" && { color: "#14F195" }]}>
            BADGES
          </Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={[styles.banner, { backgroundColor: cardBg, borderColor: border, borderWidth: 1 }]}>
          <View style={styles.bannerContent}>
            <Text style={[styles.bannerTitle, { color: foreground }]}>
              {activeTab === "quests" ? "Welcome!" : "Your Achievements"}
            </Text>
            <Text style={[styles.bannerSubtitle, { color: mutedForeground }]}>
              {activeTab === "quests"
                ? "Complete daily quests to earn rewards!"
                : "Collect badges as you progress!"}
            </Text>
          </View>
          <View style={styles.bannerImageContainer}>
            <Image
              source={activeTab === "quests" ? chestImage : soliHappyImage}
              style={styles.bannerImage}
              contentFit="contain"
            />
            <Image
              source={soliHappyImage}
              style={styles.mascotImage}
              contentFit="contain"
            />
          </View>
        </View>

        {/* Content */}
        <View style={[styles.content, { backgroundColor: background }]}>
          {activeTab === "quests" ? (
            <>
              {/* Daily Quests Header */}
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: foreground }]}>
                  Daily Quests
                </Text>
                <View style={styles.timerContainer}>
                  <Ionicons name="time-outline" size={18} color="#14F195" />
                  <Text style={styles.timerText}>{timeRemaining}</Text>
                </View>
              </View>

              {/* Quest Cards */}
              {quests.map((quest) => (
                <View
                  key={quest.id}
                  style={[styles.questCard, { backgroundColor: cardBg, borderColor: border }]}
                >
                  {/* Quest Icon */}
                  <View
                    style={[
                      styles.questIconContainer,
                      { backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: border },
                    ]}
                  >
                    <Icon name={quest.iconName} size={24} color={quest.iconColor} />
                  </View>

                  {/* Quest Info */}
                  <View style={styles.questInfo}>
                    <Text style={[styles.questTitle, { color: foreground }]}>
                      {quest.title}
                    </Text>
                    
                    {/* Progress Bar */}
                    <View style={styles.progressContainer}>
                      <View style={[styles.progressBar, { backgroundColor: border }]}>
                        <View
                          style={[
                            styles.progressFill,
                            {
                              backgroundColor: "#14F195",
                              width: `${Math.min((quest.progress / quest.target) * 100, 100)}%`,
                            },
                          ]}
                        />
                      </View>
                      <Text style={[styles.progressText, { color: mutedForeground }]}>
                        {quest.progress} / {quest.target}
                      </Text>
                    </View>
                  </View>

                  {/* Reward / Claim Button */}
                  {quest.isCompleted && !quest.isClaimed ? (
                    <Pressable
                      style={styles.claimButton}
                      onPress={() => claimReward(quest.id)}
                    >
                      <Text style={styles.claimButtonText}>CLAIM</Text>
                    </Pressable>
                  ) : quest.isClaimed ? (
                    <View style={styles.claimedContainer}>
                      <Ionicons name="checkmark-circle" size={28} color="#14F195" />
                    </View>
                  ) : (
                    <View style={[styles.rewardContainer, { backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: border }]}>
                      <Icon
                        name={quest.rewardType === "gems" ? "donut" : "bolt"}
                        size={16}
                        color={quest.rewardType === "gems" ? "#00D9FF" : "#FFD700"}
                      />
                      <Text style={[styles.rewardText, { color: foreground }]}>
                        +{quest.reward}
                      </Text>
                    </View>
                  )}
                </View>
              ))}

              {/* Locked Quest */}
              <View style={[styles.questCard, styles.lockedCard, { backgroundColor: cardBg, borderColor: border }]}>
                <View style={[styles.questIconContainer, { backgroundColor: "rgba(255,255,255,0.04)", borderWidth: 1, borderColor: border }]}>
                  <Ionicons name="lock-closed-outline" size={26} color={mutedForeground} />
                </View>
                <View style={styles.questInfo}>
                  <Text style={[styles.questTitle, { color: mutedForeground }]}>
                    New quests coming soon
                  </Text>
                  <Text style={[styles.lockedText, { color: mutedForeground }]}>
                    Complete current quests to unlock more
                  </Text>
                </View>
              </View>
            </>
          ) : (
            <>
              {/* Badges Grid */}
              <View style={styles.badgesGrid}>
                {badges.map((badge) => (
                  <View
                    key={badge.id}
                    style={[
                      styles.badgeCard,
                      { backgroundColor: cardBg, borderColor: border },
                      !badge.isUnlocked && styles.lockedBadge,
                    ]}
                  >
                    <View
                      style={[
                        styles.badgeIconContainer,
                        {
                          backgroundColor: badge.isUnlocked
                            ? "rgba(255,255,255,0.06)"
                            : "rgba(255,255,255,0.04)",
                          borderWidth: 1,
                          borderColor: border,
                        },
                      ]}
                    >
                      <Icon
                        name={badge.iconName}
                        size={28}
                        color={badge.isUnlocked ? badge.iconColor : "#666666"}
                      />
                    </View>
                    <Text
                      style={[
                        styles.badgeTitle,
                        { color: badge.isUnlocked ? foreground : mutedForeground },
                      ]}
                    >
                      {badge.title}
                    </Text>
                    <Text style={[styles.badgeDescription, { color: mutedForeground }]}>
                      {badge.description}
                    </Text>
                    {!badge.isUnlocked && (
                      <View style={styles.badgeProgress}>
                        <View style={[styles.badgeProgressBar, { backgroundColor: border }]}>
                          <View
                            style={[
                              styles.badgeProgressFill,
                              {
                                backgroundColor: "#14F195",
                                width: `${(badge.progress / badge.target) * 100}%`,
                              },
                            ]}
                          />
                        </View>
                        <Text style={[styles.badgeProgressText, { color: mutedForeground }]}>
                          {badge.progress}/{badge.target}
                        </Text>
                      </View>
                    )}
                    {badge.isUnlocked && (
                      <View style={styles.unlockedBadge}>
                        <Ionicons name="checkmark-circle" size={20} color="#14F195" />
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabHeader: {
    flexDirection: "row",
    paddingTop: 50,
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomWidth: 3,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "700",
  },
  banner: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 6,
  },
  bannerSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  bannerImageContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  bannerImage: {
    width: 45,
    height: 45,
    marginRight: -8,
    marginBottom: 15,
  },
  mascotImage: {
    width: 80,
    height: 80,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  timerText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#14F195",
  },
  questCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  lockedCard: {
    opacity: 0.5,
  },
  questIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  questInfo: {
    flex: 1,
  },
  questTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  progressBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 13,
    fontWeight: "600",
    minWidth: 40,
  },
  rewardContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  rewardText: {
    fontSize: 13,
    fontWeight: "700",
  },
  claimButton: {
    backgroundColor: "#14F195",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  claimButtonText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#1A1A1A",
  },
  claimedContainer: {
    paddingHorizontal: 10,
  },
  lockedText: {
    fontSize: 12,
    marginTop: 2,
  },
  badgesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 10,
  },
  badgeCard: {
    width: "48%",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
  },
  lockedBadge: {
    opacity: 0.6,
  },
  badgeIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  badgeTitle: {
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 4,
  },
  badgeDescription: {
    fontSize: 11,
    textAlign: "center",
    lineHeight: 15,
  },
  badgeProgress: {
    width: "100%",
    marginTop: 10,
    alignItems: "center",
  },
  badgeProgressBar: {
    width: "100%",
    height: 5,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 4,
  },
  badgeProgressFill: {
    height: "100%",
    borderRadius: 3,
  },
  badgeProgressText: {
    fontSize: 10,
    fontWeight: "600",
  },
  unlockedBadge: {
    position: "absolute",
    top: 8,
    right: 8,
  },
});
