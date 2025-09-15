import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform, Linking } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";

import { supabase, isSupabaseConfigured, UserProfile } from "@/lib/supabase";

// Warm up browser for faster OAuth
WebBrowser.maybeCompleteAuthSession();

// Get the correct redirect URL for the current environment
const getRedirectUrl = () => {
  // For production builds, use the custom scheme
  // For Expo Go, use the Expo proxy URL
  return AuthSession.makeRedirectUri({
    scheme: "solingo",
    path: "auth/callback",
  });
};

// Clé de stockage des stats locales (doit correspondre à celle de user-stats.tsx)
const STATS_STORAGE_KEY = "@solingo_user_stats";

// Interface pour les stats locales
interface LocalStats {
  totalXp: number;
  weeklyXp: number;
  gems: number;
  streak: number;
  lessonsCompleted: number;
  lastLessonDate: string | null;
  league: number;
  leagueRank: number;
}

// Fonction pour récupérer les stats locales
async function getLocalStats(): Promise<LocalStats | null> {
  try {
    const storedStats = await AsyncStorage.getItem(STATS_STORAGE_KEY);
    if (storedStats) {
      return JSON.parse(storedStats);
    }
  } catch (error) {
    console.error("Error loading local stats:", error);
  }
  return null;
}

// User type
interface AppUser {
  id: string;
  email: string;
  displayName?: string;
}

interface AuthContextType {
  user: AppUser | null;
  session: any | null;
  profile: UserProfile | null;
  loading: boolean;
  isSupabaseMode: boolean;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "@solingo_auth";

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface Props {
  children: React.ReactNode;
}

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const isSupabaseMode: boolean = Boolean(isSupabaseConfigured && supabase);

  // Initialize auth
  useEffect(() => {
    let cleanup: undefined | (() => void);

    if (isSupabaseMode) {
      void (async () => {
        cleanup = await initSupabaseAuth();
      })();
    } else {
      void loadLocalAuth();
    }

    return () => {
      cleanup?.();
    };
  }, []);

  // ============ SUPABASE AUTH ============

  const initSupabaseAuth = async () => {
    try {
      // D'abord charger les données locales comme fallback
      // Cela permet de maintenir la session même si Supabase n'a pas de session valide
      const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      let hasLocalAuth = false;
      
      if (stored) {
        try {
          const data = JSON.parse(stored);
          if (data.user) {
            setUser(data.user);
            setProfile(data.profile);
            setSession({ user: data.user });
            hasLocalAuth = true;
            console.log("Loaded local auth as fallback:", data.user.email);
          }
        } catch (e) {
          console.error("Error parsing local auth:", e);
        }
      }

      // Ensuite vérifier la session Supabase
      const { data: { session: initialSession } } = await supabase!.auth.getSession();
      
      if (initialSession?.user) {
        // Session Supabase valide - utiliser celle-ci
        setSession(initialSession);
        setUser({
          id: initialSession.user.id,
          email: initialSession.user.email || "",
          displayName: initialSession.user.user_metadata?.display_name,
        });
        await fetchProfile(initialSession.user.id);
      }

      // Listen for auth changes
      const { data: { subscription } } = supabase!.auth.onAuthStateChange(
        async (event, newSession) => {
          console.log("Auth state changed:", event);
          
          if (newSession?.user) {
            setSession(newSession);
            setUser({
              id: newSession.user.id,
              email: newSession.user.email || "",
              displayName: newSession.user.user_metadata?.display_name,
            });
            await fetchProfile(newSession.user.id);
          } else {
            // Ne pas réinitialiser si c'est un événement SIGNED_UP sans session
            // (cela arrive quand la confirmation email est requise)
            if (event === "SIGNED_UP") {
              console.log("SIGNED_UP event without session - keeping current user state");
              return;
            }
            
            // Pour les autres événements (SIGNED_OUT, etc.), réinitialiser
            if (event === "SIGNED_OUT") {
              setSession(null);
              setUser(null);
              setProfile(null);
              await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
            }
          }
        }
      );

      return () => subscription.unsubscribe();
    } catch (error) {
      console.error("Error initializing Supabase auth:", error);
    } finally {
      setLoading(false);
    }

    return undefined;
  };

