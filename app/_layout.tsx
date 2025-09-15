import { useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";

import { StatusBar } from "@/components/status-bar";
import { AuthProvider } from "@/context/auth";
import { BreakpointsProvider } from "@/context/breakpoints";
import { CourseProvider } from "@/context/course";
import { LanguageCodeProvider } from "@/context/language";
import { LivesProvider } from "@/context/lives";
import { UserStatsProvider } from "@/context/user-stats";
import { ProtectedRouteProvider } from "@/context/protected-route";
import { ThemeProvider } from "@/context/theme";
import { initializeNotifications } from "@/lib/notifications";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(guest)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Loading screen component with logo on black background
function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <Image
        source={require("../assets/images/logoappli.png")}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 200,
  },
});

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      // Initialize notifications after app loads
      initializeNotifications().catch(console.error);
    }
  }, [loaded]);

  if (!loaded) {
    return <LoadingScreen />;
  }

  return (
    <ThemeProvider>
      <BreakpointsProvider>
        <AuthProvider>
          <LivesProvider>
            <UserStatsProvider>
              <LanguageCodeProvider>
                <CourseProvider>
                  <ProtectedRouteProvider>
                    <Stack screenOptions={{ headerShown: false }} />
                    <StatusBar />
                  </ProtectedRouteProvider>
                </CourseProvider>
              </LanguageCodeProvider>
            </UserStatsProvider>
          </LivesProvider>
        </AuthProvider>
      </BreakpointsProvider>
    </ThemeProvider>
  );
}
