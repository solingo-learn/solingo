import React, { useEffect, useState } from "react";
import { ScrollView, Pressable, Alert, Platform, ActivityIndicator, Modal, View, TextInput, Linking } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Text } from "@/components/themed";
import { Metadata } from "@/components/metadata";
import { useAuth } from "@/context/auth";
import { useLives } from "@/context/lives";
import { useUserStats } from "@/context/user-stats";
import { useCourse } from "@/context/course";
import { layouts } from "@/constants/layouts";
import { COURSE_PROGRESS_STORAGE_KEY } from "@/constants/storage-key";
import { supabase } from "@/lib/supabase";

const soliIcon = require("@/assets/mascotte/soli-happy.png");
const soliSadIcon = require("@/assets/mascotte/soli-sad.png");

// Unified colors
const COLORS = {
  background: "#1C1C1E",
  card: "#2C2C2E",
  cardBorder: "#3A3A3C",
  accent: "#9945FF",
  green: "#14F195",
  orange: "#FF9500",
  red: "#E74C3C",
  blue: "#1CB0F6",
  textPrimary: "#FFFFFF",
  textSecondary: "#8E8E93",
};

// League names based on index
const leagueNames = ["Bronze", "Silver", "Gold", "Ruby", "Diamond"];

// Delete confirmation countdown time in seconds
const DELETE_COUNTDOWN_SECONDS = 10;

// Settings modal colors (darker theme)
const SETTINGS_COLORS = {
  background: "#0A0A0A",
  card: "#151515",
  cardBorder: "#252525",
  inputBg: "#1A1A1A",
  inputBorder: "#333333",
  accent: "#9945FF",
  accentDark: "#7B35D9",
  green: "#14F195",
  red: "#E74C3C",
  textPrimary: "#FFFFFF",
  textSecondary: "#8E8E93",
  textMuted: "#636366",
};

