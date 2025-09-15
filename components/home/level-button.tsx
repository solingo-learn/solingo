import { useRef, useEffect } from "react";
import { Pressable, View as RNView, Animated, Easing } from "react-native";
import { Svg, Circle, Path, G, Rect } from "react-native-svg";
import { Text, View } from "@/components/themed";

interface LevelButtonProps {
  levelNumber: number;
  levelTitle: string;
  isLocked: boolean;
  isActive: boolean;
  isCompleted: boolean;
  backgroundColor: string;
  borderColor: string;
  iconIndex: number;
  levelProgress?: number; // 0 to 1
  onPress: (rect: { x: number; y: number; width: number; height: number }) => void;
}

// Progress Ring Component
function ProgressRing({ 
  size, 
  progress, 
  progressColor, 
  backgroundColor,
  strokeWidth = 6 
}: { 
  size: number; 
  progress: number; 
  progressColor: string;
  backgroundColor: string;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <Svg width={size} height={size}>
      {/* Background circle */}
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={backgroundColor}
        strokeWidth={strokeWidth}
        fill="transparent"
      />
      {/* Progress circle */}
      {progress > 0 && (
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      )}
    </Svg>
  );
}

// Lock SVG Icon
function LockIcon({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 2C9.24 2 7 4.24 7 7v2H6c-1.1 0-2 .9-2 2v9c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-9c0-1.1-.9-2-2-2h-1V7c0-2.76-2.24-5-5-5zm0 2c1.66 0 3 1.34 3 3v2H9V7c0-1.66 1.34-3 3-3zm0 10c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z"
        fill={color}
      />
    </Svg>
  );
}

// Star SVG Icon
function StarIcon({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill={color}
      />
    </Svg>
  );
}

// Heart SVG Icon
function HeartIcon({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill={color}
      />
    </Svg>
  );
}

// Asterisk/Book SVG Icon  
function BookIcon({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"
        fill={color}
      />
    </Svg>
  );
}

// Sun Icon for completed levels
function SunIcon({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <G fill={color}>
        <Circle cx="12" cy="12" r="5" />
        <Path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </G>
    </Svg>
  );
}

