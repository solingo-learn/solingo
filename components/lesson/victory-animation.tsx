import React, { useState, useEffect, useRef } from "react";
import { Modal, useWindowDimensions, Animated } from "react-native";
import { Image } from "expo-image";
import { Audio } from "expo-av";
import { View, Text } from "@/components/themed";
import { Icon } from "@/components/icons";
import { CheckButton } from "@/components/ui/check-button";
import { layouts } from "@/constants/layouts";
import { themeColors } from "@/constants/colors";
import { IconName } from "@/types";

const taureauImage = require("@/assets/mascotte/taureau_gagne.png");
const finalSound = require("@/assets/audios/sound/files/final.mp3");

interface VictoryAnimationProps {
  visible: boolean;
  onClose: () => void;
  xpEarned?: number;
  bonusEarned?: number;
  timeSpent?: string;
  accuracy?: number;
  isReplay?: boolean;
}

// Statistic Box Component - Like Finelo/Duolingo
function StatisticBox({ 
  title, 
  value, 
  icon,
  color,
  delay = 0,
}: { 
  title: string; 
  value: string; 
  icon: IconName;
  color: string;
  delay?: number;
}) {
  const [scaleAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      delay,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  }, [delay]);

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
        width: 100,
        height: 100,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
      }}
    >
      {/* Colored Header */}
      <View
        style={{
          backgroundColor: color,
          paddingVertical: 6,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 12,
            fontWeight: "800",
            letterSpacing: 0.5,
          }}
        >
          {title}
        </Text>
      </View>

      {/* Body with icon + value */}
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          padding: 8,
          backgroundColor: "#FFFFFF",
        }}
      >
        <Icon name={icon} size={22} color={color} />
        <Text
          style={{
            color: color,
            fontSize: 16,
            fontWeight: "800",
          }}
        >
          {value}
        </Text>
      </View>
    </Animated.View>
  );
}

export function VictoryAnimation({ 
  visible, 
  onClose,
  xpEarned = 10,
  bonusEarned = 5,
  timeSpent = "02:45",
  accuracy = 100,
  isReplay = false,
}: VictoryAnimationProps) {
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;
  const maxWidth = isDesktop ? 480 : width;
  const imageSize = isDesktop ? 800 : Math.min(460, Math.round(maxWidth * 0.98));

  const [titleAnim] = useState(new Animated.Value(0));
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    if (visible) {
      // Play victory sound
      const playSound = async () => {
        try {
          const { sound } = await Audio.Sound.createAsync(finalSound);
          soundRef.current = sound;
          await sound.playAsync();
        } catch (error) {
          console.log("Error playing victory sound:", error);
        }
      };
      playSound();

      // Animate title
      Animated.spring(titleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
    } else {
      titleAnim.setValue(0);
      // Clean up sound
      if (soundRef.current) {
        soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    }

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: themeColors.dark.background,
          justifyContent: "center",
          alignItems: "center",
          padding: layouts.padding * 2,
        }}
      >
        <View
          style={{
            width: "100%",
            maxWidth: maxWidth,
            alignItems: "center",
            backgroundColor: "transparent",
          }}
        >
          {/* Victory Image - Taureau - LARGER */}
          <Image
            source={taureauImage}
            contentFit="contain"
            style={{ 
              width: imageSize,
              height: imageSize,
              marginBottom: layouts.padding * 3,
            }}
          />

          {/* Success Title */}
          <Animated.View
            style={{
              transform: [{ scale: titleAnim }],
              alignItems: "center",
              marginBottom: layouts.padding * 2,
            }}
          >
            <Text style={{ 
              fontSize: isDesktop ? 36 : 32, 
              fontWeight: "800",
              color: "#58CC02",
              textAlign: "center",
            }}>
              Level Complete!
            </Text>
          </Animated.View>

          {/* Statistics Row - 3 boxes */}
          <View
            style={{
              flexDirection: "row",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
              backgroundColor: "transparent",
              marginBottom: layouts.padding * 2,
            }}
          >
            {/* XP Box */}
            <StatisticBox
              title="XP"
              value={isReplay ? "5" : `+${xpEarned}`}
              icon="bolt"
              color="#FFD900"
              delay={200}
            />

            {/* Bonus or Accuracy Box */}
            {!isReplay ? (
              <StatisticBox
                title="BONUS"
                value={`+${bonusEarned}`}
                icon="donut"
                color="#1CB0F6"
                delay={400}
              />
            ) : (
              <StatisticBox
                title="ACCURACY"
                value={`${accuracy}%`}
                icon="targetCircle"
                color="#E74C3C"
                delay={400}
              />
            )}

            {/* Time Box */}
            <StatisticBox
              title="TIME"
              value={timeSpent}
              icon="fire"
              color="#9945FF"
              delay={600}
            />
          </View>

          {/* Continue Button */}
          <View style={{ width: "100%", marginTop: layouts.padding }}>
            <CheckButton
              onPress={onClose}
              label="CONTINUE"
              variant="continue"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
