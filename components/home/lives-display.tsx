import React, { useEffect, useState } from "react";
import { Pressable } from "react-native";
import { View, Text } from "@/components/themed";
import { useLives } from "@/context/lives";
import { useTheme } from "@/context/theme";
import { layouts } from "@/constants/layouts";

export function LivesDisplay() {
  const { lives, maxLives, hasUnlimitedLives, nextLifeTime } = useLives();
  const { destructiveForeground, mutedForeground, border } = useTheme();
  const [timeUntilNextLife, setTimeUntilNextLife] = useState<string>("");

  useEffect(() => {
    if (!nextLifeTime || hasUnlimitedLives) {
      setTimeUntilNextLife("");
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = nextLifeTime - now;

      if (diff <= 0) {
        setTimeUntilNextLife("");
        return;
      }

      const minutes = Math.floor(diff / 1000 / 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeUntilNextLife(`${minutes}:${seconds.toString().padStart(2, "0")}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [nextLifeTime, hasUnlimitedLives]);

  return (
    <Pressable>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: layouts.padding / 2,
          padding: layouts.padding,
          borderRadius: layouts.padding,
          borderWidth: 2,
          borderColor: border,
        }}
      >
        {/* Hearts */}
        <View style={{ flexDirection: "row", gap: 4 }}>
          {hasUnlimitedLives ? (
            <>
              <Text style={{ fontSize: 20 }}>❤️</Text>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>∞</Text>
            </>
          ) : (
            Array.from({ length: maxLives }).map((_, index) => (
              <Text key={index} style={{ fontSize: 20 }}>
                {index < lives ? "❤️" : "🖤"}
              </Text>
            ))
          )}
        </View>

        {/* Timer if not full */}
        {!hasUnlimitedLives && lives < maxLives && timeUntilNextLife && (
          <Text style={{ fontSize: 12, color: mutedForeground }}>
            +1 in {timeUntilNextLife}
          </Text>
        )}

        {/* Unlimited badge */}
        {hasUnlimitedLives && (
          <View
            style={{
              backgroundColor: "#FFD700",
              paddingHorizontal: layouts.padding / 2,
              paddingVertical: 2,
              borderRadius: 4,
            }}
          >
            <Text style={{ fontSize: 10, fontWeight: "bold", color: "#000" }}>
              PREMIUM
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

