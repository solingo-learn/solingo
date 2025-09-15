import { useState, useRef } from "react";
import { Pressable, Animated, Easing, useWindowDimensions } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { Text, View } from "@/components/themed";
import { layouts } from "@/constants/layouts";

// Mascot images
const soliHappy = require("@/assets/mascotte/soli-happy.png");
const soliThinking = require("@/assets/mascotte/soli-thinking.png");
const soliTeacher = require("@/assets/mascotte/soli-teacher.png");

interface OnboardingFlowProps {
  onCreateAccount: () => void;
  onContinueAsGuest: () => void;
}

// Screen 1: Welcome
function WelcomeScreen({ onNext }: { onNext: () => void }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useState(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  });

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: layouts.padding * 2 }}>
      {/* Background gradient accent */}
      <View
        style={{
          position: "absolute",
          top: "20%",
          width: 300,
          height: 300,
          borderRadius: 150,
          backgroundColor: "rgba(153, 69, 255, 0.15)",
          filter: "blur(80px)",
        }}
      />

      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          alignItems: "center",
        }}
      >
        {/* Mascot */}
        <Image
          source={soliHappy}
          style={{ width: 200, height: 200, marginBottom: 40 }}
          contentFit="contain"
        />

        {/* Title */}
        <Text
          style={{
            fontSize: 36,
            fontWeight: "800",
            color: "#FFFFFF",
            textAlign: "center",
            marginBottom: 12,
          }}
        >
          Welcome to Solingo
        </Text>

        {/* Subtitle */}
        <Text
          style={{
            fontSize: 18,
            color: "#888888",
            textAlign: "center",
            marginBottom: 60,
          }}
        >
          Learn Solana, one lesson at a time.
        </Text>

        {/* CTA Button */}
        <Pressable
          onPress={onNext}
          style={({ pressed }) => ({
            backgroundColor: "#14F195",
            paddingHorizontal: 48,
            paddingVertical: 18,
            borderRadius: 16,
            borderBottomWidth: 4,
            borderBottomColor: "#0ED47A",
            opacity: pressed ? 0.9 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
            width: "100%",
            maxWidth: 320,
          })}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "800",
              color: "#000000",
              textAlign: "center",
            }}
          >
            Start Learning
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

// Screen 2: The Problem
function ProblemScreen({ onNext }: { onNext: () => void }) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: layouts.padding * 2 }}>
      {/* Icons */}
      <View
        style={{
          flexDirection: "row",
          gap: 24,
          marginBottom: 48,
        }}
      >
        <View
          style={{
            width: 70,
            height: 70,
            borderRadius: 20,
            backgroundColor: "rgba(231, 76, 60, 0.2)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 32 }}>📉</Text>
        </View>
        <View
          style={{
            width: 70,
            height: 70,
            borderRadius: 20,
            backgroundColor: "rgba(241, 196, 15, 0.2)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 32 }}>❓</Text>
        </View>
        <View
          style={{
            width: 70,
            height: 70,
            borderRadius: 20,
            backgroundColor: "rgba(255, 107, 53, 0.2)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 32 }}>⚠️</Text>
        </View>
      </View>

      {/* Title */}
      <Text
        style={{
          fontSize: 28,
          fontWeight: "800",
          color: "#FFFFFF",
          textAlign: "center",
          marginBottom: 16,
          lineHeight: 38,
        }}
      >
        Most people lose money{"\n"}because they don't understand{"\n"}what they're doing.
      </Text>

      {/* Subtitle */}
      <Text
        style={{
          fontSize: 16,
          color: "#888888",
          textAlign: "center",
          marginBottom: 60,
        }}
      >
        Solingo helps you learn before you trade.
      </Text>

      {/* CTA Button */}
      <Pressable
        onPress={onNext}
        style={({ pressed }) => ({
          backgroundColor: "#9945FF",
          paddingHorizontal: 48,
          paddingVertical: 18,
          borderRadius: 16,
          borderBottomWidth: 4,
          borderBottomColor: "#7B35D9",
          opacity: pressed ? 0.9 : 1,
          width: "100%",
          maxWidth: 320,
        })}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "800",
            color: "#FFFFFF",
            textAlign: "center",
          }}
        >
          Continue
        </Text>
      </Pressable>
    </View>
  );
}

// Screen 3: What Solingo Does
function FeaturesScreen({ onNext }: { onNext: () => void }) {
  const features = [
    { icon: "📚", text: "Short lessons" },
    { icon: "✅", text: "Simple quizzes" },
    { icon: "⚡", text: "Real Solana examples" },
  ];

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: layouts.padding * 2 }}>
      {/* Checklist */}
      <View style={{ gap: 20, marginBottom: 60, width: "100%", maxWidth: 320 }}>
        {features.map((feature, index) => (
          <View
            key={index}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 16,
              backgroundColor: "#1A1A1A",
              padding: 20,
              borderRadius: 16,
              borderLeftWidth: 4,
              borderLeftColor: "#14F195",
            }}
          >
            <Text style={{ fontSize: 28 }}>{feature.icon}</Text>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: "#FFFFFF",
              }}
            >
              {feature.text}
            </Text>
          </View>
        ))}
      </View>

      {/* CTA Button */}
      <Pressable
        onPress={onNext}
        style={({ pressed }) => ({
          backgroundColor: "#14F195",
          paddingHorizontal: 48,
          paddingVertical: 18,
          borderRadius: 16,
          borderBottomWidth: 4,
          borderBottomColor: "#0ED47A",
          opacity: pressed ? 0.9 : 1,
          width: "100%",
          maxWidth: 320,
        })}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "800",
            color: "#000000",
            textAlign: "center",
          }}
        >
          Sounds Good
        </Text>
      </Pressable>
    </View>
  );
}

