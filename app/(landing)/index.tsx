import { ScrollView, Pressable, useWindowDimensions, Animated } from "react-native";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import { Image } from "expo-image";

import { Text, View } from "@/components/themed";

const soliLogo = require("@/assets/mascotte/soli-happy.png");

// Animated component for fade-in effect
function FadeInView({ delay = 0, children, style }: { delay?: number; children: React.ReactNode; style?: any }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        delay: delay * 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        delay: delay * 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[style, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      {children}
    </Animated.View>
  );
}

// Hero Section
function Hero() {
  return (
    <View style={{ paddingVertical: 80, paddingHorizontal: 20, alignItems: "center" }}>
      {/* Logo Animation */}
      <FadeInView delay={0}>
        <View style={{ alignItems: "center", marginBottom: 40 }}>
          <Image
            source={soliLogo}
            style={{ width: 120, height: 120, marginBottom: 20 }}
            contentFit="contain"
          />
          <Text style={{ fontSize: 48, fontWeight: "900", color: "#FFFFFF", letterSpacing: -2 }}>
            Solingo
          </Text>
        </View>
      </FadeInView>

      {/* Tagline */}
      <FadeInView delay={0.2}>
        <Text
          style={{
            fontSize: 32,
            fontWeight: "700",
            color: "#FFFFFF",
            textAlign: "center",
            maxWidth: 600,
            lineHeight: 44,
          }}
        >
          Master{" "}
          <Text style={{ color: "#14F195", backgroundColor: "rgba(20, 241, 149, 0.2)", paddingHorizontal: 8, borderRadius: 8 }}>
            Crypto
          </Text>
          {" "}& Solana.
        </Text>
      </FadeInView>

      <FadeInView delay={0.3}>
        <Text
          style={{
            fontSize: 32,
            fontWeight: "700",
            color: "#FFFFFF",
            textAlign: "center",
            maxWidth: 600,
            lineHeight: 44,
            marginTop: 8,
          }}
        >
          Learn{" "}
          <Text style={{ color: "#9945FF" }}>safely</Text>
          , at your pace.
        </Text>
      </FadeInView>

      {/* Subtitle */}
      <FadeInView delay={0.4}>
        <Text
          style={{
            fontSize: 18,
            color: "#888888",
            textAlign: "center",
            maxWidth: 500,
            marginTop: 24,
            lineHeight: 28,
          }}
        >
          The fun and educational way to understand blockchain, tokens, and memecoins — no financial advice, just knowledge.
        </Text>
      </FadeInView>

      {/* CTA Buttons */}
      <FadeInView delay={0.5}>
        <View style={{ flexDirection: "row", gap: 16, marginTop: 40 }}>
          <Pressable
            onPress={() => router.push("/(guest)")}
            style={({ pressed }) => ({
              backgroundColor: "#14F195",
              paddingHorizontal: 32,
              paddingVertical: 16,
              borderRadius: 16,
              borderBottomWidth: 4,
              borderBottomColor: "#0ED47A",
              opacity: pressed ? 0.9 : 1,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            })}
          >
            <Text style={{ fontSize: 18, fontWeight: "800", color: "#000000" }}>
              GET STARTED
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/(guest)")}
            style={({ pressed }) => ({
              backgroundColor: "transparent",
              paddingHorizontal: 32,
              paddingVertical: 16,
              borderRadius: 16,
              borderWidth: 2,
              borderColor: "#333333",
              opacity: pressed ? 0.9 : 1,
            })}
          >
            <Text style={{ fontSize: 18, fontWeight: "700", color: "#9945FF" }}>
              I have an account
            </Text>
          </Pressable>
        </View>
      </FadeInView>
    </View>
  );
}

