import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function LandingLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#000000" },
          animation: "fade",
        }}
      />
    </>
  );
}