// Checkmark Icon
function CheckIcon({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M5 13L9 17L19 7"
        fill="none"
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function LevelButton({
  levelNumber,
  levelTitle,
  isLocked,
  isActive,
  isCompleted,
  backgroundColor,
  borderColor,
  iconIndex,
  levelProgress = 0,
  onPress,
}: LevelButtonProps) {
  const buttonRef = useRef<RNView>(null);
  
  // Animation for the "START" badge bounce
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isActive]);

  const handlePress = () => {
    buttonRef.current?.measureInWindow((x, y, width, height) => {
      onPress({ x, y, width, height });
    });
  };

  // Sizes
  const size = 70;
  const ringSize = size + 18;
  const circleSize = size - 8;
  const iconSize = 28;

  // Get icon based on index for locked levels
  const getLockedIcon = () => {
    const lockColor = "#AFAFAF";
    switch (iconIndex % 4) {
      case 0: return <LockIcon size={iconSize} color={lockColor} />;
      case 1: return <StarIcon size={iconSize} color={lockColor} />;
      case 2: return <HeartIcon size={iconSize} color={lockColor} />;
      case 3: return <BookIcon size={iconSize} color={lockColor} />;
      default: return <LockIcon size={iconSize} color={lockColor} />;
    }
  };

  // Bounce transform for the badge
  const badgeTranslateY = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -4],
  });

  // === LOCKED LEVEL ===
  if (isLocked) {
    return (
      <Pressable onPress={handlePress} disabled>
        <RNView ref={buttonRef} collapsable={false}>
          <View
            style={{
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: "#E8E8E8",
              borderWidth: 6,
              borderColor: "#D0D0D0",
              justifyContent: "center",
              alignItems: "center",
              // Shadow
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.15,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            {getLockedIcon()}
          </View>
        </RNView>
      </Pressable>
    );
  }

  // === COMPLETED LEVEL ===
  if (isCompleted) {
    return (
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => ({
          opacity: pressed ? 0.9 : 1,
          transform: [{ scale: pressed ? 0.95 : 1 }],
        })}
      >
        <RNView ref={buttonRef} collapsable={false}>
          {/* Progress ring (gold) */}
          <View style={{ width: ringSize, height: ringSize, alignItems: "center", justifyContent: "center" }}>
            <View style={{ position: "absolute" }}>
              <ProgressRing
                size={ringSize}
                progress={1}
                progressColor="#FFC800"
                backgroundColor="#E8E8E8"
                strokeWidth={8}
              />
            </View>
            
            {/* Inner circle */}
            <View
              style={{
                width: circleSize,
                height: circleSize,
                borderRadius: circleSize / 2,
                backgroundColor: "#FFC800",
                justifyContent: "center",
                alignItems: "center",
                // Gold shadow
                shadowColor: "#FFB300",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.5,
                shadowRadius: 8,
                elevation: 6,
              }}
            >
              <CheckIcon size={iconSize} color="#CD7900" />
            </View>
          </View>
        </RNView>
      </Pressable>
    );
  }

  // === ACTIVE LEVEL ===
  if (isActive) {
    return (
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => ({
          opacity: pressed ? 0.9 : 1,
          transform: [{ scale: pressed ? 0.95 : 1 }],
        })}
      >
        <RNView ref={buttonRef} collapsable={false}>
          <View style={{ width: ringSize, height: ringSize, alignItems: "center", justifyContent: "center" }}>
            {/* Progress ring */}
            <View style={{ position: "absolute" }}>
              <ProgressRing
                size={ringSize}
                progress={levelProgress}
                progressColor={levelProgress > 0 ? "#FFC800" : "transparent"}
                backgroundColor="#E0E0E0"
                strokeWidth={8}
              />
            </View>

            {/* Inner circle */}
            <View
              style={{
                width: circleSize,
                height: circleSize,
                borderRadius: circleSize / 2,
                backgroundColor: backgroundColor,
                justifyContent: "center",
                alignItems: "center",
                // Glow shadow
                shadowColor: backgroundColor,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.4,
                shadowRadius: 8,
                elevation: 6,
              }}
            >
              <StarIcon size={iconSize} color="#FFFFFF" />
            </View>

            {/* START Badge */}
            <Animated.View
              style={{
                position: "absolute",
                top: -32,
                transform: [{ translateY: badgeTranslateY }],
              }}
            >
              <View
                style={{
                  backgroundColor: "#FFFFFF",
                  paddingHorizontal: 14,
                  paddingVertical: 10,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: "#E0E0E0",
                  // Shadow
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.15,
                  shadowRadius: 4,
                  elevation: 4,
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "800",
                    color: backgroundColor,
                    letterSpacing: 0.5,
                  }}
                >
                  START
                </Text>
              </View>
              {/* Triangle pointer */}
              <View
                style={{
                  width: 0,
                  height: 0,
                  alignSelf: "center",
                  borderLeftWidth: 8,
                  borderRightWidth: 8,
                  borderTopWidth: 8,
                  borderLeftColor: "transparent",
                  borderRightColor: "transparent",
                  borderTopColor: "#FFFFFF",
                  marginTop: -1,
                }}
              />
            </Animated.View>
          </View>
        </RNView>
      </Pressable>
    );
  }

  // === DEFAULT (future unlocked but not active) ===
  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.9 : 1,
        transform: [{ scale: pressed ? 0.95 : 1 }],
      })}
    >
      <RNView ref={buttonRef} collapsable={false}>
        <View
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: "#D0D0D0",
            justifyContent: "center",
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <StarIcon size={iconSize} color="#A0A0A0" />
        </View>
      </RNView>
    </Pressable>
  );
}
