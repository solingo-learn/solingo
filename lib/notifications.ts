import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Web doesn't support expo-notifications - skip all notification code
const isWeb = Platform.OS === "web";

// Only import notifications on native platforms
let Notifications: typeof import("expo-notifications") | null = null;
let Device: typeof import("expo-device") | null = null;

if (!isWeb) {
  Notifications = require("expo-notifications");
  Device = require("expo-device");
  
  // Configure how notifications are handled when app is in foreground
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

// Storage keys
const NOTIFICATION_PERMISSION_KEY = "@solingo_notification_permission";
const PUSH_TOKEN_KEY = "@solingo_push_token";

/**
 * Request notification permissions from the user
 * Returns true if permission was granted
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  // Skip on web
  if (isWeb || !Notifications || !Device) {
    console.log("Notifications not supported on web");
    return false;
  }

  // On simulators/emulators: local notifications can work, but push tokens won't.
  if (!Device.isDevice) {
    console.log("Running on simulator: push notifications require a physical device, local notifications can still be tested.");
  }

  // Check current permission status
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // If not determined, ask for permission
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  // Save permission status
  await AsyncStorage.setItem(NOTIFICATION_PERMISSION_KEY, finalStatus);

  if (finalStatus !== "granted") {
    console.log("Notification permission not granted");
    return false;
  }

  // Get and store push token for iOS
  if (Platform.OS === "ios" && Device.isDevice) {
    await registerForPushNotificationsAsync();
  }

  // Set up Android notification channel
  if (Platform.OS === "android") {
    await setupAndroidNotificationChannel();
  }

  return true;
}

/**
 * Register for push notifications and get the token
 */
async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (isWeb || !Notifications || !Device?.isDevice) return null;
  
  try {
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    await AsyncStorage.setItem(PUSH_TOKEN_KEY, token);
    console.log("Push token:", token);
    return token;
  } catch (error) {
    console.error("Error getting push token:", error);
    return null;
  }
}

/**
 * Set up Android notification channel (required for Android 8+)
 */
async function setupAndroidNotificationChannel(): Promise<void> {
  if (isWeb || !Notifications) return;
  
  await Notifications.setNotificationChannelAsync("default", {
    name: "Solingo Reminders",
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#9945FF",
    sound: "default",
  });

  await Notifications.setNotificationChannelAsync("hearts", {
    name: "Hearts Restored",
    importance: Notifications.AndroidImportance.DEFAULT,
    lightColor: "#FF6B6B",
    sound: "default",
  });
}

/**
 * Check if notifications are enabled
 */
export async function areNotificationsEnabled(): Promise<boolean> {
  if (isWeb || !Notifications) return false;
  
  const { status } = await Notifications.getPermissionsAsync();
  return status === "granted";
}

/**
 * Schedule a daily streak reminder notification
 * Fires every day at the specified hour (default 9 PM)
 */
export async function scheduleStreakReminder(hour: number = 21): Promise<void> {
  if (isWeb || !Notifications) return;
  
  // Cancel existing streak reminders first
  await cancelStreakReminders();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Don't lose your streak! 🔥",
      body: "Complete a lesson today to keep your learning streak going!",
      sound: "default",
      badge: 1,
      data: { type: "streak_reminder" },
    },
    // Use the runtime-supported trigger shape (avoids relying on TS-only enums)
    trigger: { hour, minute: 0, repeats: true },
  });

  console.log(`Streak reminder scheduled for ${hour}:00 daily`);
}

/**
 * Cancel all streak reminder notifications
 */
export async function cancelStreakReminders(): Promise<void> {
  if (isWeb || !Notifications) return;
  
  const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
  
  for (const notification of scheduledNotifications) {
    if (notification.content.data?.type === "streak_reminder") {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }
  }
}

/**
 * Schedule a notification for when hearts are fully restored
 * @param timeUntilFull - Time in milliseconds until hearts are full
 */
export async function scheduleHeartsRestoredNotification(timeUntilFull: number): Promise<void> {
  if (isWeb || !Notifications) return;
  
  // Cancel existing hearts notifications
  await cancelHeartsNotifications();

  // Don't schedule if time is too short (less than 1 minute)
  if (timeUntilFull < 60000) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Your hearts are full! ❤️",
      body: "You've got 5 hearts again. Time to learn some crypto!",
      sound: "default",
      badge: 0,
      data: { type: "hearts_restored" },
    },
    trigger: { seconds: Math.floor(timeUntilFull / 1000) },
  });

  console.log(`Hearts restored notification scheduled in ${Math.floor(timeUntilFull / 60000)} minutes`);
}

/**
 * Cancel hearts restored notifications
 */
export async function cancelHeartsNotifications(): Promise<void> {
  if (isWeb || !Notifications) return;
  
  const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
  
  for (const notification of scheduledNotifications) {
    if (notification.content.data?.type === "hearts_restored") {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }
  }
}

/**
 * Schedule a "come back" notification if user hasn't opened the app
 * Fires 24 hours after being scheduled
 */
export async function scheduleComeBackNotification(): Promise<void> {
  if (isWeb || !Notifications) return;
  
  // Cancel existing come back notifications
  await cancelComeBackNotifications();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "We miss you! 🦎",
      body: "Your crypto knowledge is waiting. Come back and learn something new!",
      sound: "default",
      badge: 1,
      data: { type: "come_back" },
    },
    trigger: { seconds: 24 * 60 * 60 }, // 24 hours
  });

  console.log("Come back notification scheduled for 24 hours");
}

/**
 * Cancel come back notifications
 */
export async function cancelComeBackNotifications(): Promise<void> {
  if (isWeb || !Notifications) return;
  
  const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
  
  for (const notification of scheduledNotifications) {
    if (notification.content.data?.type === "come_back") {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }
  }
}

/**
 * Send an immediate local notification (for testing)
 */
export async function sendTestNotification(): Promise<void> {
  if (isWeb || !Notifications) return;
  
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Test Notification 🧪",
      body: "Notifications are working correctly!",
      sound: "default",
    },
    trigger: null, // Immediate
  });
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllNotifications(): Promise<void> {
  if (isWeb || !Notifications) return;
  
  await Notifications.cancelAllScheduledNotificationsAsync();
  console.log("All notifications cancelled");
}

/**
 * Get all scheduled notifications (for debugging)
 */
export async function getScheduledNotifications(): Promise<any[]> {
  if (isWeb || !Notifications) return [];
  
  return await Notifications.getAllScheduledNotificationsAsync();
}

/**
 * Initialize notifications on app start
 * - Requests permissions if not already granted
 * - Sets up daily streak reminder
 * - Schedules come back notification
 */
export async function initializeNotifications(): Promise<boolean> {
  const permissionGranted = await requestNotificationPermissions();
  
  if (permissionGranted) {
    // Schedule daily streak reminder at 9 PM
    await scheduleStreakReminder(21);
    
    // Schedule come back notification (reset each time app opens)
    await scheduleComeBackNotification();
  }

  return permissionGranted;
}
