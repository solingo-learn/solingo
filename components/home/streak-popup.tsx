import { useState, useEffect } from "react";
import { Modal, Pressable, ScrollView } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Text, View } from "@/components/themed";
import { Icon } from "@/components/icons";
import { layouts } from "@/constants/layouts";
import { useUserStats } from "@/context/user-stats";

const soliIcon = require("@/assets/mascotte/soli-happy.png");

interface StreakPopupProps {
  visible: boolean;
  onClose: () => void;
}

// Days of week labels
const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

// Streak milestones
const streakMilestones = [3, 7, 14];

export function StreakPopup({ visible, onClose }: StreakPopupProps) {
  const { stats } = useUserStats();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [activeDays, setActiveDays] = useState<string[]>([]);
  const [bestStreak, setBestStreak] = useState(0);

  // Load activity data
  useEffect(() => {
    const loadActivityData = async () => {
      try {
        const storedDays = await AsyncStorage.getItem("active_days");
        const storedBest = await AsyncStorage.getItem("best_streak");
        
        if (storedDays) {
          setActiveDays(JSON.parse(storedDays));
        }
        if (storedBest) {
          setBestStreak(parseInt(storedBest, 10));
        }
      } catch (error) {
        console.log("Error loading activity data:", error);
      }
    };
    loadActivityData();
  }, []);

  // Get calendar data
  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days: { day: number; isCurrentMonth: boolean; isToday: boolean; isActive: boolean }[] = [];

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
        isToday: false,
        isActive: false,
      });
    }

    // Current month days
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
      const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      const isToday = today.getFullYear() === year && 
                      today.getMonth() === month && 
                      today.getDate() === i;
      
      days.push({
        day: i,
        isCurrentMonth: true,
        isToday,
        isActive: activeDays.includes(dateString),
      });
    }

    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        isToday: false,
        isActive: false,
      });
    }

    return days;
  };

  const goToPrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const calendarDays = getCalendarDays();

  // Calculate current streak progress towards milestones
  const getCurrentMilestoneProgress = () => {
    const streak = stats.streak;
    for (const milestone of streakMilestones) {
      if (streak < milestone) {
        return { current: streak, target: milestone };
      }
    }
    return { current: streak, target: streakMilestones[streakMilestones.length - 1] };
  };

  const milestoneProgress = getCurrentMilestoneProgress();

  // Couleurs unifiées pour la page - une seule couleur de fond
  const COLORS = {
    background: "#1C1C1E",
    cardBorder: "#3A3A3C",
    accent: "#FF9500",
    textPrimary: "#FFFFFF",
    textSecondary: "#8E8E93",
    progressBg: "#3A3A3C",
    highlight: "#9945FF",
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: COLORS.background }}>
        {/* Header */}
        <View
          style={{
            paddingTop: 50,
            paddingHorizontal: layouts.padding,
            paddingBottom: layouts.padding,
            backgroundColor: COLORS.background,
          }}
        >
          <Pressable onPress={onClose}>
            <Ionicons name="chevron-back" size={28} color={COLORS.textPrimary} />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Streak Hero Section */}
          <View
            style={{
              paddingHorizontal: layouts.padding,
              paddingVertical: 24,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 8,
              backgroundColor: "transparent",
            }}
          >
            <View style={{ backgroundColor: "transparent" }}>
              <Text
                style={{
                  fontSize: 72,
                  fontWeight: "800",
                  color: stats.streak > 0 ? COLORS.accent : COLORS.textSecondary,
                }}
              >
                {stats.streak}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: COLORS.accent,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                Day Streak
              </Text>
            </View>

            {/* Mascot */}
            <View
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: COLORS.progressBg,
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
              }}
            >
              <Image
                source={soliIcon}
                style={{ width: 100, height: 100 }}
                contentFit="contain"
              />
            </View>
          </View>

          {/* Streak Challenge Section */}
          <View style={{ padding: layouts.padding, backgroundColor: "transparent" }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: COLORS.textPrimary,
                marginBottom: 16,
              }}
            >
              Streak Challenge
            </Text>

            <View
              style={{
                borderRadius: 16,
                padding: 20,
                borderWidth: 1,
                borderColor: COLORS.cardBorder,
                backgroundColor: "transparent",
              }}
            >
              {/* Challenge Header */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                  backgroundColor: "transparent",
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: "600", color: COLORS.textPrimary }}>
                  {milestoneProgress.target} Day Challenge
                </Text>
                <Text style={{ fontSize: 14, color: COLORS.textSecondary }}>
                  Day {stats.streak} of {milestoneProgress.target}
                </Text>
              </View>

              {/* Progress Bar with Milestones */}
              <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "transparent" }}>
                {streakMilestones.map((milestone, index) => {
                  const prevMilestone = index === 0 ? 0 : streakMilestones[index - 1];
                  const progress = Math.min(
                    Math.max((stats.streak - prevMilestone) / (milestone - prevMilestone), 0),
                    1
                  );
                  const isCompleted = stats.streak >= milestone;

                  return (
                    <View key={milestone} style={{ flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: "transparent" }}>
                      {/* Progress Line */}
                      <View
                        style={{
                          flex: 1,
                          height: 8,
                          backgroundColor: COLORS.progressBg,
                          borderRadius: 4,
                        }}
                      >
                        <View
                          style={{
                            width: `${progress * 100}%`,
                            height: "100%",
                            backgroundColor: COLORS.accent,
                            borderRadius: 4,
                          }}
                        />
                      </View>

                      {/* Milestone Box */}
                      <View
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 8,
                          backgroundColor: isCompleted ? COLORS.accent : COLORS.progressBg,
                          borderWidth: 2,
                          borderColor: isCompleted ? COLORS.accent : COLORS.cardBorder,
                          justifyContent: "center",
                          alignItems: "center",
                          marginLeft: 8,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: "700",
                            color: isCompleted ? "#000000" : COLORS.textSecondary,
                          }}
                        >
                          {milestone}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>

          {/* Calendar Section */}
          <View style={{ padding: layouts.padding, backgroundColor: "transparent" }}>
            {/* Month Navigation */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
                backgroundColor: "transparent",
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: "700", color: COLORS.textPrimary }}>
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </Text>
              <View style={{ flexDirection: "row", gap: 16, backgroundColor: "transparent" }}>
                <Pressable onPress={goToPrevMonth}>
                  <Ionicons name="chevron-back" size={24} color={COLORS.textSecondary} />
                </Pressable>
                <Pressable onPress={goToNextMonth}>
                  <Ionicons name="chevron-forward" size={24} color={COLORS.textSecondary} />
                </Pressable>
              </View>
            </View>

            {/* Streak Stats */}
            <View style={{ flexDirection: "row", gap: 12, marginBottom: 16, backgroundColor: "transparent" }}>
              <View
                style={{
                  flex: 1,
                  borderRadius: 12,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: COLORS.cardBorder,
                  backgroundColor: "transparent",
                }}
              >
                <Text style={{ fontSize: 13, color: COLORS.textSecondary, marginBottom: 4 }}>
                  My Current Streak
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "transparent" }}>
                  <Icon name="fire" size={20} color={COLORS.accent} />
                  <Text style={{ fontSize: 18, fontWeight: "700", color: COLORS.accent }}>
                    {stats.streak} days
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flex: 1,
                  borderRadius: 12,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: COLORS.cardBorder,
                  backgroundColor: "transparent",
                }}
              >
                <Text style={{ fontSize: 13, color: COLORS.textSecondary, marginBottom: 4 }}>
                  Streak Record
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "transparent" }}>
                  <Icon name="fire" size={20} color={COLORS.accent} />
                  <Text style={{ fontSize: 18, fontWeight: "700", color: COLORS.accent }}>
                    {Math.max(bestStreak, stats.streak)} days
                  </Text>
                </View>
              </View>
            </View>

            {/* Calendar Grid */}
            <View
              style={{
                borderRadius: 16,
                padding: 16,
                borderWidth: 1,
                borderColor: COLORS.cardBorder,
                backgroundColor: "transparent",
              }}
            >
              {/* Week Days Header */}
              <View style={{ flexDirection: "row", marginBottom: 12, backgroundColor: "transparent" }}>
                {weekDays.map((day, index) => (
                  <View key={index} style={{ flex: 1, alignItems: "center", backgroundColor: "transparent" }}>
                    <Text style={{ fontSize: 14, fontWeight: "600", color: COLORS.textSecondary }}>
                      {day}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Calendar Days */}
              <View style={{ flexDirection: "row", flexWrap: "wrap", backgroundColor: "transparent" }}>
                {calendarDays.map((day, index) => (
                  <View
                    key={index}
                    style={{
                      width: "14.28%",
                      aspectRatio: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "transparent",
                    }}
                  >
                    <View
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                        backgroundColor: day.isToday 
                          ? COLORS.highlight 
                          : day.isActive 
                            ? COLORS.accent 
                            : "transparent",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: day.isToday || day.isActive ? "700" : "400",
                          color: day.isCurrentMonth
                            ? day.isToday || day.isActive
                              ? COLORS.textPrimary
                              : COLORS.textPrimary
                            : COLORS.progressBg,
                        }}
                      >
                        {day.day}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Tips Section */}
          <View style={{ padding: layouts.padding, backgroundColor: "transparent" }}>
            <View
              style={{
                borderRadius: 16,
                padding: 20,
                borderWidth: 1,
                borderColor: COLORS.cardBorder,
                backgroundColor: "transparent",
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "700", color: COLORS.textPrimary, marginBottom: 12 }}>
                💡 Streak Tips
              </Text>
              <Text style={{ fontSize: 14, color: COLORS.textSecondary, lineHeight: 22 }}>
                Complete at least one lesson every day to maintain your streak. 
                Use Streak Freeze from the Shop to protect your streak if you miss a day!
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
