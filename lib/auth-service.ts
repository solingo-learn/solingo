// Auth service types and helpers
// Currently using local storage, ready for Supabase integration

export interface AuthUser {
  id: string;
  email: string;
  displayName?: string;
  avatar?: string;
  createdAt: string;
}

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

// Mock auth service for development
// Replace with real Supabase calls when ready
export const authService = {
  // Sign up with email/password
  async signUpWithEmail(email: string, password: string, displayName?: string) {
    // Mock implementation - in production, use Supabase
    return {
      user: {
        id: `user_${Date.now()}`,
        email,
        displayName,
      },
      session: null,
    };
  },

  // Sign in with email/password
  async signInWithEmail(email: string, password: string) {
    // Mock implementation
    return {
      user: {
        id: `user_${Date.now()}`,
        email,
      },
      session: null,
    };
  },

  // Sign in with Google
  async signInWithGoogle() {
    // Mock implementation
    return {
      url: null,
      provider: "google",
    };
  },

  // Sign out
  async signOut() {
    // Mock implementation
    return { error: null };
  },

  // Get current user
  async getCurrentUser() {
    return null;
  },

  // Get current session
  async getSession() {
    return null;
  },

  // Create user profile in database
  async createUserProfile(userId: string, email: string, displayName?: string) {
    // Mock implementation
    return null;
  },

  // Get user profile
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    // Mock implementation
    return null;
  },

  // Update user progress
  async updateUserProgress(
    userId: string,
    progress: {
      current_section?: number;
      current_chapter?: number;
      current_lesson?: number;
      streak_days?: number;
      total_xp?: number;
    }
  ) {
    // Mock implementation
    return null;
  },
};
