import { router } from "expo-router";
import { Pressable, ScrollView, Linking } from "react-native";

import { Metadata } from "@/components/metadata";
import { Text, View } from "@/components/themed";
import { layouts } from "@/constants/layouts";
import { useCourse } from "@/context/course";
import { DEFAULT_COURSE_ID } from "@/constants/default";

export default function Register() {
  const { setCourseId } = useCourse();

  return (
    <>
      <Metadata title="Get started" />
      <View style={{ flex: 1, backgroundColor: "#000000" }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
          <View style={{ padding: layouts.padding * 2, gap: 12, alignItems: "center" }}>
            <Text style={{ fontSize: 32, fontWeight: "900", textAlign: "center", color: "#FFFFFF" }}>
              Learn Solana
            </Text>
            <Text style={{ fontSize: 14, textAlign: "center", color: "#8E8E93", maxWidth: 420, lineHeight: 20 }}>
              Solingo is an English-only app focused on Solana and crypto fundamentals.
            </Text>

            <Pressable
              onPress={() => {
                setCourseId(DEFAULT_COURSE_ID);
                router.replace("/learn");
              }}
              style={({ pressed }) => ({
                marginTop: 16,
                width: "100%",
                maxWidth: 360,
                backgroundColor: "#14F195",
                paddingVertical: 16,
                borderRadius: 16,
                borderBottomWidth: 4,
                borderBottomColor: "#0ED47A",
                opacity: pressed ? 0.9 : 1,
              })}
            >
              <Text style={{ textAlign: "center", fontWeight: "900", fontSize: 16, color: "#000000", textTransform: "uppercase" }}>
                Start learning
              </Text>
            </Pressable>

            {/* Terms & Privacy Links */}
            <Text
              style={{
                fontSize: 12,
                textAlign: "center",
                color: "#636366",
                lineHeight: 18,
                marginTop: 24,
                maxWidth: 360,
              }}
            >
              By continuing, you agree to our{" "}
              <Text 
                onPress={() => Linking.openURL("https://solingo.fun/terms")}
                style={{ fontWeight: "700", color: "#9945FF", textDecorationLine: "underline" }}
              >
                Terms of Use
              </Text>{" "}and{" "}
              <Text 
                onPress={() => Linking.openURL("https://solingo.fun/privacy")}
                style={{ fontWeight: "700", color: "#9945FF", textDecorationLine: "underline" }}
              >
                Privacy Policy
              </Text>.
            </Text>
          </View>
        </ScrollView>
      </View>
    </>
  );
}
