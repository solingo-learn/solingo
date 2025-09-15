import { router } from "expo-router";
import { Pressable, Platform } from "react-native";
import { useState } from "react";

import { Icon } from "@/components/icons";
import { Text, View } from "@/components/themed";
import { layouts } from "@/constants/layouts";
import { useTheme } from "@/context/theme";
import { useAuth } from "@/context/auth";
import { useUserStats } from "@/context/user-stats";
import { SupportedLanguageCode } from "@/types";

const CONTRACT_ADDRESS = "BygYYihmnVcmmAM6xfnaKPoApiaTaHAt3diEhS5upump";

// Unified colors
const COLORS = {
  accent: "#1CB0F6",
  green: "#14F195",
  greenDark: "#0FC87A",
  cardBorder: "#3A3A3C",
  textPrimary: "#FFFFFF",
  textSecondary: "#8E8E93",
};

interface Props {
  courseId: SupportedLanguageCode;
}

export function CourseRightBar({ courseId }: Props) {
  const { border, muted, mutedForeground } = useTheme();
  const { user } = useAuth();
  const { stats } = useUserStats();
  const [copied, setCopied] = useState(false);

  const isLoggedIn = !!user;

  const handleCopyAddress = async () => {
    try {
      if (Platform.OS === "web") {
        await navigator.clipboard.writeText(CONTRACT_ADDRESS);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };
  const xpProgress = Math.min((stats.weeklyXp / 10) * 100, 100);

  return (
    <View
      style={{
        padding: layouts.padding * 2,
        borderLeftWidth: layouts.borderWidth,
        borderLeftColor: border,
        flexShrink: 0,
        gap: layouts.padding * 2,
        width: 300,
      }}
    >
      {/* Daily Quests */}
      <View
        style={{
          borderRadius: layouts.padding,
          borderWidth: layouts.borderWidth,
          borderColor: border,
          padding: layouts.padding * 2,
          gap: layouts.padding * 2,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>Daily Quests</Text>
          <Pressable onPress={() => router.push("/quests")}>
            <Text
              style={{
                color: COLORS.accent,
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
            >
              View all
            </Text>
          </Pressable>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Icon name="bolt" size={64} />
          <View style={{ flex: 1 }}>
            <Text>Earn 10 XP</Text>
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 1, justifyContent: "center" }}>
                <View
                  style={{
                    height: 16,
                    backgroundColor: muted,
                    alignItems: "center",
                    justifyContent: "center",
                    borderTopLeftRadius: 16,
                    borderBottomLeftRadius: 16,
                    overflow: "hidden",
                  }}
                >
                  {/* Progress fill */}
                  <View
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: `${xpProgress}%`,
                      backgroundColor: COLORS.accent,
                    }}
                  />
                  <Text style={{ fontSize: 12, color: mutedForeground, zIndex: 1 }}>
                    {Math.min(stats.weeklyXp, 10)} / 10
                  </Text>
                </View>
              </View>
              <Icon name="box" />
            </View>
          </View>
        </View>
      </View>

      {/* Auth Section - only show if not logged in */}
      {!isLoggedIn && (
        <View
          style={{
            borderRadius: layouts.padding,
            borderWidth: layouts.borderWidth,
            borderColor: border,
            padding: layouts.padding * 2,
            gap: layouts.padding * 2,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              maxWidth: 256,
            }}
          >
            Create a profile to save your progress!
          </Text>
          <View style={{ gap: layouts.padding }}>
            {/* Create Profile Button */}
            <Pressable
              onPress={() => router.push({ pathname: "/auth", params: { mode: "signup" } })}
              style={({ pressed }) => ({
                backgroundColor: COLORS.green,
                paddingVertical: 12,
                borderRadius: 12,
                borderBottomWidth: 4,
                borderBottomColor: COLORS.greenDark,
                opacity: pressed ? 0.9 : 1,
              })}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "800",
                  fontSize: 14,
                  color: "#000000",
                  textTransform: "uppercase",
                }}
              >
                Create a profile
              </Text>
            </Pressable>

            {/* Sign In Button */}
            <Pressable
              onPress={() => router.push({ pathname: "/auth", params: { mode: "signin" } })}
              style={({ pressed }) => ({
                backgroundColor: "transparent",
                paddingVertical: 12,
                borderRadius: 12,
                borderWidth: 2,
                borderBottomWidth: 4,
                borderColor: COLORS.cardBorder,
                opacity: pressed ? 0.9 : 1,
              })}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "800",
                  fontSize: 14,
                  color: COLORS.textPrimary,
                  textTransform: "uppercase",
                }}
              >
                Sign in
              </Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Logged in user info */}
      {isLoggedIn && (
        <View
          style={{
            borderRadius: layouts.padding,
            borderWidth: layouts.borderWidth,
            borderColor: border,
            padding: layouts.padding * 2,
            gap: layouts.padding,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            Welcome back! 👋
          </Text>
          <Text style={{ fontSize: 14, color: mutedForeground }}>
            {user.email || user.displayName || "Learner"}
          </Text>
          <Pressable
            onPress={() => router.push("/profile")}
            style={({ pressed }) => ({
              backgroundColor: "transparent",
              paddingVertical: 10,
              borderRadius: 10,
              borderWidth: 2,
              borderColor: COLORS.cardBorder,
              opacity: pressed ? 0.9 : 1,
              marginTop: 4,
            })}
          >
            <Text
              style={{
                textAlign: "center",
                fontWeight: "700",
                fontSize: 13,
                color: COLORS.accent,
                textTransform: "uppercase",
              }}
            >
              View Profile
            </Text>
          </Pressable>
        </View>
      )}

      {/* Contract Address */}
      <View
        style={{
          borderRadius: layouts.padding,
          borderWidth: layouts.borderWidth,
          borderColor: border,
          padding: layouts.padding * 2,
          gap: layouts.padding,
        }}
      >
        <Text style={{ fontSize: 14, fontWeight: "bold", color: mutedForeground }}>
          Contract Address
        </Text>
        <Pressable
          onPress={handleCopyAddress}
          style={({ pressed }) => ({
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: pressed ? "rgba(255,255,255,0.05)" : "transparent",
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: COLORS.cardBorder,
          })}
        >
          <Text
            style={{
              fontSize: 11,
              color: COLORS.textSecondary,
              flex: 1,
              fontFamily: Platform.OS === "web" ? "monospace" : undefined,
            }}
            numberOfLines={1}
          >
            {CONTRACT_ADDRESS}
          </Text>
          <View style={{ marginLeft: 8 }}>
            <Text style={{ fontSize: 12, color: copied ? COLORS.green : COLORS.textSecondary }}>
              {copied ? "✓" : "📋"}
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}
