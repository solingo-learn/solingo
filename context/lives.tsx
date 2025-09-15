import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { scheduleHeartsRestoredNotification, cancelHeartsNotifications } from "@/lib/notifications";

const MAX_LIVES = 5;
const LIFE_RESTORE_TIME = 60 * 60 * 1000; // 1 hour in milliseconds

interface LivesContextType {
  lives: number;
  maxLives: number;
  hasUnlimitedLives: boolean;
  unlimitedExpiresAt: number | null;
  loseLife: () => void;
  restoreAllLives: () => void;
  nextLifeTime: number | null;
  nextLifeIn: number; // Seconds until next life
  enableUnlimitedLives: (days: number) => void;
}

const LivesContext = createContext<LivesContextType | undefined>(undefined);

export function useLives() {
  const context = useContext(LivesContext);
  if (!context) {
    throw new Error("useLives must be used within a LivesProvider");
  }
  return context;
}

interface Props {
  children: React.ReactNode;
}

export function LivesProvider({ children }: Props) {
  const [lives, setLives] = useState(MAX_LIVES);
  const [lastLostTime, setLastLostTime] = useState<number | null>(null);
  const [hasUnlimitedLives, setHasUnlimitedLives] = useState(false);
  const [unlimitedExpiresAt, setUnlimitedExpiresAt] = useState<number | null>(null);
  const [nextLifeTime, setNextLifeTime] = useState<number | null>(null);
  const [nextLifeIn, setNextLifeIn] = useState(0);

  // Load lives from storage
  useEffect(() => {
    loadLives();
  }, []);

  // Check unlimited lives expiration
  useEffect(() => {
    if (!unlimitedExpiresAt) return;
    
    const checkExpiration = () => {
      if (Date.now() >= unlimitedExpiresAt) {
        setHasUnlimitedLives(false);
        setUnlimitedExpiresAt(null);
        AsyncStorage.removeItem("unlimitedLives");
        AsyncStorage.removeItem("unlimitedExpiresAt");
      }
    };

    checkExpiration();
    const interval = setInterval(checkExpiration, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [unlimitedExpiresAt]);

  // Auto-restore lives timer and countdown
  useEffect(() => {
    if (hasUnlimitedLives || lives >= MAX_LIVES) {
      setNextLifeTime(null);
      setNextLifeIn(0);
      return;
    }

    const interval = setInterval(() => {
      checkAndRestoreLives();
      
      // Update countdown
      if (nextLifeTime) {
        const remaining = Math.max(0, Math.floor((nextLifeTime - Date.now()) / 1000));
        setNextLifeIn(remaining);
      }
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, [lives, lastLostTime, hasUnlimitedLives, nextLifeTime]);

  const loadLives = async () => {
    try {
      const storedLives = await AsyncStorage.getItem("lives");
      const storedLastLostTime = await AsyncStorage.getItem("lastLostTime");
      const storedUnlimited = await AsyncStorage.getItem("unlimitedLives");
      const storedUnlimitedExpires = await AsyncStorage.getItem("unlimitedExpiresAt");

      if (storedUnlimited === "true" && storedUnlimitedExpires) {
        const expiresAt = parseInt(storedUnlimitedExpires, 10);
        if (Date.now() < expiresAt) {
          setHasUnlimitedLives(true);
          setUnlimitedExpiresAt(expiresAt);
          setLives(MAX_LIVES);
          return;
        } else {
          // Expired, clean up
          await AsyncStorage.removeItem("unlimitedLives");
          await AsyncStorage.removeItem("unlimitedExpiresAt");
        }
      }

      let currentLivesCount = MAX_LIVES;
      
      if (storedLives) {
        currentLivesCount = parseInt(storedLives, 10);
        setLives(currentLivesCount);
      }

      if (storedLastLostTime) {
        const parsedTime = parseInt(storedLastLostTime, 10);
        setLastLostTime(parsedTime);
        // Check if we should restore lives
        checkAndRestoreLives(currentLivesCount, parsedTime);
      }
    } catch (error) {
      console.error("Error loading lives:", error);
    }
  };

  const checkAndRestoreLives = (currentLives?: number, lastTime?: number) => {
    const now = Date.now();
    const livesCount = currentLives ?? lives;
    const lastLost = lastTime ?? lastLostTime;

    if (!lastLost || livesCount >= MAX_LIVES) {
      setNextLifeTime(null);
      setNextLifeIn(0);
      return;
    }

    const timePassed = now - lastLost;
    const livesToRestore = Math.floor(timePassed / LIFE_RESTORE_TIME);

    if (livesToRestore > 0) {
      const newLives = Math.min(livesCount + livesToRestore, MAX_LIVES);
      setLives(newLives);
      saveLives(newLives);

      if (newLives < MAX_LIVES) {
        const newLastLostTime = lastLost + livesToRestore * LIFE_RESTORE_TIME;
        setLastLostTime(newLastLostTime);
        AsyncStorage.setItem("lastLostTime", newLastLostTime.toString());
      } else {
        setLastLostTime(null);
        AsyncStorage.removeItem("lastLostTime");
      }
    }

    // Calculate next life time
    if (livesCount < MAX_LIVES && lastLost) {
      const timeUntilNextLife = LIFE_RESTORE_TIME - (timePassed % LIFE_RESTORE_TIME);
      const nextTime = now + timeUntilNextLife;
      setNextLifeTime(nextTime);
      setNextLifeIn(Math.floor(timeUntilNextLife / 1000));
    }
  };

  const saveLives = async (newLives: number) => {
    try {
      await AsyncStorage.setItem("lives", newLives.toString());
    } catch (error) {
      console.error("Error saving lives:", error);
    }
  };

  const loseLife = () => {
    if (hasUnlimitedLives) return;

    const newLives = Math.max(lives - 1, 0);
    const now = Date.now();

    setLives(newLives);
    setLastLostTime(now);
    saveLives(newLives);
    AsyncStorage.setItem("lastLostTime", now.toString());

    // Schedule notification for when hearts are fully restored
    const timeUntilFull = (MAX_LIVES - newLives) * LIFE_RESTORE_TIME;
    scheduleHeartsRestoredNotification(timeUntilFull).catch(console.error);
  };

  const restoreAllLives = () => {
    setLives(MAX_LIVES);
    setLastLostTime(null);
    setNextLifeTime(null);
    setNextLifeIn(0);
    saveLives(MAX_LIVES);
    AsyncStorage.removeItem("lastLostTime");
    
    // Cancel hearts notification since they're restored
    cancelHeartsNotifications().catch(console.error);
  };

  const enableUnlimitedLives = async (days: number) => {
    const expiresAt = Date.now() + days * 24 * 60 * 60 * 1000; // days in milliseconds
    setHasUnlimitedLives(true);
    setUnlimitedExpiresAt(expiresAt);
    setLives(MAX_LIVES);
    setNextLifeTime(null);
    setNextLifeIn(0);
    await AsyncStorage.setItem("unlimitedLives", "true");
    await AsyncStorage.setItem("unlimitedExpiresAt", expiresAt.toString());
  };

  const value: LivesContextType = {
    lives,
    maxLives: MAX_LIVES,
    hasUnlimitedLives,
    unlimitedExpiresAt,
    loseLife,
    restoreAllLives,
    nextLifeTime,
    nextLifeIn,
    enableUnlimitedLives,
  };

  return <LivesContext.Provider value={value}>{children}</LivesContext.Provider>;
}
