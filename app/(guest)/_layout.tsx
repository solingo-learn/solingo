import { Stack } from "expo-router";

import { MainHeader } from "@/components/layouts/main-header";
import { Shell } from "@/components/shell";
import { View } from "@/components/themed";

export default function MainLayout() {
  return (
    <Shell style={{ backgroundColor: "#000000" }}>
      <MainHeader style={{ backgroundColor: "#000000" }} />
      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </Shell>
  );
}