// Screen 4: Reassurance
function ReassuranceScreen({ onNext }: { onNext: () => void }) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: layouts.padding * 2 }}>
      {/* Mascot */}
      <Image
        source={soliTeacher}
        style={{ width: 160, height: 160, marginBottom: 40 }}
        contentFit="contain"
      />

      {/* Main Text */}
      <View style={{ gap: 8, marginBottom: 24, alignItems: "center" }}>
        <Text style={{ fontSize: 26, fontWeight: "800", color: "#FFFFFF" }}>
          No signals.
        </Text>
        <Text style={{ fontSize: 26, fontWeight: "800", color: "#FFFFFF" }}>
          No promises.
        </Text>
        <Text style={{ fontSize: 26, fontWeight: "800", color: "#FFFFFF" }}>
          No hype.
        </Text>
      </View>

      {/* Subtitle */}
      <Text
        style={{
          fontSize: 16,
          color: "#888888",
          textAlign: "center",
          marginBottom: 60,
        }}
      >
        Just knowledge and discipline.
      </Text>

      {/* CTA Button */}
      <Pressable
        onPress={onNext}
        style={({ pressed }) => ({
          backgroundColor: "#9945FF",
          paddingHorizontal: 48,
          paddingVertical: 18,
          borderRadius: 16,
          borderBottomWidth: 4,
          borderBottomColor: "#7B35D9",
          opacity: pressed ? 0.9 : 1,
          width: "100%",
          maxWidth: 320,
        })}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "800",
            color: "#FFFFFF",
            textAlign: "center",
          }}
        >
          I'm Ready
        </Text>
      </Pressable>
    </View>
  );
}

// Screen 5: Personalization
function PersonalizationScreen({ onNext }: { onNext: () => void }) {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const levels = [
    { id: "beginner", label: "I'm new to crypto", icon: "🌱" },
    { id: "intermediate", label: "I know the basics", icon: "📖" },
    { id: "advanced", label: "I already trade on Solana", icon: "🚀" },
  ];

  const handleComplete = async () => {
    if (selectedLevel) {
      await AsyncStorage.setItem("user_level", selectedLevel);
    }
    onNext();
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: layouts.padding * 2 }}>
      {/* Question */}
      <Text
        style={{
          fontSize: 28,
          fontWeight: "800",
          color: "#FFFFFF",
          textAlign: "center",
          marginBottom: 40,
        }}
      >
        What's your level?
      </Text>

      {/* Options */}
      <View style={{ gap: 12, marginBottom: 48, width: "100%", maxWidth: 320 }}>
        {levels.map((level) => {
          const isSelected = selectedLevel === level.id;
          return (
            <Pressable
              key={level.id}
              onPress={() => setSelectedLevel(level.id)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 16,
                backgroundColor: isSelected ? "rgba(20, 241, 149, 0.15)" : "#1A1A1A",
                padding: 20,
                borderRadius: 16,
                borderWidth: 2,
                borderColor: isSelected ? "#14F195" : "#2A2A2A",
              }}
            >
              <Text style={{ fontSize: 24 }}>{level.icon}</Text>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: isSelected ? "#14F195" : "#FFFFFF",
                  flex: 1,
                }}
              >
                {level.label}
              </Text>
              {isSelected && (
                <Ionicons name="checkmark-circle" size={24} color="#14F195" />
              )}
            </Pressable>
          );
        })}
      </View>

      {/* CTA Button */}
      <Pressable
        onPress={handleComplete}
        disabled={!selectedLevel}
        style={({ pressed }) => ({
          backgroundColor: selectedLevel ? "#14F195" : "#333333",
          paddingHorizontal: 48,
          paddingVertical: 18,
          borderRadius: 16,
          borderBottomWidth: selectedLevel ? 4 : 0,
          borderBottomColor: "#0ED47A",
          opacity: pressed && selectedLevel ? 0.9 : 1,
          width: "100%",
          maxWidth: 320,
        })}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "800",
            color: selectedLevel ? "#000000" : "#666666",
            textAlign: "center",
          }}
        >
          Start Lesson 1
        </Text>
      </Pressable>
    </View>
  );
}

