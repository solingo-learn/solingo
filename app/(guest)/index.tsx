import { useState, useEffect, useCallback } from "react";
import { Image } from "expo-image";
import { router } from "expo-router";
import { ScrollView, useWindowDimensions, Platform, Alert, Pressable, TextInput, Linking, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import * as AppleAuthentication from "expo-apple-authentication";

import { Metadata } from "@/components/metadata";
import { Text, View } from "@/components/themed";
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";
import { layouts } from "@/constants/layouts";
import { useAuth } from "@/context/auth";
import { useCourse } from "@/context/course";
import { DEFAULT_LANGUAGE_CODE } from "@/constants/default";
import { supabase } from "@/lib/supabase";

const soliIcon = require("@/assets/mascotte/soli-happy.png");
const splashLogo = require("@/assets/images/splash.png");
const googleLogo = require("@/assets/images/google.png");

// Couleurs unifiées
const COLORS = {
  // User request: uniform black background (no gray panels)
  background: "#000000",
  card: "#000000",
  cardBorder: "#1A1A1A",
  inputBg: "#000000",
  inputBorder: "#1A1A1A",
  accent: "#9945FF",
  accentDark: "#7B35D9",
  green: "#14F195",
  greenDark: "#0FC87A",
  textPrimary: "#FFFFFF",
  textSecondary: "#8E8E93",
  textMuted: "#636366",
};

export default function Home() {
  const screen = useWindowDimensions();
  const { user, signIn, signUp, signInWithGoogle, signInWithApple, loading } = useAuth();
  const { setCourseId } = useCourse();
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);
  const [appleAvailable, setAppleAvailable] = useState(false);
  const [isProcessingOAuth, setIsProcessingOAuth] = useState(false);
  
  // Form fields
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Handle OAuth callback on web (when returning from Google/Apple)
  useEffect(() => {
    if (Platform.OS === "web" && supabase) {
      const handleOAuthCallback = async () => {
        // Check if there are auth params in URL (hash fragment from OAuth)
        if (typeof window !== "undefined") {
          const hash = window.location.hash;
          const search = window.location.search;
          
          // Check for OAuth tokens in URL
          if (hash.includes("access_token") || search.includes("code=")) {
            setIsProcessingOAuth(true);
            console.log("Detected OAuth callback, processing...");
            
            try {
              // Supabase will automatically handle the session from URL
              // Just need to wait for the auth state to update
              const { data: { session }, error } = await supabase.auth.getSession();
              
              if (error) {
                console.error("OAuth callback error:", error);
                Alert.alert("Erreur", "Échec de la connexion. Veuillez réessayer.");
              } else if (session) {
                console.log("OAuth session established successfully");
                // Mark onboarding as complete for OAuth users
                await AsyncStorage.setItem("onboarding_completed", "true");
                setShowOnboarding(false);
                // Clean URL (remove hash/params)
                window.history.replaceState({}, document.title, window.location.pathname);
              }
            } catch (err) {
              console.error("Error processing OAuth callback:", err);
            } finally {
              setIsProcessingOAuth(false);
            }
          }
        }
      };
      
      handleOAuthCallback();
    }
  }, []);

  // Check if onboarding has been completed on mount
  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        // Show onboarding for first-time users (both mobile and web)
        const completed = await AsyncStorage.getItem("onboarding_completed");
        console.log("Onboarding check - completed:", completed);
        setShowOnboarding(completed !== "true");
      } catch (error) {
        console.error("Error checking onboarding:", error);
        setShowOnboarding(false);
      }
    };
    checkOnboarding();
  }, []);

  // Re-check onboarding when screen gains focus (e.g. after signOut)
  useFocusEffect(
    useCallback(() => {
      const recheckOnboarding = async () => {
        const completed = await AsyncStorage.getItem("onboarding_completed");
        setShowOnboarding(completed !== "true");
      };
      recheckOnboarding();
    }, [])
  );

  // Check Apple Sign In availability (iOS native app only, NOT on web)
  useEffect(() => {
    // Apple Sign In uniquement sur iOS natif, jamais sur le web
    setAppleAvailable(Platform.OS === "ios");
  }, []);

  // Redirect if already signed in
  useEffect(() => {
    // Important: don't skip onboarding just because a session was restored
    // (e.g. simulator keychain / persisted auth). Only redirect after onboarding is completed.
    if (user && !loading && showOnboarding === false && !isProcessingOAuth) {
      setCourseId(DEFAULT_LANGUAGE_CODE);
      router.replace("/learn");
    }
  }, [user, loading, showOnboarding, isProcessingOAuth]);

  const handleOnboardingComplete = async () => {
    await AsyncStorage.setItem("onboarding_completed", "true");
    setShowOnboarding(false);
  };

  const handleContinueAsGuest = async () => {
    await AsyncStorage.setItem("onboarding_completed", "true");
    setShowOnboarding(false);
    // Give access to course screens (leaderboards/profile) without an account
    setCourseId(DEFAULT_LANGUAGE_CODE);
    router.replace("/learn");
  };

  const handleCreateAccountFromOnboarding = async () => {
    await AsyncStorage.setItem("onboarding_completed", "true");
    setShowOnboarding(false);
    setMode("signup");
  };

  const handleGoogleAuth = async () => {
    try {
      setIsProcessingOAuth(true);
      await signInWithGoogle();
      // On web, this will redirect the page, so no need to navigate
      // On mobile, the flow will complete and we can navigate
      if (Platform.OS !== "web") {
        setCourseId(DEFAULT_LANGUAGE_CODE);
        router.push("/learn");
      }
    } catch (error: any) {
      setIsProcessingOAuth(false);
      if (error.message !== "Sign in cancelled") {
        Alert.alert("Erreur", error.message || "Échec de la connexion Google");
      }
    }
  };

  const handleAppleAuth = async () => {
    try {
      await signInWithApple();
      setCourseId(DEFAULT_LANGUAGE_CODE);
      router.push("/learn");
    } catch (error: any) {
      if (error.message !== "Sign in cancelled") {
        Alert.alert("Erreur", error.message || "Échec de la connexion Apple");
      }
    }
  };

  const handleEmailAuth = async () => {
    try {
      const safeEmail = email.trim();
      const safePassword = password;
      if (!safeEmail || !safePassword) {
        Alert.alert("Erreur", "Email et mot de passe requis.");
        return;
      }

      if (mode === "signin") {
        await signIn(safeEmail, safePassword);
      } else {
        const safeUsername = username.trim();
        if (!safeUsername) {
          Alert.alert("Erreur", "Nom d'utilisateur requis.");
          return;
        }
        await signUp(safeEmail, safePassword, safeUsername);
      }

      setCourseId(DEFAULT_LANGUAGE_CODE);
      router.push("/learn");
    } catch (error: any) {
      Alert.alert("Erreur", error?.message || "Échec de l'authentification");
    }
  };

  // Show loading while checking onboarding status or processing OAuth
  if (showOnboarding === null || isProcessingOAuth) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.background, justifyContent: "center", alignItems: "center" }}>
        <Image
          source={soliIcon}
          style={{ width: 100, height: 100, marginBottom: 20 }}
          contentFit="contain"
        />
        {isProcessingOAuth && (
          <>
            <ActivityIndicator size="large" color={COLORS.accent} style={{ marginTop: 20 }} />
            <Text style={{ color: COLORS.textSecondary, marginTop: 16, fontSize: 16 }}>
              Connexion en cours...
            </Text>
          </>
        )}
      </View>
    );
  }

  // Show onboarding if not completed
  if (showOnboarding) {
    return (
      <OnboardingFlow
        onCreateAccount={handleCreateAccountFromOnboarding}
        onContinueAsGuest={handleContinueAsGuest}
      />
    );
  }

  // Main auth screen - Duolingo style dark theme
  return (
    <>
      <Metadata />
      <View style={{ flex: 1, backgroundColor: COLORS.background }}>
        <ScrollView
          contentContainerStyle={{
            minHeight: screen.height,
            justifyContent: "center",
            padding: layouts.padding * 2,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ maxWidth: 400, width: "100%", alignSelf: "center" }}>
            {/* Logo */}
            <View style={{ alignItems: "center", marginBottom: 32 }}>
              <Image
                source={splashLogo}
                contentFit="contain"
                style={{ width: 180, height: 60, marginBottom: 16 }}
              />
              <Text
                style={{
                  fontSize: 14,
                  textAlign: "center",
                  color: COLORS.textSecondary,
                }}
              >
                Learn crypto, Solana & memecoins safely
              </Text>
            </View>

            {/* Title */}
            <Text
              style={{
                fontSize: 24,
                fontWeight: "800",
                color: COLORS.textPrimary,
                textAlign: "center",
                marginBottom: 24,
              }}
            >
              {mode === "signin" ? "Log in" : "Create your profile"}
            </Text>

            {/* Form Fields */}
            <View style={{ gap: 12, marginBottom: 20 }}>
              {/* Username field - only for signup */}
              {mode === "signup" && (
                <TextInput
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Username"
                  placeholderTextColor={COLORS.textMuted}
                  style={{
                    backgroundColor: COLORS.inputBg,
                    borderWidth: 2,
                    borderColor: COLORS.inputBorder,
                    borderRadius: 16,
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    fontSize: 16,
                    color: COLORS.textPrimary,
                  }}
                />
              )}

              {/* Email field */}
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder={mode === "signin" ? "Email or username" : "Email"}
                placeholderTextColor={COLORS.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                style={{
                  backgroundColor: COLORS.inputBg,
                  borderWidth: 2,
                  borderColor: COLORS.inputBorder,
                  borderRadius: 16,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  fontSize: 16,
                  color: COLORS.textPrimary,
                }}
              />

              {/* Password field */}
              <View style={{ position: "relative" }}>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Password"
                  placeholderTextColor={COLORS.textMuted}
                  secureTextEntry={!showPassword}
                  style={{
                    backgroundColor: COLORS.inputBg,
                    borderWidth: 2,
                    borderColor: COLORS.inputBorder,
                    borderRadius: 16,
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    paddingRight: 50,
                    fontSize: 16,
                    color: COLORS.textPrimary,
                  }}
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: 16,
                    top: 0,
                    bottom: 0,
                    justifyContent: "center",
                  }}
                >
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={22}
                    color={COLORS.textMuted}
                  />
                </Pressable>
              </View>

              {/* Forgot password - only for signin */}
              {mode === "signin" && (
                <Pressable style={{ alignSelf: "flex-end" }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "700",
                      color: COLORS.accent,
                      textTransform: "uppercase",
                    }}
                  >
                    Forgot?
                  </Text>
                </Pressable>
              )}
            </View>

            {/* Main Action Button */}
            <Pressable
              onPress={handleEmailAuth}
              style={({ pressed }) => ({
                backgroundColor: mode === "signup" ? COLORS.green : COLORS.accent,
                paddingVertical: 16,
                borderRadius: 16,
                borderBottomWidth: 4,
                borderBottomColor: mode === "signup" ? COLORS.greenDark : COLORS.accentDark,
                opacity: pressed ? 0.9 : 1,
                marginBottom: 20,
              })}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "800",
                  fontSize: 16,
                  color: mode === "signup" ? "#000000" : "#FFFFFF",
                  textTransform: "uppercase",
                }}
              >
                {mode === "signin" ? "Log in" : "Create account"}
              </Text>
            </Pressable>

            {/* Divider */}
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
              <View style={{ flex: 1, height: 2, backgroundColor: COLORS.cardBorder }} />
              <Text
                style={{
                  paddingHorizontal: 16,
                  color: COLORS.textMuted,
                  fontSize: 14,
                  fontWeight: "700",
                  textTransform: "uppercase",
                }}
              >
                or
              </Text>
              <View style={{ flex: 1, height: 2, backgroundColor: COLORS.cardBorder }} />
            </View>

            {/* Social Login Buttons */}
            <View style={{ flexDirection: "row", gap: 12, marginBottom: 20 }}>
              {/* Apple (iOS) */}
              {appleAvailable && (
                <View style={{ flex: 1 }}>
                  <AppleAuthentication.AppleAuthenticationButton
                    buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                    buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE_OUTLINE}
                    cornerRadius={16}
                    style={{ width: "100%", height: 48 }}
                    onPress={handleAppleAuth}
                  />
                </View>
              )}
              {/* Google */}
              <Pressable
                onPress={handleGoogleAuth}
                style={({ pressed }) => ({
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  backgroundColor: COLORS.background,
                  paddingVertical: 14,
                  borderRadius: 16,
                  borderWidth: 2,
                  borderBottomWidth: 4,
                  borderColor: COLORS.cardBorder,
                  opacity: pressed ? 0.9 : 1,
                })}
              >
                <Image source={googleLogo} style={{ width: 22, height: 22 }} contentFit="contain" />
                <Text style={{ fontSize: 14, fontWeight: "700", color: COLORS.textPrimary }}>
                  Google
                </Text>
              </Pressable>
            </View>

            {/* Terms */}
            <Text
              style={{
                fontSize: 12,
                textAlign: "center",
                color: COLORS.textMuted,
                lineHeight: 18,
                marginBottom: 16,
              }}
            >
              By signing in to Solingo, you agree to our{" "}
              <Text 
                onPress={() => Linking.openURL("https://solingo.fun/terms")}
                style={{ fontWeight: "700", color: COLORS.accent, textDecorationLine: "underline" }}
              >
                Terms
              </Text>{" "}and{" "}
              <Text 
                onPress={() => Linking.openURL("https://solingo.fun/privacy")}
                style={{ fontWeight: "700", color: COLORS.accent, textDecorationLine: "underline" }}
              >
                Privacy Policy
              </Text>.
            </Text>

            {/* Toggle Sign In / Sign Up */}
            <View style={{ flexDirection: "row", justifyContent: "center", gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: COLORS.textSecondary }}>
                {mode === "signin" ? "Don't have an account?" : "Have an account?"}
              </Text>
              <Pressable onPress={() => setMode(mode === "signin" ? "signup" : "signin")}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "700",
                    color: COLORS.accent,
                    textTransform: "uppercase",
                  }}
                >
                  {mode === "signin" ? "Sign up" : "Log in"}
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
}
