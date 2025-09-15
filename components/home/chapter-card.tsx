import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Text, View } from "@/components/themed";

interface ChapterCardProps {
  sectionNumber: number;
  chapterNumber: number;
  lessonNumber: number;
  title: string;
  description?: string;
  backgroundColor: string;
  borderColor: string;
  isCompleted: boolean;
  isCurrent: boolean;
  isLocked: boolean;
  onPress?: () => void;
}

export function ChapterCard({
  sectionNumber,
  chapterNumber,
  lessonNumber,
  title,
  description,
  backgroundColor,
  borderColor,
  isCompleted,
  isCurrent,
  isLocked,
  onPress,
}: ChapterCardProps) {
  return (
    <Pressable
      onPress={isLocked ? undefined : onPress}
      disabled={isLocked}
      style={({ pressed }) => ({
        opacity: isLocked ? 0.6 : pressed ? 0.9 : 1,
      })}
    >
      {/* Container principal - Design Flutter exact */}
      <View
        style={{
          // Margin: horizontal 16, vertical 4
          marginHorizontal: 16,
          marginVertical: 4,
          // Padding: vertical 12, horizontal 16
          paddingVertical: 12,
          paddingHorizontal: 16,
          // Fond coloré
          backgroundColor: backgroundColor,
          // Bords arrondis: radius 16
          borderRadius: 16,
          // Bordure en bas uniquement, épaisseur 4
          borderBottomWidth: 4,
          borderBottomColor: borderColor,
          // Layout: Row
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {/* Texte à gauche (Expanded) */}
        <View style={{ flex: 1, backgroundColor: "transparent" }}>
          {/* Chapitre X, Leçon Y */}
          <Text
            style={{
              fontSize: 13,
              fontWeight: "600",
              color: "rgba(255, 255, 255, 0.8)",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Section {sectionNumber}, Chapter {chapterNumber}
          </Text>
          {/* Titre */}
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: "#FFFFFF",
              marginTop: 4,
            }}
          >
            {title}
          </Text>
          {/* Description optionnelle */}
          {description && (
            <Text
              style={{
                fontSize: 13,
                color: "rgba(255, 255, 255, 0.7)",
                marginTop: 4,
              }}
            >
              {description}
            </Text>
          )}
        </View>

        {/* Séparation verticale + icône bookmark */}
        <View
          style={{
            height: 48,
            paddingHorizontal: 16,
            backgroundColor: "transparent",
            borderLeftWidth: 2,
            borderLeftColor: borderColor,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {isLocked ? (
            <Ionicons name="lock-closed" size={28} color="rgba(255,255,255,0.6)" />
          ) : isCompleted ? (
            <Ionicons name="checkmark-circle" size={28} color="#FFFFFF" />
          ) : (
            <Ionicons name="bookmark" size={28} color="#FFFFFF" />
          )}
        </View>
      </View>
    </Pressable>
  );
}
