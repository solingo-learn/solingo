import { useEffect, useMemo, useState } from "react";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  useWindowDimensions,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Metadata } from "@/components/metadata";
import { Text, View } from "@/components/themed";
import { layouts } from "@/constants/layouts";
import { useAuth } from "@/context/auth";
import { isSupabaseConfigured } from "@/lib/supabase";

// Images
const splashLogo = require("@/assets/images/splash.png");
const googleLogo = require("@/assets/images/google.png");

const COLORS = {
  background: "#FFFFFF",
  backgroundDark: "#000000",
  cardBorder: "#E5E5E5",
  cardBorderDark: "#2A2A2A",
  inputBg: "#F7F7F7",
  inputBgDark: "#000000",
  inputBorder: "#E5E5E5",
  inputBorderDark: "#2A2A2A",
  accent: "#1CB0F6",
  accentDark: "#1899D6",
  green: "#58CC02",
  greenDark: "#58A700",
  textPrimary: "#3C3C3C",
  textPrimaryDark: "#FFFFFF",
  textSecondary: "#AFAFAF",
  textMuted: "#CDCDCD",
};

type AuthMode = "signin" | "signup";

export default function AuthScreen() {
  const screen = useWindowDimensions();
  const params = useLocalSearchParams<{ mode?: string }>();
  const initialMode = useMemo<AuthMode>(() => {
    return params.mode === "signin" ? "signin" : "signup";
  }, [params.mode]);

  const { user, loading, signIn, signUp, signInWithGoogle, signInWithApple } = useAuth();

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isWeb = Platform.OS === "web";

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    if (user && !loading) {
      router.replace("/learn");
    }
  }, [user, loading]);

  const handlePrimary = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const safeEmail = email.trim();
      const safePassword = password;
      if (!safeEmail || !safePassword) {
        Alert.alert("Error", "Email and password are required.");
        return;
      }

      if (mode === "signin") {
        await signIn(safeEmail, safePassword);
      } else {
        const safeUsername = username.trim();
        if (!safeUsername) {
          Alert.alert("Error", "Username is required.");
          return;
        }
        await signUp(
          safeEmail,
          safePassword,
          safeUsername
        );
      }
      router.replace("/learn");
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Authentication failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await signInWithGoogle();
      router.replace("/learn");
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Failed to sign in with Google");
    } finally {
      setSubmitting(false);
    }
  };

  const handleApple = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await signInWithApple();
      router.replace("/learn");
    } catch (e: any) {
      // Don't show alert if user cancelled
      if (e?.message !== "Sign in cancelled") {
        Alert.alert("Error", e?.message || "Failed to sign in with Apple");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <>
      <Metadata title={mode === "signin" ? "Log in" : "Create your profile"} />
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.backgroundDark,
          position: isWeb ? "absolute" : "relative",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1000,
        }}
      >
        {/* Header */}
        <View
          style={{
            paddingTop: isWeb ? 20 : 50,
            paddingHorizontal: layouts.padding * 1.5,
            paddingBottom: 12,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: COLORS.backgroundDark,
          }}
        >
          {/* Close Button */}
          <Pressable
            onPress={handleClose}
            style={{
              padding: 8,
            }}
          >
            <Ionicons name="close" size={28} color={COLORS.textSecondary} />
          </Pressable>

          {/* Toggle Mode Button */}
          <Pressable
            onPress={() => setMode(mode === "signin" ? "signup" : "signin")}
            style={({ pressed }) => ({
              opacity: pressed ? 0.85 : 1,
              borderRadius: 16,
              borderWidth: 2,
              borderBottomWidth: 4,
              borderColor: COLORS.cardBorderDark,
              paddingHorizontal: 16,
              paddingVertical: 10,
            })}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: "800",
                color: COLORS.accent,
                textTransform: "uppercase",
              }}
            >
              {mode === "signin" ? "Sign up" : "Login"}
            </Text>
          </Pressable>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              padding: layouts.padding * 2,
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={{ maxWidth: 400, width: "100%", alignSelf: "center" }}>
              {/* Title */}
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: "800",
                  color: COLORS.textPrimaryDark,
                  textAlign: "center",
                  marginBottom: 8,
                }}
              >
                {mode === "signin" ? "Log in" : "Create your profile"}
              </Text>

              {/* Auth mode indicator */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 24,
                }}
              >
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: isSupabaseConfigured ? "#58CC02" : "#FFB020",
                  }}
                />
                <Text
                  style={{
                    fontSize: 12,
                    color: COLORS.textSecondary,
                  }}
                >
                  {isSupabaseConfigured ? "Connected to Supabase" : "Demo mode (local storage)"}
                </Text>
              </View>

              {/* Form Fields */}
              <View style={{ gap: 12, marginBottom: 20 }}>
                {/* Username field - only for signup */}
                {mode === "signup" && (
                  <TextInput
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Username"
                    placeholderTextColor={COLORS.textSecondary}
                    style={{
                      backgroundColor: COLORS.inputBgDark,
                      borderWidth: 2,
                      borderColor: COLORS.inputBorderDark,
                      borderRadius: 16,
                      paddingHorizontal: 16,
                      paddingVertical: 16,
                      fontSize: 16,
                      color: COLORS.textPrimaryDark,
                    }}
                  />
                )}

                {/* Email field */}
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder={mode === "signin" ? "Email or username (optional)" : "Email (optional)"}
                  placeholderTextColor={COLORS.textSecondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={{
                    backgroundColor: COLORS.inputBgDark,
                    borderWidth: 2,
                    borderColor: COLORS.inputBorderDark,
                    borderRadius: 16,
                    paddingHorizontal: 16,
                    paddingVertical: 16,
                    fontSize: 16,
                    color: COLORS.textPrimaryDark,
                  }}
                />

                {/* Password field */}
                <View style={{ position: "relative" }}>
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Password (optional)"
                    placeholderTextColor={COLORS.textSecondary}
                    secureTextEntry={!showPassword}
                    style={{
                      backgroundColor: COLORS.inputBgDark,
                      borderWidth: 2,
                      borderColor: COLORS.inputBorderDark,
                      borderRadius: 16,
                      paddingHorizontal: 16,
                      paddingVertical: 16,
                      paddingRight: mode === "signin" ? 90 : 52,
                      fontSize: 16,
                      color: COLORS.textPrimaryDark,
                    }}
                  />
                  <View
                    style={{
                      position: "absolute",
                      right: 12,
                      top: 0,
                      bottom: 0,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    {mode === "signin" && (
                      <Pressable>
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: "800",
                            color: COLORS.textSecondary,
                            textTransform: "uppercase",
                          }}
                        >
                          Forgot?
                        </Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              </View>

              {/* Main Action Button */}
              <Pressable
                onPress={handlePrimary}
                disabled={submitting}
                style={({ pressed }) => ({
                  backgroundColor: COLORS.accent,
                  paddingVertical: 16,
                  borderRadius: 16,
                  borderBottomWidth: 4,
                  borderBottomColor: COLORS.accentDark,
                  opacity: pressed || submitting ? 0.9 : 1,
                  marginBottom: 24,
                })}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontWeight: "800",
                    fontSize: 15,
                    color: "#FFFFFF",
                    textTransform: "uppercase",
                  }}
                >
                  {mode === "signin" ? "Log in" : "Create account"}
                </Text>
              </Pressable>

              {/* Divider */}
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 24 }}>
                <View style={{ flex: 1, height: 2, backgroundColor: COLORS.cardBorderDark }} />
                <Text
                  style={{
                    paddingHorizontal: 16,
                    color: COLORS.textSecondary,
                    fontSize: 14,
                    fontWeight: "700",
                    textTransform: "uppercase",
                  }}
                >
                  or
                </Text>
                <View style={{ flex: 1, height: 2, backgroundColor: COLORS.cardBorderDark }} />
              </View>

              {/* Social Login Buttons */}
              <View style={{ gap: 12, marginBottom: 24 }}>
                {/* Google */}
                <Pressable
                  onPress={handleGoogle}
                  disabled={submitting}
                  style={({ pressed }) => ({
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    backgroundColor: COLORS.backgroundDark,
                    paddingVertical: 14,
                    borderRadius: 16,
                    borderWidth: 2,
                    borderBottomWidth: 4,
                    borderColor: COLORS.cardBorderDark,
                    opacity: pressed || submitting ? 0.9 : 1,
                  })}
                >
                  <Image
                    source={googleLogo}
                    style={{ width: 24, height: 24 }}
                    contentFit="contain"
                  />
                  <Text style={{ fontSize: 15, fontWeight: "700", color: COLORS.textPrimaryDark }}>
                    Continue with Google
                  </Text>
                </Pressable>

                {/* Apple - Show on iOS and Web */}
                {(Platform.OS === "ios" || Platform.OS === "web") && (
                  <Pressable
                    onPress={handleApple}
                    disabled={submitting}
                    style={({ pressed }) => ({
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 10,
                      backgroundColor: "#FFFFFF",
                      paddingVertical: 14,
                      borderRadius: 16,
                      borderWidth: 2,
                      borderBottomWidth: 4,
                      borderColor: "#E5E5E5",
                      opacity: pressed || submitting ? 0.9 : 1,
                    })}
                  >
                    <Ionicons name="logo-apple" size={24} color="#000000" />
                    <Text style={{ fontSize: 15, fontWeight: "700", color: "#000000" }}>
                      Continue with Apple
                    </Text>
                  </Pressable>
                )}
              </View>

              {/* Terms */}
              <Text
                style={{
                  fontSize: 12,
                  textAlign: "center",
                  color: COLORS.textSecondary,
                  lineHeight: 20,
                  marginBottom: 8,
                }}
              >
                By signing in to Solingo, you agree to our{" "}
                <Text style={{ fontWeight: "700" }}>Terms</Text> and{" "}
                <Text style={{ fontWeight: "700" }}>Privacy Policy</Text>.
              </Text>

              <Text
                style={{
                  fontSize: 12,
                  textAlign: "center",
                  color: COLORS.textSecondary,
                  lineHeight: 20,
                }}
              >
                This site is protected by reCAPTCHA Enterprise and the Google{" "}
                <Text style={{ fontWeight: "700" }}>Privacy Policy</Text> and{" "}
                <Text style={{ fontWeight: "700" }}>Terms of Service</Text> apply.
              </Text>

              {/* Mobile toggle link */}
              {!isWeb && (
                <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 24, gap: 8 }}>
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
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </>
  );
}
