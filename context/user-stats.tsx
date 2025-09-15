import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface UserStats {
  totalXp: number;
  weeklyXp: number;
  gems: number;
  streak: number;
  lessonsCompleted: number;
  lastLessonDate: string | null;
  league: number; // 0-7 (Paper Hands to Satoshi)
  leagueRank: number;
}

interface UserStatsContextType {
  stats: UserStats;
  addXp: (amount: number) => Promise<void>;
  addGems: (amount: number) => Promise<void>;
  completeLesson: (lessonId: number, xpEarned: number, gemsEarned: number) => Promise<void>;
  updateStreak: () => Promise<void>;
  resetStats: () => Promise<void>;
  loading: boolean;
}

const defaultStats: UserStats = {
  totalXp: 0,
  weeklyXp: 0,
  gems: 0,
  streak: 0,
  lessonsCompleted: 0,
  lastLessonDate: null,
  league: 0,
  leagueRank: 0,
};

const STATS_STORAGE_KEY = "@solingo_user_stats";
const WEEKLY_RESET_KEY = "@solingo_weekly_reset";

const UserStatsContext = createContext<UserStatsContextType | undefined>(undefined);

export function useUserStats() {
  const context = useContext(UserStatsContext);
  if (!context) {
    throw new Error("useUserStats must be used within a UserStatsProvider");
  }
  return context;
}

export function UserStatsProvider({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<UserStats>(defaultStats);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  
  // Use ref to always have access to latest stats (avoids stale closure issues)
  const statsRef = useRef(stats);
  useEffect(() => {
    statsRef.current = stats;
  }, [stats]);

  // Check if weekly XP should reset (every Monday)
  const checkWeeklyReset = useCallback(async () => {
    try {
      const lastReset = await AsyncStorage.getItem(WEEKLY_RESET_KEY);
      const now = new Date();
      const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday
      
      if (lastReset) {
        const lastResetDate = new Date(lastReset);
        const daysSinceReset = Math.floor((now.getTime() - lastResetDate.getTime()) / (1000 * 60 * 60 * 24));
        
        // Reset if it's been more than 7 days or if it's Monday and we haven't reset this week
        if (daysSinceReset >= 7 || (dayOfWeek === 1 && daysSinceReset >= 1)) {
          setStats(prev => ({ ...prev, weeklyXp: 0 }));
          await AsyncStorage.setItem(WEEKLY_RESET_KEY, now.toISOString());
        }
      } else {
        // First time, set the reset date
        await AsyncStorage.setItem(WEEKLY_RESET_KEY, now.toISOString());
      }
    } catch (error) {
      console.error("Error checking weekly reset:", error);
    }
  }, []);

  // Load stats from storage
  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      const storedStats = await AsyncStorage.getItem(STATS_STORAGE_KEY);
      if (storedStats) {
        setStats(JSON.parse(storedStats));
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, []);

  // Auto-save stats when they change (after initialization)
  useEffect(() => {
    if (initialized && !loading) {
      AsyncStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats)).catch(error => {
        console.error("Error auto-saving stats:", error);
      });
    }
  }, [stats, initialized, loading]);

  // Initialize
  useEffect(() => {
    loadStats();
    checkWeeklyReset();
  }, [loadStats, checkWeeklyReset]);

  // Add XP - use functional update to avoid stale state
  const addXp = async (amount: number) => {
    setStats(prev => ({
      ...prev,
      totalXp: prev.totalXp + amount,
      weeklyXp: prev.weeklyXp + amount,
    }));
  };

  // Add Gems - use functional update
  const addGems = async (amount: number) => {
    setStats(prev => ({
      ...prev,
      gems: prev.gems + amount,
    }));
  };

  // Complete a lesson - includes streak logic to avoid race conditions
  const completeLesson = async (lessonId: number, xpEarned: number, gemsEarned: number) => {
    const now = new Date();
    const today = now.toDateString();
    const nowISO = now.toISOString();
    
    setStats(prev => {
      // Only increment lessonsCompleted if this is a NEW lesson (not a replay)
      const newLessonsCompleted = lessonId > prev.lessonsCompleted 
        ? lessonId  // New lesson completed - unlock next level
        : prev.lessonsCompleted; // Replay - don't change progress
      
      // Calculate new streak based on PREVIOUS lastLessonDate (before we update it)
      let newStreak = prev.streak;
      
      if (prev.lastLessonDate) {
        const lastDate = new Date(prev.lastLessonDate);
        const lastDateString = lastDate.toDateString();
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastDateString === today) {
          // Already completed a lesson today - keep current streak
          newStreak = prev.streak;
        } else if (lastDateString === yesterday.toDateString()) {
          // Last lesson was yesterday - increment streak
          newStreak = prev.streak + 1;
        } else {
          // Streak broken (more than 1 day gap) - reset to 1
          newStreak = 1;
        }
      } else {
        // First lesson ever - start streak at 1
        newStreak = 1;
      }
      
      return {
        ...prev,
        totalXp: prev.totalXp + xpEarned,
        weeklyXp: prev.weeklyXp + xpEarned,
        gems: prev.gems + gemsEarned,
        lessonsCompleted: newLessonsCompleted,
        lastLessonDate: nowISO,
        streak: newStreak,
      };
    });
  };

  // Update streak - kept for backward compatibility but now handled in completeLesson
  const updateStreak = async () => {
    // Streak is now automatically updated in completeLesson
    // This function is kept for API compatibility but does nothing
  };

  // Reset all stats - used for account deletion
  const resetStats = async () => {
    try {
      await AsyncStorage.removeItem(STATS_STORAGE_KEY);
      await AsyncStorage.removeItem(WEEKLY_RESET_KEY);
      setStats(defaultStats);
    } catch (error) {
      console.error("Error resetting stats:", error);
      throw error;
    }
  };

  return (
    <UserStatsContext.Provider
      value={{
        stats,
        addXp,
        addGems,
        completeLesson,
        updateStreak,
        resetStats,
        loading,
      }}
    >
      {children}
    </UserStatsContext.Provider>
  );
}
