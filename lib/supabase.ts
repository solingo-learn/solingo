import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Check if we have valid credentials
const hasValidCredentials: boolean = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== "https://your-project.supabase.co" &&
  supabaseAnonKey !== "your-anon-key-here"
);

// Create Supabase client if we have valid credentials
export const supabase = hasValidCredentials
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        // Needed for OAuth on web (Supabase redirects back with tokens in URL)
        detectSessionInUrl: Platform.OS === "web",
      },
    })
  : null;

// Flag to check if Supabase is configured
export const isSupabaseConfigured = hasValidCredentials;

// Helper function to get the Supabase client (throws if not configured)
export function getSupabase() {
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in your .env file."
    );
  }
  return supabase;
}

// Type for user profile
export interface UserProfile {
  id: string;
  email: string;
  display_name?: string;
  avatar_url?: string;
  current_section: number;
  current_chapter: number;
  current_lesson: number;
  streak_days: number;
  total_xp: number;
  weekly_xp: number;
  gems: number;
  lessons_completed: number;
  league: number;
  league_rank: number;
  created_at: string;
  updated_at: string;
}