// Screen 6: Account choice
function AccountChoiceScreen({
  onCreateAccount,
  onContinueAsGuest,
}: {
  onCreateAccount: () => void;
  onContinueAsGuest: () => void;
}) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: layouts.padding * 2,
      }}
    >
      <Image
        source={soliThinking}
        style={{ width: 160, height: 160, marginBottom: 28 }}
        contentFit="contain"
      />

      <Text
        style={{
          fontSize: 28,
          fontWeight: "800",
          color: "#FFFFFF",
          textAlign: "center",
          marginBottom: 10,
        }}
      >
        Save your progress?
      </Text>

      <Text
        style={{
          fontSize: 16,
          color: "#888888",
          textAlign: "center",
          marginBottom: 28,
          maxWidth: 340,
          lineHeight: 22,
        }}
      >
        Create a free account to keep your streak, XP and leaderboard rank. You
        can also continue without an account.
      </Text>

      <View style={{ width: "100%", maxWidth: 320, gap: 12 }}>
        <Pressable
          onPress={onCreateAccount}
          style={({ pressed }) => ({
            backgroundColor: "#14F195",
            paddingVertical: 18,
            borderRadius: 16,
            borderBottomWidth: 4,
            borderBottomColor: "#0ED47A",
            opacity: pressed ? 0.9 : 1,
          })}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "800",
              color: "#000000",
              textAlign: "center",
            }}
          >
            Create account
          </Text>
        </Pressable>

        <Pressable
          onPress={onContinueAsGuest}
          style={({ pressed }) => ({
            backgroundColor: "transparent",
            paddingVertical: 18,
            borderRadius: 16,
            borderWidth: 2,
            borderBottomWidth: 4,
            borderColor: "#1A1A1A",
            opacity: pressed ? 0.9 : 1,
          })}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "800",
              color: "#FFFFFF",
              textAlign: "center",
              textTransform: "uppercase",
            }}
          >
            Maybe later
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

// Main Onboarding Flow
export function OnboardingFlow({
  onCreateAccount,
  onContinueAsGuest,
}: OnboardingFlowProps) {
  const [currentScreen, setCurrentScreen] = useState(0);
  const { width } = useWindowDimensions();

  const screens = [
    <WelcomeScreen key="welcome" onNext={() => setCurrentScreen(1)} />,
    <ProblemScreen key="problem" onNext={() => setCurrentScreen(2)} />,
    <FeaturesScreen key="features" onNext={() => setCurrentScreen(3)} />,
    <ReassuranceScreen key="reassurance" onNext={() => setCurrentScreen(4)} />,
    <PersonalizationScreen key="personalization" onNext={() => setCurrentScreen(5)} />,
    <AccountChoiceScreen
      key="account-choice"
      onCreateAccount={onCreateAccount}
      onContinueAsGuest={onContinueAsGuest}
    />,
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#000000" }}>
      {/* Progress Dots */}
      <View
        style={{
          position: "absolute",
          top: 60,
          left: 0,
          right: 0,
          flexDirection: "row",
          justifyContent: "center",
          gap: 8,
          zIndex: 100,
        }}
      >
        {screens.map((_, index) => (
          <View
            key={index}
            style={{
              width: index === currentScreen ? 24 : 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: index === currentScreen ? "#14F195" : "#333333",
            }}
          />
        ))}
      </View>

      {/* Current Screen */}
      {screens[currentScreen]}

      {/* Skip Button (except last screen) */}
      {currentScreen < screens.length - 1 && (
        <Pressable
          onPress={onContinueAsGuest}
          style={{
            position: "absolute",
            top: 56,
            right: 20,
            paddingVertical: 8,
            paddingHorizontal: 16,
          }}
        >
          <Text style={{ fontSize: 16, color: "#888888", fontWeight: "600" }}>
            Skip
          </Text>
        </Pressable>
      )}
    </View>
  );
}