// Features Section
function Features() {
  const features = [
    {
      emoji: "🎓",
      title: "Learn Crypto Basics",
      description: "Understand blockchain, wallets, and tokens from scratch",
      color: "#14F195",
    },
    {
      emoji: "⚡",
      title: "Discover Solana",
      description: "Explore the fast and low-cost Solana ecosystem",
      color: "#9945FF",
    },
    {
      emoji: "🛡️",
      title: "Stay Safe",
      description: "Learn to identify scams and protect your assets",
      color: "#E74C3C",
    },
    {
      emoji: "🎭",
      title: "Understand Memecoins",
      description: "Critically analyze tokens and their risks",
      color: "#F1C40F",
    },
  ];

  return (
    <View style={{ paddingVertical: 80, paddingHorizontal: 20, backgroundColor: "#0A0A0A" }}>
      <FadeInView delay={0.1}>
        <Text
          style={{
            fontSize: 36,
            fontWeight: "800",
            color: "#FFFFFF",
            textAlign: "center",
            marginBottom: 16,
          }}
        >
          What you'll <Text style={{ color: "#14F195" }}>learn</Text>
        </Text>
      </FadeInView>

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 24,
          marginTop: 48,
          maxWidth: 1000,
          alignSelf: "center",
        }}
      >
        {features.map((feature, index) => (
          <FadeInView key={feature.title} delay={0.2 + index * 0.1}>
            <View
              style={{
                backgroundColor: "#111111",
                borderRadius: 24,
                padding: 32,
                width: 280,
                borderWidth: 1,
                borderColor: "#222222",
              }}
            >
              <Text style={{ fontSize: 48, marginBottom: 16 }}>{feature.emoji}</Text>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "700",
                  color: "#FFFFFF",
                  marginBottom: 8,
                }}
              >
                {feature.title}
              </Text>
              <Text style={{ fontSize: 16, color: "#888888", lineHeight: 24 }}>
                {feature.description}
              </Text>
              <View
                style={{
                  width: 40,
                  height: 4,
                  backgroundColor: feature.color,
                  borderRadius: 2,
                  marginTop: 16,
                }}
              />
            </View>
          </FadeInView>
        ))}
      </View>
    </View>
  );
}

// Metrics Section
function Metrics() {
  const metrics = [
    { number: "25", suffix: "+", label: "Interactive Lessons", color: "#14F195" },
    { number: "100", suffix: "+", label: "Exercises", color: "#9945FF" },
    { number: "5", suffix: "", label: "Chapters", color: "#F1C40F" },
    { number: "0", suffix: "$", label: "Cost to Start", color: "#3498DB" },
  ];

  return (
    <View style={{ paddingVertical: 80, paddingHorizontal: 20 }}>
      <FadeInView delay={0.1}>
        <Text
          style={{
            fontSize: 36,
            fontWeight: "800",
            color: "#FFFFFF",
            textAlign: "center",
            marginBottom: 48,
          }}
        >
          <Text style={{ color: "#9945FF" }}>Solingo</Text> by the numbers
        </Text>
      </FadeInView>

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 32,
          maxWidth: 800,
          alignSelf: "center",
        }}
      >
        {metrics.map((metric, index) => (
          <FadeInView key={metric.label} delay={0.2 + index * 0.15}>
            <View
              style={{
                alignItems: "center",
                width: 160,
              }}
            >
              <View
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  backgroundColor: metric.color,
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <Text style={{ fontSize: 36, fontWeight: "900", color: "#000000" }}>
                  {metric.number}
                  <Text style={{ fontSize: 24 }}>{metric.suffix}</Text>
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#FFFFFF",
                  textAlign: "center",
                }}
              >
                {metric.label}
              </Text>
            </View>
          </FadeInView>
        ))}
      </View>
    </View>
  );
}