export default function Profile() {
  const { user, profile, signOut, deleteAccount, loading, refreshProfile } = useAuth();
  const { lives, maxLives, hasUnlimitedLives } = useLives();
  const { stats, resetStats } = useUserStats();
  const { courseId, setCourseId } = useCourse();

  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteCountdown, setDeleteCountdown] = useState(DELETE_COUNTDOWN_SECONDS);
  const [isDeleting, setIsDeleting] = useState(false);

  // Settings modal state
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [settingsName, setSettingsName] = useState("");
  const [settingsEmail, setSettingsEmail] = useState("");
  const [settingsCurrentPassword, setSettingsCurrentPassword] = useState("");
  const [settingsNewPassword, setSettingsNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsError, setSettingsError] = useState("");
  const [settingsSuccess, setSettingsSuccess] = useState("");
  const [caCopied, setCaCopied] = useState(false);

  // Contract Address
  const CONTRACT_ADDRESS = "BygYYihmnVcmmAM6xfnaKPoApiaTaHAt3diEhS5upump";

  // Copy CA to clipboard
  const handleCopyCA = async () => {
    try {
      if (Platform.OS === "web" && typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(CONTRACT_ADDRESS);
        setCaCopied(true);
        setTimeout(() => setCaCopied(false), 2000);
      } else {
        // On mobile, show alert with the CA
        Alert.alert("Contract Address", CONTRACT_ADDRESS, [
          { text: "OK", style: "default" }
        ]);
      }
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  // Redirect to auth page if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth?mode=signin&redirect=profile");
    }
  }, [user, loading]);

  // Countdown timer for delete confirmation
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (showDeleteModal && deleteCountdown > 0) {
      interval = setInterval(() => {
        setDeleteCountdown((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showDeleteModal, deleteCountdown]);

  // Reset countdown when modal opens
  useEffect(() => {
    if (showDeleteModal) {
      setDeleteCountdown(DELETE_COUNTDOWN_SECONDS);
    }
  }, [showDeleteModal]);

  // Initialize settings form when modal opens
  useEffect(() => {
    if (showSettingsModal) {
      setSettingsName(profile?.display_name || user?.displayName || "");
      setSettingsEmail(user?.email || "");
      setSettingsCurrentPassword("");
      setSettingsNewPassword("");
      setSettingsError("");
      setSettingsSuccess("");
    }
  }, [showSettingsModal, profile, user]);

  // Save settings handler
  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    setSettingsError("");
    setSettingsSuccess("");

    try {
      // Update display name if changed
      if (settingsName && settingsName !== (profile?.display_name || user?.displayName)) {
        if (supabase) {
          const { error: profileError } = await supabase
            .from("profiles")
            .update({ display_name: settingsName })
            .eq("id", user?.id);

          if (profileError) {
            throw new Error("Failed to update name: " + profileError.message);
          }
        }
      }

      // Update email if changed (requires current password)
      if (settingsEmail && settingsEmail !== user?.email) {
        if (!settingsCurrentPassword) {
          throw new Error("Current password is required to change email");
        }
        if (supabase) {
          const { error: emailError } = await supabase.auth.updateUser({
            email: settingsEmail,
          });
          if (emailError) {
            throw new Error("Failed to update email: " + emailError.message);
          }
        }
      }

      // Update password if provided
      if (settingsNewPassword) {
        if (!settingsCurrentPassword) {
          throw new Error("Current password is required to change password");
        }
        if (settingsNewPassword.length < 6) {
          throw new Error("New password must be at least 6 characters");
        }
        if (supabase) {
          const { error: passwordError } = await supabase.auth.updateUser({
            password: settingsNewPassword,
          });
          if (passwordError) {
            throw new Error("Failed to update password: " + passwordError.message);
          }
        }
      }

      setSettingsSuccess("Settings saved successfully!");
      
      // Refresh profile data
      if (refreshProfile) {
        await refreshProfile();
      }
      
      // Close modal after short delay
      setTimeout(() => {
        setShowSettingsModal(false);
      }, 1500);

    } catch (error: any) {
      setSettingsError(error.message || "Failed to save settings");
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Show loader while loading or if not connected
  if (loading || !user) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.background, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={COLORS.accent} />
        <Text style={{ color: COLORS.textSecondary, marginTop: 16 }}>
          Loading...
        </Text>
      </View>
    );
  }

  // Calculate level based on lessons completed
  const level = Math.floor(stats.lessonsCompleted / 5) + 1;
  const currentLeague = leagueNames[Math.min(Math.floor(stats.lessonsCompleted / 5), leagueNames.length - 1)];

  // Perform the actual account deletion
  const performDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      // Reset all stats
      await resetStats();
      
      // Clear course progress
      if (courseId) {
        await AsyncStorage.removeItem(COURSE_PROGRESS_STORAGE_KEY(courseId));
      }
      
      // Delete account (clears auth data)
      await deleteAccount();
      
      // Close modal and navigate to landing page
      setShowDeleteModal(false);
      router.replace("/");
    } catch (e: any) {
      setIsDeleting(false);
      Alert.alert("Error", e?.message || "Failed to delete account");
    }
  };

  // Open delete confirmation modal
  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  // Sign out handler
  const handleSignOut = async () => {
    const doSignOut = async () => {
      try {
        // Reset course ID in context first (this prevents redirect to /learn)
        setCourseId(null);
        
        await signOut();
        // Reset onboarding flag to show onboarding again
        await AsyncStorage.removeItem("onboarding_completed");
        // Reset course ID in storage
        await AsyncStorage.removeItem("CURRENT_COURSE_ID");
        
        // Navigate to guest/onboarding
        router.replace("/(guest)");
      } catch (e: any) {
        Alert.alert("Error", e?.message || "Failed to sign out");
      }
    };

    // Alert.alert can be flaky on web; use a native confirm there.
    if (Platform.OS === "web") {
      const ok = typeof window !== "undefined" ? window.confirm("Sign out?") : true;
      if (ok) await doSignOut();
      return;
    }

    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: () => void doSignOut() },
    ]);
  };

  return (
    <>
      <Metadata title="Profile" />
      <View style={{ flex: 1, backgroundColor: COLORS.background }}>
        <ScrollView
          contentContainerStyle={{
            padding: layouts.padding * 2,
            paddingBottom: 120,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Settings Gear Icon - Top Left */}
          <Pressable
            onPress={() => setShowSettingsModal(true)}
            style={({ pressed }) => ({
              position: "absolute",
              top: 8,
              left: -8,
              padding: 16,
              borderRadius: 16,
              backgroundColor: pressed ? COLORS.card : "transparent",
              zIndex: 10,
            })}
          >
            <Ionicons name="settings-outline" size={26} color={COLORS.textSecondary} />
          </Pressable>

          {/* Header */}
          <View style={{ alignItems: "center", marginBottom: 32, paddingTop: 16 }}>
            {/* Avatar */}
            <View
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                overflow: "hidden",
                borderWidth: 4,
                borderColor: COLORS.accent,
                marginBottom: 16,
              }}
            >
              <Image
                source={soliIcon}
                contentFit="cover"
                style={{ width: "100%", height: "100%" }}
              />
            </View>

            {/* Name */}
            <Text
              style={{
                fontSize: 28,
                fontWeight: "800",
                color: COLORS.textPrimary,
                marginBottom: 4,
              }}
            >
              {profile?.display_name || user?.displayName || user?.email?.split("@")[0] || "Learner"}
            </Text>

            {/* Email or Guest label */}
            <Text style={{ fontSize: 14, color: COLORS.textSecondary }}>
              {user?.email || "Guest Mode"}
            </Text>
          </View>

          {/* Stats Grid */}
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 12,
              marginBottom: 24,
            }}
          >
            {/* Level */}
            <View
              style={{
                flex: 1,
                minWidth: "45%",
                padding: 20,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: COLORS.cardBorder,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 36, fontWeight: "800", color: COLORS.accent }}>
                {level}
              </Text>
              <Text style={{ fontSize: 14, color: COLORS.textSecondary, marginTop: 4 }}>
                Level
              </Text>
            </View>

            {/* Total XP */}
            <View
              style={{
                flex: 1,
                minWidth: "45%",
                padding: 20,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: COLORS.cardBorder,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 36, fontWeight: "800", color: COLORS.blue }}>
                {stats.totalXp}
              </Text>
              <Text style={{ fontSize: 14, color: COLORS.textSecondary, marginTop: 4 }}>
                Total XP
              </Text>
            </View>

            {/* Streak */}
            <View
              style={{
                flex: 1,
                minWidth: "45%",
                padding: 20,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: COLORS.cardBorder,
                alignItems: "center",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Text style={{ fontSize: 36, fontWeight: "800", color: COLORS.orange }}>
                  {stats.streak}
                </Text>
                <Text style={{ fontSize: 28 }}>🔥</Text>
              </View>
              <Text style={{ fontSize: 14, color: COLORS.textSecondary, marginTop: 4 }}>
                Day Streak
              </Text>
            </View>

            {/* Lives */}
            <View
              style={{
                flex: 1,
                minWidth: "45%",
                padding: 20,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: COLORS.cardBorder,
                alignItems: "center",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Text style={{ fontSize: 36, fontWeight: "800", color: COLORS.red }}>
                  {hasUnlimitedLives ? "∞" : lives}
                </Text>
                <Text style={{ fontSize: 28 }}>❤️</Text>
              </View>
              <Text style={{ fontSize: 14, color: COLORS.textSecondary, marginTop: 4 }}>
                {hasUnlimitedLives ? "Unlimited" : `${lives}/${maxLives}`}
              </Text>
            </View>
          </View>

          {/* Progress Stats */}
          <View
            style={{
              padding: 20,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: COLORS.cardBorder,
              marginBottom: 24,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: COLORS.textPrimary,
                marginBottom: 16,
              }}
            >
              Progress
            </Text>

            <View style={{ gap: 16 }}>
              {/* Lessons Completed */}
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                  <Text style={{ fontSize: 20 }}>📚</Text>
                  <Text style={{ fontSize: 16, color: COLORS.textPrimary }}>
                    Lessons Completed
                  </Text>
                </View>
                <Text style={{ fontSize: 16, fontWeight: "700", color: COLORS.green }}>
                  {stats.lessonsCompleted}
                </Text>
              </View>

              {/* Weekly XP */}
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                  <Text style={{ fontSize: 20 }}>⚡</Text>
                  <Text style={{ fontSize: 16, color: COLORS.textPrimary }}>
                    Weekly XP
                  </Text>
                </View>
                <Text style={{ fontSize: 16, fontWeight: "700", color: COLORS.blue }}>
                  {stats.weeklyXp}
                </Text>
              </View>

              {/* Gems */}
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                  <Text style={{ fontSize: 20 }}>💎</Text>
                  <Text style={{ fontSize: 16, color: COLORS.textPrimary }}>
                    Gems
                  </Text>
                </View>
                <Text style={{ fontSize: 16, fontWeight: "700", color: "#00D9FF" }}>
                  {stats.gems}
                </Text>
              </View>
            </View>
          </View>

          {/* League Section */}
          <View
            style={{
              padding: 20,
              borderRadius: 16,
              borderWidth: 2,
              borderColor: COLORS.accent,
              marginBottom: 24,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View>
                <Text style={{ fontSize: 20, fontWeight: "800", color: COLORS.textPrimary }}>
                  {currentLeague} League
                </Text>
                <Text style={{ fontSize: 14, color: COLORS.textSecondary, marginTop: 4 }}>
                  Keep learning to advance!
                </Text>
              </View>
              <Text style={{ fontSize: 44 }}>🏆</Text>
            </View>
          </View>

          {/* Achievements */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: COLORS.textPrimary,
                marginBottom: 16,
              }}
            >
              Achievements
            </Text>

            <View style={{ gap: 12 }}>
              {/* First Lesson */}
              <View
                style={{
                  padding: 16,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: stats.lessonsCompleted >= 1 ? COLORS.green : COLORS.cardBorder,
                  backgroundColor: stats.lessonsCompleted >= 1 ? "rgba(20, 241, 149, 0.1)" : "transparent",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <Text style={{ fontSize: 32 }}>🎯</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: "700", color: COLORS.textPrimary }}>
                    First Steps
                  </Text>
                  <Text style={{ fontSize: 13, color: COLORS.textSecondary }}>
                    Complete your first lesson
                  </Text>
                </View>
                {stats.lessonsCompleted >= 1 ? (
                  <Ionicons name="checkmark-circle" size={28} color={COLORS.green} />
                ) : (
                  <Text style={{ fontSize: 14, color: COLORS.textSecondary }}>
                    {stats.lessonsCompleted}/1
                  </Text>
                )}
              </View>

              {/* 7 Day Streak */}
              <View
                style={{
                  padding: 16,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: stats.streak >= 7 ? COLORS.orange : COLORS.cardBorder,
                  backgroundColor: stats.streak >= 7 ? "rgba(255, 149, 0, 0.1)" : "transparent",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <Text style={{ fontSize: 32 }}>🔥</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: "700", color: COLORS.textPrimary }}>
                    On Fire
                  </Text>
                  <Text style={{ fontSize: 13, color: COLORS.textSecondary }}>
                    Reach a 7 day streak
                  </Text>
                </View>
                {stats.streak >= 7 ? (
                  <Ionicons name="checkmark-circle" size={28} color={COLORS.orange} />
                ) : (
                  <Text style={{ fontSize: 14, color: COLORS.textSecondary }}>
                    {stats.streak}/7
                  </Text>
                )}
              </View>

              {/* 100 XP */}
              <View
                style={{
                  padding: 16,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: stats.totalXp >= 100 ? COLORS.blue : COLORS.cardBorder,
                  backgroundColor: stats.totalXp >= 100 ? "rgba(28, 176, 246, 0.1)" : "transparent",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <Text style={{ fontSize: 32 }}>⚡</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: "700", color: COLORS.textPrimary }}>
                    XP Hunter
                  </Text>
                  <Text style={{ fontSize: 13, color: COLORS.textSecondary }}>
                    Earn 100 XP
                  </Text>
                </View>
                {stats.totalXp >= 100 ? (
                  <Ionicons name="checkmark-circle" size={28} color={COLORS.blue} />
                ) : (
                  <Text style={{ fontSize: 14, color: COLORS.textSecondary }}>
                    {stats.totalXp}/100
                  </Text>
                )}
              </View>
            </View>
          </View>

          {/* Auth Buttons */}
          <View style={{ gap: 12 }}>
            {/* Sign Out Button */}
            <Pressable
              onPress={handleSignOut}
              style={({ pressed }) => ({
                backgroundColor: COLORS.card,
                paddingVertical: 16,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: COLORS.cardBorder,
                opacity: pressed ? 0.9 : 1,
              })}
            >
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <Ionicons name="log-out-outline" size={20} color={COLORS.textPrimary} />
                <Text
                  style={{
                    textAlign: "center",
                    fontWeight: "800",
                    fontSize: 16,
                    color: COLORS.textPrimary,
                    textTransform: "uppercase",
                  }}
                >
                  Sign Out
                </Text>
              </View>
            </Pressable>

            {/* Delete Account Button - Required by Apple */}
            <Pressable
              onPress={handleDeleteAccount}
              style={({ pressed }) => ({
                backgroundColor: "transparent",
                paddingVertical: 16,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: COLORS.red,
                opacity: pressed ? 0.9 : 1,
              })}
            >
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <Ionicons name="trash-outline" size={18} color={COLORS.red} />
                <Text
                  style={{
                    textAlign: "center",
                    fontWeight: "700",
                    fontSize: 14,
                    color: COLORS.red,
                  }}
                >
                  Delete Account
                </Text>
              </View>
            </Pressable>
          </View>

          {/* Contract Address */}
          <Pressable
            onPress={handleCopyCA}
            style={({ pressed }) => ({
              marginTop: 32,
              padding: 16,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: caCopied ? COLORS.green : COLORS.cardBorder,
              backgroundColor: caCopied ? "rgba(20, 241, 149, 0.1)" : "transparent",
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, color: COLORS.textSecondary, marginBottom: 4 }}>
                  Contract Address (CA)
                </Text>
                <Text 
                  style={{ 
                    fontSize: 11, 
                    color: COLORS.textPrimary, 
                    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
                  }}
                  numberOfLines={1}
                >
                  {CONTRACT_ADDRESS}
                </Text>
              </View>
              <View style={{ marginLeft: 12 }}>
                {caCopied ? (
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                    <Ionicons name="checkmark-circle" size={20} color={COLORS.green} />
                    <Text style={{ fontSize: 12, color: COLORS.green, fontWeight: "600" }}>Copied!</Text>
                  </View>
                ) : (
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                    <Ionicons name="copy-outline" size={18} color={COLORS.accent} />
                    <Text style={{ fontSize: 12, color: COLORS.accent, fontWeight: "600" }}>Copy</Text>
                  </View>
                )}
              </View>
            </View>
          </Pressable>

          {/* Legal Links on Profile Page */}
          <View style={{ marginTop: 24, alignItems: "center" }}>
            <View style={{ flexDirection: "row", gap: 16 }}>
              <Pressable onPress={() => Linking.openURL("https://solingo.fun/privacy")}>
                <Text style={{ fontSize: 14, color: COLORS.accent, textDecorationLine: "underline" }}>
                  Privacy Policy
                </Text>
              </Pressable>
              <Text style={{ fontSize: 14, color: COLORS.textMuted }}>•</Text>
              <Pressable onPress={() => Linking.openURL("https://solingo.fun/terms")}>
                <Text style={{ fontSize: 14, color: COLORS.accent, textDecorationLine: "underline" }}>
                  Terms of Use
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>

        {/* Delete Account Confirmation Modal */}
        <Modal
          visible={showDeleteModal}
          transparent
          animationType="fade"
          onRequestClose={() => !isDeleting && setShowDeleteModal(false)}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.9)",
              justifyContent: "center",
              alignItems: "center",
              padding: 24,
            }}
          >
            <View
              style={{
                backgroundColor: COLORS.card,
                borderRadius: 24,
                padding: 28,
                width: "100%",
                maxWidth: 400,
                alignItems: "center",
              }}
            >
              {/* Sad Mascot */}
              <Image
                source={soliSadIcon}
                style={{ width: 100, height: 100, marginBottom: 20 }}
                contentFit="contain"
              />

              {/* Warning Icon */}
              <View
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: "rgba(231, 76, 60, 0.2)",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <Ionicons name="warning" size={32} color={COLORS.red} />
              </View>

              {/* Title */}
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "800",
                  color: COLORS.textPrimary,
                  textAlign: "center",
                  marginBottom: 12,
                }}
              >
                Delete Your Account?
              </Text>

              {/* Description */}
              <Text
                style={{
                  fontSize: 15,
                  color: COLORS.textSecondary,
                  textAlign: "center",
                  marginBottom: 24,
                  lineHeight: 22,
                }}
              >
                This action is permanent and cannot be undone.{"\n\n"}
                All your progress, XP, gems, achievements, and learning history will be permanently deleted.
              </Text>

              {/* Countdown or Loading */}
              {isDeleting ? (
                <View style={{ marginBottom: 24 }}>
                  <ActivityIndicator size="large" color={COLORS.red} />
                  <Text style={{ color: COLORS.textSecondary, marginTop: 12, fontSize: 14 }}>
                    Deleting your account...
                  </Text>
                </View>
              ) : (
                <View
                  style={{
                    backgroundColor: "rgba(231, 76, 60, 0.1)",
                    borderRadius: 16,
                    padding: 16,
                    marginBottom: 24,
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  {deleteCountdown > 0 ? (
                    <>
                      <Text
                        style={{
                          fontSize: 48,
                          fontWeight: "800",
                          color: COLORS.red,
                        }}
                      >
                        {deleteCountdown}
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          color: COLORS.textSecondary,
                          marginTop: 4,
                        }}
                      >
                        Please wait before confirming...
                      </Text>
                    </>
                  ) : (
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "700",
                        color: COLORS.red,
                      }}
                    >
                      You can now delete your account
                    </Text>
                  )}
                </View>
              )}

              {/* Buttons */}
              <View style={{ width: "100%", gap: 12 }}>
                {/* Cancel Button */}
                <Pressable
                  onPress={() => setShowDeleteModal(false)}
                  disabled={isDeleting}
                  style={({ pressed }) => ({
                    backgroundColor: COLORS.accent,
                    paddingVertical: 16,
                    borderRadius: 16,
                    opacity: pressed || isDeleting ? 0.7 : 1,
                  })}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      fontWeight: "800",
                      fontSize: 16,
                      color: COLORS.textPrimary,
                    }}
                  >
                    Cancel - Keep My Account
                  </Text>
                </Pressable>

                {/* Confirm Delete Button */}
                <Pressable
                  onPress={performDeleteAccount}
                  disabled={deleteCountdown > 0 || isDeleting}
                  style={({ pressed }) => ({
                    backgroundColor: deleteCountdown > 0 ? COLORS.cardBorder : COLORS.red,
                    paddingVertical: 16,
                    borderRadius: 16,
                    opacity: pressed ? 0.9 : 1,
                  })}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <Ionicons
                      name="trash"
                      size={18}
                      color={deleteCountdown > 0 ? COLORS.textSecondary : COLORS.textPrimary}
                    />
                    <Text
                      style={{
                        textAlign: "center",
                        fontWeight: "800",
                        fontSize: 16,
                        color: deleteCountdown > 0 ? COLORS.textSecondary : COLORS.textPrimary,
                      }}
                    >
                      {deleteCountdown > 0
                        ? `Wait ${deleteCountdown}s to confirm`
                        : "Yes, Delete My Account"}
                    </Text>
                  </View>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        {/* Settings Modal */}
        <Modal
          visible={showSettingsModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => !isSavingSettings && setShowSettingsModal(false)}
        >
          <View style={{ flex: 1, backgroundColor: SETTINGS_COLORS.background }}>
            {/* Header */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 16,
                borderBottomWidth: 1,
                borderBottomColor: SETTINGS_COLORS.cardBorder,
              }}
            >
              <Pressable
                onPress={() => setShowSettingsModal(false)}
                disabled={isSavingSettings}
                style={{ padding: 8 }}
              >
                <Ionicons name="arrow-back" size={24} color={SETTINGS_COLORS.textPrimary} />
              </Pressable>

              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: SETTINGS_COLORS.textPrimary,
                }}
              >
                Account Settings
              </Text>

              <Pressable
                onPress={handleSaveSettings}
                disabled={isSavingSettings}
                style={({ pressed }) => ({
                  backgroundColor: SETTINGS_COLORS.accent,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 8,
                  opacity: pressed || isSavingSettings ? 0.7 : 1,
                })}
              >
                {isSavingSettings ? (
                  <ActivityIndicator size="small" color={SETTINGS_COLORS.textPrimary} />
                ) : (
                  <Text style={{ color: SETTINGS_COLORS.textPrimary, fontWeight: "700" }}>
                    Save
                  </Text>
                )}
              </Pressable>
            </View>

            <ScrollView
              contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Avatar Section */}
              <View style={{ alignItems: "center", marginBottom: 32 }}>
                <View
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    overflow: "hidden",
                    borderWidth: 3,
                    borderColor: SETTINGS_COLORS.accent,
                    marginBottom: 12,
                  }}
                >
                  <Image
                    source={soliIcon}
                    contentFit="cover"
                    style={{ width: "100%", height: "100%" }}
                  />
                </View>
                <Pressable
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Ionicons name="camera-outline" size={18} color={SETTINGS_COLORS.accent} />
                  <Text style={{ color: SETTINGS_COLORS.accent, fontWeight: "600" }}>
                    Change Avatar
                  </Text>
                </Pressable>
              </View>

              {/* Error/Success Messages */}
              {settingsError ? (
                <View
                  style={{
                    backgroundColor: "rgba(231, 76, 60, 0.15)",
                    borderRadius: 12,
                    padding: 14,
                    marginBottom: 20,
                  }}
                >
                  <Text style={{ color: SETTINGS_COLORS.red, fontSize: 14 }}>
                    {settingsError}
                  </Text>
                </View>
              ) : null}

              {settingsSuccess ? (
                <View
                  style={{
                    backgroundColor: "rgba(20, 241, 149, 0.15)",
                    borderRadius: 12,
                    padding: 14,
                    marginBottom: 20,
                  }}
                >
                  <Text style={{ color: SETTINGS_COLORS.green, fontSize: 14 }}>
                    {settingsSuccess}
                  </Text>
                </View>
              ) : null}

              {/* Account Section */}
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: SETTINGS_COLORS.textPrimary,
                  marginBottom: 16,
                }}
              >
                Account
              </Text>

              {/* Name Field */}
              <View style={{ marginBottom: 16 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: SETTINGS_COLORS.textSecondary,
                    marginBottom: 8,
                  }}
                >
                  Display Name
                </Text>
                <TextInput
                  value={settingsName}
                  onChangeText={setSettingsName}
                  placeholder="Your display name"
                  placeholderTextColor={SETTINGS_COLORS.textMuted}
                  style={{
                    backgroundColor: SETTINGS_COLORS.inputBg,
                    borderWidth: 1,
                    borderColor: SETTINGS_COLORS.inputBorder,
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    fontSize: 16,
                    color: SETTINGS_COLORS.textPrimary,
                  }}
                />
              </View>

              {/* Email Field */}
              <View style={{ marginBottom: 16 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: SETTINGS_COLORS.textSecondary,
                    marginBottom: 8,
                  }}
                >
                  Email
                </Text>
                <TextInput
                  value={settingsEmail}
                  onChangeText={setSettingsEmail}
                  placeholder="your@email.com"
                  placeholderTextColor={SETTINGS_COLORS.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={{
                    backgroundColor: SETTINGS_COLORS.inputBg,
                    borderWidth: 1,
                    borderColor: SETTINGS_COLORS.inputBorder,
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    fontSize: 16,
                    color: SETTINGS_COLORS.textPrimary,
                  }}
                />
                <Text
                  style={{
                    fontSize: 12,
                    color: SETTINGS_COLORS.textMuted,
                    marginTop: 6,
                  }}
                >
                  Enter your password below to change email
                </Text>
              </View>

              {/* Password Section */}
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: SETTINGS_COLORS.textPrimary,
                  marginTop: 16,
                  marginBottom: 16,
                }}
              >
                Change Password
              </Text>

              {/* Current Password Field */}
              <View style={{ marginBottom: 16 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: SETTINGS_COLORS.textSecondary,
                    marginBottom: 8,
                  }}
                >
                  Current Password
                </Text>
                <View style={{ position: "relative" }}>
                  <TextInput
                    value={settingsCurrentPassword}
                    onChangeText={setSettingsCurrentPassword}
                    placeholder="••••••••"
                    placeholderTextColor={SETTINGS_COLORS.textMuted}
                    secureTextEntry={!showCurrentPassword}
                    style={{
                      backgroundColor: SETTINGS_COLORS.inputBg,
                      borderWidth: 1,
                      borderColor: SETTINGS_COLORS.inputBorder,
                      borderRadius: 12,
                      paddingHorizontal: 16,
                      paddingVertical: 14,
                      paddingRight: 50,
                      fontSize: 16,
                      color: SETTINGS_COLORS.textPrimary,
                    }}
                  />
                  <Pressable
                    onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                    style={{
                      position: "absolute",
                      right: 16,
                      top: 0,
                      bottom: 0,
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons
                      name={showCurrentPassword ? "eye-off" : "eye"}
                      size={22}
                      color={SETTINGS_COLORS.textMuted}
                    />
                  </Pressable>
                </View>
              </View>

              {/* New Password Field */}
              <View style={{ marginBottom: 24 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: SETTINGS_COLORS.textSecondary,
                    marginBottom: 8,
                  }}
                >
                  New Password
                </Text>
                <View style={{ position: "relative" }}>
                  <TextInput
                    value={settingsNewPassword}
                    onChangeText={setSettingsNewPassword}
                    placeholder="••••••••"
                    placeholderTextColor={SETTINGS_COLORS.textMuted}
                    secureTextEntry={!showNewPassword}
                    style={{
                      backgroundColor: SETTINGS_COLORS.inputBg,
                      borderWidth: 1,
                      borderColor: SETTINGS_COLORS.inputBorder,
                      borderRadius: 12,
                      paddingHorizontal: 16,
                      paddingVertical: 14,
                      paddingRight: 50,
                      fontSize: 16,
                      color: SETTINGS_COLORS.textPrimary,
                    }}
                  />
                  <Pressable
                    onPress={() => setShowNewPassword(!showNewPassword)}
                    style={{
                      position: "absolute",
                      right: 16,
                      top: 0,
                      bottom: 0,
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons
                      name={showNewPassword ? "eye-off" : "eye"}
                      size={22}
                      color={SETTINGS_COLORS.textMuted}
                    />
                  </Pressable>
                </View>
                <Text
                  style={{
                    fontSize: 12,
                    color: SETTINGS_COLORS.textMuted,
                    marginTop: 6,
                  }}
                >
                  Leave blank to keep current password
                </Text>
              </View>

              {/* Danger Zone */}
              <View
                style={{
                  borderTopWidth: 1,
                  borderTopColor: SETTINGS_COLORS.cardBorder,
                  paddingTop: 24,
                  marginTop: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: SETTINGS_COLORS.red,
                    marginBottom: 16,
                  }}
                >
                  Danger Zone
                </Text>

                <Pressable
                  onPress={() => {
                    setShowSettingsModal(false);
                    setTimeout(() => handleDeleteAccount(), 300);
                  }}
                  style={({ pressed }) => ({
                    backgroundColor: "transparent",
                    paddingVertical: 14,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: SETTINGS_COLORS.red,
                    opacity: pressed ? 0.8 : 1,
                  })}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <Ionicons name="trash-outline" size={18} color={SETTINGS_COLORS.red} />
                    <Text style={{ color: SETTINGS_COLORS.red, fontWeight: "700", fontSize: 14 }}>
                      Delete Account
                    </Text>
                  </View>
                </Pressable>
              </View>

              {/* Legal Links */}
              <View
                style={{
                  borderTopWidth: 1,
                  borderTopColor: SETTINGS_COLORS.cardBorder,
                  paddingTop: 24,
                  marginTop: 32,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: SETTINGS_COLORS.textPrimary,
                    marginBottom: 16,
                  }}
                >
                  Legal
                </Text>

                <Pressable
                  onPress={() => Linking.openURL("https://solingo.fun/privacy")}
                  style={({ pressed }) => ({
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingVertical: 14,
                    opacity: pressed ? 0.7 : 1,
                  })}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                    <Ionicons name="shield-checkmark-outline" size={22} color={SETTINGS_COLORS.accent} />
                    <Text style={{ fontSize: 16, color: SETTINGS_COLORS.textPrimary }}>
                      Privacy Policy
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={SETTINGS_COLORS.textMuted} />
                </Pressable>

                <Pressable
                  onPress={() => Linking.openURL("https://solingo.fun/terms")}
                  style={({ pressed }) => ({
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingVertical: 14,
                    opacity: pressed ? 0.7 : 1,
                  })}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                    <Ionicons name="document-text-outline" size={22} color={SETTINGS_COLORS.accent} />
                    <Text style={{ fontSize: 16, color: SETTINGS_COLORS.textPrimary }}>
                      Terms of Use
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={SETTINGS_COLORS.textMuted} />
                </Pressable>
              </View>

              {/* App Version */}
              <Text
                style={{
                  fontSize: 12,
                  color: SETTINGS_COLORS.textMuted,
                  textAlign: "center",
                  marginTop: 32,
                }}
              >
                Solingo v1.0.0
              </Text>
            </ScrollView>
          </View>
        </Modal>
      </View>
    </>
  );
}