  const fetchProfile = async (userId: string) => {
    if (!supabase) return;
    
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      setProfile(data as UserProfile);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const supabaseSignUp = async (email: string, password: string, displayName?: string) => {
    if (!supabase) throw new Error("Supabase not configured");

    // Récupérer les stats locales avant l'inscription
    const localStats = await getLocalStats();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName || email.split("@")[0],
        },
      },
    });

    if (error) throw error;
    if (!data.user) throw new Error("Sign up failed");

    // IMPORTANT: Définir immédiatement l'utilisateur après l'inscription
    // Cela permet à l'utilisateur de naviguer dans l'app même si la confirmation email est requise
    const newUser: AppUser = {
      id: data.user.id,
      email: data.user.email || email,
      displayName: displayName || email.split("@")[0],
    };
    
    const newProfile: UserProfile = {
      id: data.user.id,
      email: data.user.email || email,
      display_name: displayName || email.split("@")[0],
      current_section: 0,
      current_chapter: 0,
      current_lesson: localStats?.lessonsCompleted || 0,
      streak_days: localStats?.streak || 0,
      total_xp: localStats?.totalXp || 0,
      weekly_xp: localStats?.weeklyXp || 0,
      gems: localStats?.gems || 500,
      lessons_completed: localStats?.lessonsCompleted || 0,
      league: localStats?.league || 0,
      league_rank: localStats?.leagueRank || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setUser(newUser);
    setSession(data.session || { user: data.user });
    setProfile(newProfile);
    
    // Aussi sauvegarder en local pour la persistance
    await saveLocalAuth(newUser, newProfile);

    console.log("User signed up and state set immediately:", newUser.email);

    // Si on a des stats locales, les sauvegarder dans le profil Supabase
    if (localStats && (localStats.totalXp > 0 || localStats.lessonsCompleted > 0)) {
      try {
        // Attendre un peu que le trigger crée le profil
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            total_xp: localStats.totalXp,
            weekly_xp: localStats.weeklyXp,
            gems: localStats.gems,
            streak_days: localStats.streak,
            lessons_completed: localStats.lessonsCompleted,
            league: localStats.league,
            league_rank: localStats.leagueRank,
          })
          .eq("id", data.user.id);

        if (updateError) {
          console.error("Error syncing local stats to Supabase:", updateError);
        } else {
          console.log("Local stats successfully synced to Supabase profile");
        }
      } catch (syncError) {
        console.error("Error syncing local stats:", syncError);
      }
    }
  };

  const supabaseSignIn = async (email: string, password: string) => {
    if (!supabase) throw new Error("Supabase not configured");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error("Sign in failed");

    // Récupérer les stats locales pour les préserver
    const localStats = await getLocalStats();

    // Sauvegarder aussi en local pour la persistance
    const userData: AppUser = {
      id: data.user.id,
      email: data.user.email || email,
      displayName: data.user.user_metadata?.display_name || email.split("@")[0],
    };

    const profileData: UserProfile = {
      id: data.user.id,
      email: data.user.email || email,
      display_name: data.user.user_metadata?.display_name || email.split("@")[0],
      current_section: 0,
      current_chapter: 0,
      current_lesson: localStats?.lessonsCompleted || 0,
      streak_days: localStats?.streak || 0,
      total_xp: localStats?.totalXp || 0,
      weekly_xp: localStats?.weeklyXp || 0,
      gems: localStats?.gems || 500,
      lessons_completed: localStats?.lessonsCompleted || 0,
      league: localStats?.league || 0,
      league_rank: localStats?.leagueRank || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await saveLocalAuth(userData, profileData);
    console.log("User signed in and saved to local storage:", userData.email);
  };

  const supabaseSignInWithGoogle = async () => {
    if (!supabase) throw new Error("Supabase not configured");

    // On web, use standard OAuth flow
    if (Platform.OS === "web") {
      // Use current origin for redirect (works for any domain)
      const redirectUrl = typeof window !== "undefined" ? window.location.origin : "https://app.solingo.fun";
      console.log("Google OAuth redirect URL:", redirectUrl);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });
      if (error) throw error;
      return;
    }

    // On iOS/Android, use WebBrowser with AuthSession for proper redirect handling
    try {
      const redirectUrl = getRedirectUrl();
      console.log("Using redirect URL:", redirectUrl);

      // Get the OAuth URL from Supabase
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
        },
      });

      if (error) throw error;
      if (!data?.url) throw new Error("No OAuth URL returned");

      console.log("Opening Google OAuth URL...");

      // Open browser and wait for redirect
      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

      if (result.type === "success" && result.url) {
        console.log("Received callback URL:", result.url);
        
        try {
          const url = new URL(result.url);
          
          // Check for hash fragments (Supabase returns tokens in hash)
          const hashParams = new URLSearchParams(url.hash.substring(1));
          const accessToken = hashParams.get("access_token");
          const refreshToken = hashParams.get("refresh_token");

          if (accessToken) {
            const { error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || "",
            });

            if (sessionError) {
              console.error("Session error:", sessionError);
              throw sessionError;
            }
            console.log("Google sign in successful!");
          } else {
            const errorDesc = hashParams.get("error_description");
            if (errorDesc) {
              throw new Error(errorDesc);
            }
            throw new Error("No access token received");
          }
        } catch (e) {
          console.error("Error processing callback:", e);
          throw e;
        }
      } else if (result.type === "cancel") {
        throw new Error("Sign in cancelled");
      }

    } catch (error: any) {
      console.error("Google sign in error:", error);
      throw error;
    }
  };

  const supabaseSignInWithApple = async () => {
    if (!supabase) throw new Error("Supabase not configured");

    // On Web, use OAuth flow
    if (Platform.OS === "web") {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "apple",
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
      return;
    }

    // On iOS, use native Apple Authentication
    if (Platform.OS !== "ios") throw new Error("Apple Sign In is only available on iOS and Web");

    try {
      // Step 1: Get Apple credential
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      // Step 2: Exchange credential for Supabase session
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: "apple",
        token: credential.identityToken!,
        nonce: credential.nonce || undefined,
      });

      if (error) {
        // Check if it's the Expo Go audience error
        if (error.message?.includes("Unacceptable audience") && error.message?.includes("host.exp.Exponent")) {
          throw new Error(
            "Apple Sign In requires a production build. Please use EAS Build or add 'host.exp.Exponent' to your Supabase Apple provider settings."
          );
        }
        throw error;
      }
      if (!data.user) throw new Error("Apple Sign In failed");
    } catch (error: any) {
      // User cancelled the sign-in
      if (error.code === "ERR_REQUEST_CANCELED") {
        throw new Error("Sign in cancelled");
      }
      throw error;
    }
  };

  const supabaseSignOut = async () => {
    if (!supabase) throw new Error("Supabase not configured");

    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    setUser(null);
    setSession(null);
    setProfile(null);
  };

  // ============ LOCAL AUTH (Mock) ============

  const loadLocalAuth = async () => {
    try {
      const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        setUser(data.user);
        setProfile(data.profile);
        setSession({ user: data.user });
      }
    } catch (error) {
      console.error("Error loading local auth:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveLocalAuth = async (userData: AppUser | null, profileData: UserProfile | null) => {
    try {
      if (userData) {
        await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
          user: userData,
          profile: profileData,
        }));
      } else {
        await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (error) {
      console.error("Error saving local auth:", error);
    }
  };

  const localSignUp = async (email: string, password: string, displayName?: string) => {
    // Récupérer les stats locales existantes pour les préserver
    const localStats = await getLocalStats();

    const newUser: AppUser = {
      id: `local_${Date.now()}`,
      email,
      displayName: displayName || email.split("@")[0],
    };

    // Fusionner les stats locales avec le nouveau profil
    const newProfile: UserProfile = {
      id: newUser.id,
      email,
      display_name: displayName || email.split("@")[0],
      current_section: 0,
      current_chapter: 0,
      current_lesson: localStats?.lessonsCompleted || 0,
      streak_days: localStats?.streak || 0,
      total_xp: localStats?.totalXp || 0,
      weekly_xp: localStats?.weeklyXp || 0,
      gems: localStats?.gems || 500,
      lessons_completed: localStats?.lessonsCompleted || 0,
      league: localStats?.league || 0,
      league_rank: localStats?.leagueRank || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log("Creating local profile with preserved stats:", { 
      totalXp: newProfile.total_xp, 
      lessonsCompleted: newProfile.lessons_completed,
      gems: newProfile.gems
    });

    setUser(newUser);
    setProfile(newProfile);
    setSession({ user: newUser });
    await saveLocalAuth(newUser, newProfile);
  };

  const localSignIn = async (email: string, password: string) => {
    // Simple validation for local mode
    if (!email.includes("@") || password.length < 3) {
      throw new Error("Invalid credentials");
    }

    // Récupérer les stats locales existantes pour les préserver
    const localStats = await getLocalStats();

    const mockUser: AppUser = {
      id: `local_${Date.now()}`,
      email,
      displayName: email.split("@")[0],
    };

    // Fusionner les stats locales avec le profil
    const mockProfile: UserProfile = {
      id: mockUser.id,
      email,
      display_name: email.split("@")[0],
      current_section: 0,
      current_chapter: 0,
      current_lesson: localStats?.lessonsCompleted || 0,
      streak_days: localStats?.streak || 0,
      total_xp: localStats?.totalXp || 0,
      weekly_xp: localStats?.weeklyXp || 0,
      gems: localStats?.gems || 500,
      lessons_completed: localStats?.lessonsCompleted || 0,
      league: localStats?.league || 0,
      league_rank: localStats?.leagueRank || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log("Signing in with preserved stats:", { 
      totalXp: mockProfile.total_xp, 
      lessonsCompleted: mockProfile.lessons_completed,
      gems: mockProfile.gems
    });

    setUser(mockUser);
    setProfile(mockProfile);
    setSession({ user: mockUser });
    await saveLocalAuth(mockUser, mockProfile);
  };

  const localSignInWithGoogle = async () => {
    // Récupérer les stats locales existantes pour les préserver
    const localStats = await getLocalStats();

    const mockUser: AppUser = {
      id: `google_${Date.now()}`,
      email: "user@gmail.com",
      displayName: "Google User",
    };

    // Fusionner les stats locales avec le profil
    const mockProfile: UserProfile = {
      id: mockUser.id,
      email: mockUser.email,
      display_name: mockUser.displayName,
      current_section: 0,
      current_chapter: 0,
      current_lesson: localStats?.lessonsCompleted || 0,
      streak_days: localStats?.streak || 0,
      total_xp: localStats?.totalXp || 0,
      weekly_xp: localStats?.weeklyXp || 0,
      gems: localStats?.gems || 500,
      lessons_completed: localStats?.lessonsCompleted || 0,
      league: localStats?.league || 0,
      league_rank: localStats?.leagueRank || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log("Google sign in with preserved stats:", { 
      totalXp: mockProfile.total_xp, 
      lessonsCompleted: mockProfile.lessons_completed,
      gems: mockProfile.gems
    });

    setUser(mockUser);
    setProfile(mockProfile);
    setSession({ user: mockUser });
    await saveLocalAuth(mockUser, mockProfile);
  };

  const localSignInWithApple = async () => {
    // Récupérer les stats locales existantes pour les préserver
    const localStats = await getLocalStats();

    // On Web, create a mock Apple user (demo mode)
    if (Platform.OS === "web") {
      const mockUser: AppUser = {
        id: `apple_${Date.now()}`,
        email: "user@privaterelay.appleid.com",
        displayName: "Apple User",
      };

      const mockProfile: UserProfile = {
        id: mockUser.id,
        email: mockUser.email,
        display_name: mockUser.displayName,
        current_section: 0,
        current_chapter: 0,
        current_lesson: localStats?.lessonsCompleted || 0,
        streak_days: localStats?.streak || 0,
        total_xp: localStats?.totalXp || 0,
        weekly_xp: localStats?.weeklyXp || 0,
        gems: localStats?.gems || 500,
        lessons_completed: localStats?.lessonsCompleted || 0,
        league: localStats?.league || 0,
        league_rank: localStats?.leagueRank || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log("Apple sign in (web demo) with preserved stats:", { 
        totalXp: mockProfile.total_xp, 
        lessonsCompleted: mockProfile.lessons_completed,
        gems: mockProfile.gems
      });

      setUser(mockUser);
      setProfile(mockProfile);
      setSession({ user: mockUser });
      await saveLocalAuth(mockUser, mockProfile);
      return;
    }

    // On iOS, use native Apple Authentication
    if (Platform.OS !== "ios") throw new Error("Apple Sign In is only available on iOS and Web");

    try {
      // Get Apple credential
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      // Create user from Apple credential
      const displayName = credential.fullName
        ? `${credential.fullName.givenName || ""} ${credential.fullName.familyName || ""}`.trim()
        : credential.email?.split("@")[0] || "Apple User";

      const mockUser: AppUser = {
        id: `apple_${credential.user}`,
        email: credential.email || `apple_${credential.user}@privaterelay.appleid.com`,
        displayName,
      };

      // Fusionner les stats locales avec le profil
      const mockProfile: UserProfile = {
        id: mockUser.id,
        email: mockUser.email,
        display_name: displayName,
        current_section: 0,
        current_chapter: 0,
        current_lesson: localStats?.lessonsCompleted || 0,
        streak_days: localStats?.streak || 0,
        total_xp: localStats?.totalXp || 0,
        weekly_xp: localStats?.weeklyXp || 0,
        gems: localStats?.gems || 500,
        lessons_completed: localStats?.lessonsCompleted || 0,
        league: localStats?.league || 0,
        league_rank: localStats?.leagueRank || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log("Apple sign in with preserved stats:", { 
        totalXp: mockProfile.total_xp, 
        lessonsCompleted: mockProfile.lessons_completed,
        gems: mockProfile.gems
      });

      setUser(mockUser);
      setProfile(mockProfile);
      setSession({ user: mockUser });
      await saveLocalAuth(mockUser, mockProfile);
    } catch (error: any) {
      // User cancelled the sign-in
      if (error.code === "ERR_REQUEST_CANCELED") {
        throw new Error("Sign in cancelled");
      }
      throw error;
    }
  };

  const localSignOut = async () => {
    setUser(null);
    setProfile(null);
    setSession(null);
    await saveLocalAuth(null, null);
  };

  // ============ PUBLIC API ============

  const signUp = async (email: string, password: string, displayName?: string) => {
    if (isSupabaseMode) {
      await supabaseSignUp(email, password, displayName);
    } else {
      await localSignUp(email, password, displayName);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (isSupabaseMode) {
      await supabaseSignIn(email, password);
    } else {
      await localSignIn(email, password);
    }
  };

  const signInWithGoogle = async () => {
    if (isSupabaseMode) {
      await supabaseSignInWithGoogle();
    } else {
      await localSignInWithGoogle();
    }
  };

  const signInWithApple = async () => {
    if (isSupabaseMode) {
      await supabaseSignInWithApple();
    } else {
      await localSignInWithApple();
    }
  };

  const signOut = async () => {
    if (isSupabaseMode) {
      await supabaseSignOut();
    } else {
      await localSignOut();
    }
  };

  const refreshProfile = async () => {
    if (isSupabaseMode && user) {
      await fetchProfile(user.id);
    }
  };

  // Delete account - required by Apple App Store guidelines
  const deleteAccount = async () => {
    if (isSupabaseMode && supabase && user) {
      try {
        // Delete user profile first
        const { error: profileError } = await supabase
          .from("profiles")
          .delete()
          .eq("id", user.id);
        
        if (profileError) {
          console.error("Error deleting profile:", profileError);
        }

        // Note: For complete deletion, you may need a Supabase Edge Function
        // to delete the auth user. For now, we sign out and clear local data.
        await supabase.auth.signOut();
      } catch (error) {
        console.error("Error deleting Supabase account:", error);
        throw error;
      }
    }
    
    // Clear local auth data
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    
    // Reset state
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  const value: AuthContextType = {
    user,
    session,
    profile,
    loading,
    isSupabaseMode,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithApple,
    signOut,
    deleteAccount,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