// Reasons Section
function Reasons() {
  const reasons = [
    {
      text: "Learn 5x faster with gamification",
      icon: "⚡",
      bg: "rgba(20, 241, 149, 0.15)",
      border: "#14F195",
    },
    {
      text: "No financial advice, just education",
      icon: "🛡️",
      bg: "rgba(153, 69, 255, 0.15)",
      border: "#9945FF",
    },
    {
      text: "Understand risks before you explore",
      icon: "🎯",
      bg: "rgba(241, 196, 15, 0.15)",
      border: "#F1C40F",
    },
    {
      text: "Progress at your own pace",
      icon: "🚀",
      bg: "rgba(52, 152, 219, 0.15)",
      border: "#3498DB",
    },
  ];

  return (
    <View style={{ paddingVertical: 80, paddingHorizontal: 20, backgroundColor: "#0A0A0A" }}>
      <FadeInView delay={0.1}>
        <Text
          style={{
            fontSize: 36,
            fontWeight: "800",
            color: "#FFFFFF",
            textAlign: "center",
            marginBottom: 48,
          }}
        >
          The <Text style={{ color: "#14F195" }}>future</Text> of learning
        </Text>
      </FadeInView>

      <View style={{ maxWidth: 700, alignSelf: "center", gap: 16 }}>
        {reasons.map((reason, index) => (
          <FadeInView key={reason.text} delay={0.2 + index * 0.1}>
            <View
              style={{
                backgroundColor: reason.bg,
                borderRadius: 20,
                padding: 24,
                flexDirection: "row",
                alignItems: "center",
                gap: 16,
                borderLeftWidth: 4,
                borderLeftColor: reason.border,
              }}
            >
              <Text style={{ fontSize: 32 }}>{reason.icon}</Text>
              <Text style={{ fontSize: 20, fontWeight: "600", color: "#FFFFFF", flex: 1 }}>
                {reason.text}
              </Text>
            </View>
          </FadeInView>
        ))}
      </View>
    </View>
  );
}

// Footer CTA
function FooterCTA() {
  return (
    <View style={{ paddingVertical: 100, paddingHorizontal: 20, alignItems: "center" }}>
      <FadeInView delay={0.1}>
        <View
          style={{
            backgroundColor: "#111111",
            borderRadius: 32,
            padding: 48,
            alignItems: "center",
            maxWidth: 600,
            borderWidth: 1,
            borderColor: "#222222",
          }}
        >
          <Image
            source={soliLogo}
            style={{ width: 80, height: 80, marginBottom: 24 }}
            contentFit="contain"
          />
          <Text
            style={{
              fontSize: 32,
              fontWeight: "800",
              color: "#FFFFFF",
              textAlign: "center",
              marginBottom: 16,
            }}
          >
            Start your crypto journey
          </Text>
          <Text
            style={{
              fontSize: 18,
              color: "#888888",
              textAlign: "center",
              marginBottom: 32,
            }}
          >
            Join thousands of learners discovering the world of blockchain safely
          </Text>

          <Pressable
            onPress={() => router.push("/(guest)")}
            style={({ pressed }) => ({
              backgroundColor: "#14F195",
              paddingHorizontal: 48,
              paddingVertical: 20,
              borderRadius: 20,
              borderBottomWidth: 4,
              borderBottomColor: "#0ED47A",
              opacity: pressed ? 0.9 : 1,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            })}
          >
            <Text style={{ fontSize: 20, fontWeight: "800", color: "#000000" }}>
              START FREE
            </Text>
          </Pressable>
        </View>
      </FadeInView>

      {/* Footer */}
      <View style={{ marginTop: 80, alignItems: "center" }}>
        <Text style={{ fontSize: 14, color: "#666666", textAlign: "center" }}>
          © 2025 Solingo — Learn crypto responsibly
        </Text>
        <Text style={{ fontSize: 24, marginTop: 16 }}>🦎</Text>
      </View>
    </View>
  );
}

// Main Landing Page
export default function LandingPage() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#000000" }}
      contentContainerStyle={{ minHeight: "100%" }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 24,
          paddingVertical: 16,
          backgroundColor: "rgba(0,0,0,0.8)",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Image source={soliLogo} style={{ width: 40, height: 40 }} contentFit="contain" />
          <Text style={{ fontSize: 24, fontWeight: "800", color: "#FFFFFF" }}>Solingo</Text>
        </View>

        <Pressable
          onPress={() => router.push("/(guest)")}
          style={({ pressed }) => ({
            backgroundColor: "transparent",
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 12,
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Text style={{ fontSize: 16, fontWeight: "600", color: "#9945FF" }}>Login</Text>
        </Pressable>
      </View>

      {/* Background gradient effect */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          width: 600,
          height: 600,
          borderRadius: 300,
          backgroundColor: "rgba(153, 69, 255, 0.1)",
          transform: [{ translateX: -300 }],
          filter: "blur(100px)",
        }}
      />

      <View style={{ paddingTop: 80 }}>
        <Hero />
        <Features />
        <Metrics />
        <Reasons />
        <FooterCTA />
      </View>
    </ScrollView>
  );
}
