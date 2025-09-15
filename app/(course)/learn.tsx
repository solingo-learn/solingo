import { useState, useRef, useCallback } from "react";
import { ScrollView, Pressable, NativeScrollEvent, NativeSyntheticEvent, Image, Platform, StatusBar } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { Metadata } from "@/components/metadata";
import { Text, View } from "@/components/themed";
import { StatsBar } from "@/components/home/stats-bar";
import { ChapterCard } from "@/components/home/chapter-card";
import { LevelButton } from "@/components/home/level-button";
import { LevelTooltip } from "@/components/home/level-tooltip";
import { DailyRewardsPopup, useDailyReward } from "@/components/home/daily-rewards-popup";
import { layouts } from "@/constants/layouts";
import { getSectionColors } from "@/constants/colors";
import { useUserStats } from "@/context/user-stats";

// Chapter mascot images - one per chapter
const chapterMascots = [
  require("@/assets/mascotte/soli-happy.png"),
  require("@/assets/mascotte/blockchain.png"),
  require("@/assets/mascotte/decentralized.png"),
  require("@/assets/mascotte/soli-teacher.png"),
  require("@/assets/mascotte/crypto-coins.png"),
  require("@/assets/mascotte/liquidity-pool.png"),
  require("@/assets/mascotte/wallet-icon.png"),
  require("@/assets/mascotte/shield-security.png"),
  require("@/assets/mascotte/scam-alert.png"),
  require("@/assets/mascotte/soli-thinking.png"),
  require("@/assets/mascotte/singe.png"),
  require("@/assets/mascotte/soli-warning.png"),
  require("@/assets/mascotte/chart-up.png"),
  require("@/assets/mascotte/whale-market.png"),
  require("@/assets/mascotte/taureau.png"),
];

// Chapters with their levels - Extended course structure
const chaptersData = [
  // ============ SECTION 1: CRYPTO FOUNDATIONS ============
  {
    section: 1,
    chapter: 1,
    title: "What is Crypto?",
    levels: [
      { id: 1, title: "Introduction to Crypto" },
      { id: 2, title: "Digital Currency Basics" },
    ],
  },
  {
    section: 1,
    chapter: 2,
    title: "Blockchain Basics",
    levels: [
      { id: 3, title: "How Blockchain Works" },
      { id: 4, title: "Decentralization" },
      { id: 5, title: "Crypto Review" },
    ],
  },
  // ============ SECTION 2: SOLANA ECOSYSTEM ============
  {
    section: 2,
    chapter: 1,
    title: "Introduction to Solana",
    levels: [
      { id: 6, title: "What is Solana?" },
      { id: 7, title: "Speed & Low Fees" },
    ],
  },
  {
    section: 2,
    chapter: 2,
    title: "SOL Token",
    levels: [
      { id: 8, title: "SOL Basics" },
      { id: 9, title: "Staking & Validators" },
      { id: 10, title: "Solana Review" },
    ],
  },
  // ============ SECTION 3: WALLETS & SECURITY ============
  {
    section: 3,
    chapter: 1,
    title: "Wallet Types",
    levels: [
      { id: 11, title: "Hot vs Cold Wallets" },
      { id: 12, title: "Custodial vs Non-Custodial" },
    ],
  },
  {
    section: 3,
    chapter: 2,
    title: "Security Best Practices",
    levels: [
      { id: 13, title: "Seed Phrase Safety" },
      { id: 14, title: "Avoiding Scams" },
      { id: 15, title: "Security Review" },
    ],
  },
  // ============ SECTION 4: TOKENS & MEMECOINS ============
  {
    section: 4,
    chapter: 1,
    title: "Understanding Tokens",
    levels: [
      { id: 16, title: "SPL Token Standard" },
      { id: 17, title: "Token Creation" },
    ],
  },
  {
    section: 4,
    chapter: 2,
    title: "Memecoins 101",
    levels: [
      { id: 18, title: "What are Memecoins?" },
      { id: 19, title: "Risks & Red Flags" },
      { id: 20, title: "DYOR Review" },
    ],
  },
  // ============ SECTION 5: MARKET & MINDSET ============
  {
    section: 5,
    chapter: 1,
    title: "Market Mechanics",
    levels: [
      { id: 21, title: "Supply & Demand" },
      { id: 22, title: "Market Cap & Liquidity" },
    ],
  },
  {
    section: 5,
    chapter: 2,
    title: "Mindset & Responsibility",
    levels: [
      { id: 23, title: "Volatility & Emotions" },
      { id: 24, title: "Long-Term Thinking" },
      { id: 25, title: "Final Assessment" },
    ],
  },
  // ============ SECTION 6: ADVANCED DEFI (COMING SOON) ============
  {
    section: 6,
    chapter: 1,
    title: "DeFi Fundamentals",
    levels: [
      { id: 26, title: "What is DeFi?" },
      { id: 27, title: "Liquidity Pools" },
      { id: 28, title: "Yield Farming Basics" },
    ],
  },
  {
    section: 6,
    chapter: 2,
    title: "DEX Trading",
    levels: [
      { id: 29, title: "Swapping Tokens" },
      { id: 30, title: "Slippage & Fees" },
    ],
  },
  // ============ SECTION 7: NFTS & DIGITAL ASSETS (COMING SOON) ============
  {
    section: 7,
    chapter: 1,
    title: "NFT Basics",
    levels: [
      { id: 31, title: "What are NFTs?" },
      { id: 32, title: "NFT Marketplaces" },
    ],
  },
  {
    section: 7,
    chapter: 2,
    title: "Solana NFT Ecosystem",
    levels: [
      { id: 33, title: "Magic Eden & Tensor" },
      { id: 34, title: "Compressed NFTs" },
      { id: 35, title: "NFT Review" },
    ],
  },
  // ============ SECTION 8: ON-CHAIN ANALYSIS (COMING SOON) ============
  {
    section: 8,
    chapter: 1,
    title: "Reading On-Chain Data",
    levels: [
      { id: 36, title: "Block Explorers" },
      { id: 37, title: "Transaction Analysis" },
    ],
  },
  {
    section: 8,
    chapter: 2,
    title: "Whale Watching",
    levels: [
      { id: 38, title: "Tracking Large Wallets" },
      { id: 39, title: "Volume & Holder Analysis" },
      { id: 40, title: "On-Chain Review" },
    ],
  },
  // ============ SECTION 9: ADVANCED SECURITY (COMING SOON) ============
  {
    section: 9,
    chapter: 1,
    title: "Advanced Scam Detection",
    levels: [
      { id: 41, title: "Rug Pull Patterns" },
      { id: 42, title: "Honeypot Tokens" },
    ],
  },
  {
    section: 9,
    chapter: 2,
    title: "Smart Contract Safety",
    levels: [
      { id: 43, title: "Audit Reports" },
      { id: 44, title: "Permission Revocation" },
      { id: 45, title: "Security Master" },
    ],
  },
  // ============ SECTION 10: EXPERT LEVEL (COMING SOON) ============
  {
    section: 10,
    chapter: 1,
    title: "Building on Solana",
    levels: [
      { id: 46, title: "Developer Basics" },
      { id: 47, title: "Program Architecture" },
    ],
  },
  {
    section: 10,
    chapter: 2,
    title: "Ecosystem Mastery",
    levels: [
      { id: 48, title: "Protocol Deep Dives" },
      { id: 49, title: "Future of Solana" },
      { id: 50, title: "Graduation" },
    ],
  },
];

export default function Learn() {
  const { stats } = useUserStats();
  const scrollViewRef = useRef<ScrollView>(null);
  const { shouldShow: showDailyReward, dismissPopup: dismissDailyReward } = useDailyReward();

  // Current progress
  const currentLevelId = stats.lessonsCompleted + 1;

  // Header height
  const [headerHeight, setHeaderHeight] = useState(0);

  // Scroll button state
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isScrolledBelow, setIsScrolledBelow] = useState(false);
  const [activeLevelY, setActiveLevelY] = useState(0);

  // Tooltip state
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipData, setTooltipData] = useState({
    title: "",
    levelId: 0,
    backgroundColor: "#9945FF",
    borderColor: "#7B35D9",
    buttonRect: { x: 0, y: 0, width: 0, height: 0 },
    isLocked: false,
    isCompleted: false,
  });

  // Handle scroll
  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = event.nativeEvent.contentOffset.y;
    const screenHeight = event.nativeEvent.layoutMeasurement.height;

    // Show/hide scroll button
    if (activeLevelY > 0) {
      const threshold = screenHeight / 3;
      const distanceFromActive = Math.abs(offset - activeLevelY);
      setShowScrollButton(distanceFromActive > threshold);
      setIsScrolledBelow(offset > activeLevelY);
    }
  }, [activeLevelY]);

  // Scroll to active level
  const scrollToActiveLevel = () => {
    if (scrollViewRef.current && activeLevelY > 0) {
      scrollViewRef.current.scrollTo({
        y: Math.max(0, activeLevelY - 200),
        animated: true,
      });
    }
  };

  // Level press handler
  const handleLevelPress = (
    levelId: number,
    levelTitle: string,
    sectionIndex: number,
    rect: { x: number; y: number; width: number; height: number },
    isLocked: boolean,
    isCompleted: boolean
  ) => {
    const colors = getSectionColors(sectionIndex);
    setTooltipData({
      title: levelTitle,
      levelId,
      backgroundColor: colors.background,
      borderColor: colors.border,
      buttonRect: rect,
      isLocked,
      isCompleted,
    });
    setTooltipVisible(true);
  };

  // Start lesson
  const handleStartLesson = () => {
    setTooltipVisible(false);
    router.push(`/(lesson)/${tooltipData.levelId}`);
  };

  // Calculate level status
  const getLevelStatus = (levelId: number) => {
    const isCompleted = levelId < currentLevelId;
    const isActive = levelId === currentLevelId;
    const isLocked = levelId > currentLevelId;
    return { isCompleted, isActive, isLocked };
  };

  // Calculate chapter status
  const getChapterStatus = (chapter: typeof chaptersData[0]) => {
    const firstLevelId = chapter.levels[0]?.id || 0;
    const lastLevelId = chapter.levels[chapter.levels.length - 1]?.id || 0;
    const isCompleted = lastLevelId < currentLevelId;
    const isCurrent = firstLevelId <= currentLevelId && currentLevelId <= lastLevelId;
    const isLocked = firstLevelId > currentLevelId;
    return { isCompleted, isCurrent, isLocked };
  };

  return (
    <>
      <Metadata
        title="Solingo"
        description="Learn crypto, Solana & memecoins safely"
      />
      <View style={{ flex: 1, backgroundColor: "#000000" }}>
        {/* Fixed Header - Black background */}
        <View
          style={{
            backgroundColor: "#000000",
            paddingTop: Platform.OS === "ios" ? 50 : StatusBar.currentHeight || 24,
            paddingHorizontal: layouts.padding,
            paddingBottom: layouts.padding,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            borderBottomWidth: 1,
            borderBottomColor: "#1A1A1A",
          }}
          onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "transparent",
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: "800",
                color: "#FFFFFF",
              }}
            >
              Solingo
            </Text>
            <StatsBar />
          </View>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{
            paddingTop: headerHeight + 8,
            paddingBottom: 120,
          }}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {/* Chapters with Levels */}
          {chaptersData.map((chapter, chapterIndex) => {
            const colors = getSectionColors(chapter.section - 1);
            const chapterStatus = getChapterStatus(chapter);
            const chapterMascot = chapterMascots[chapterIndex % chapterMascots.length];

            return (
              <View
                key={`chapter-${chapterIndex}`}
                style={{ marginBottom: 8 }}
              >
                {/* Chapter Card - Flutter design exact */}
                <ChapterCard
                  sectionNumber={chapter.section}
                  chapterNumber={chapter.chapter}
                  lessonNumber={chapter.levels.length}
                  title={chapter.title}
                  backgroundColor={colors.background}
                  borderColor={colors.border}
                  isCompleted={chapterStatus.isCompleted}
                  isCurrent={chapterStatus.isCurrent}
                  isLocked={chapterStatus.isLocked}
                />

                {/* Level Buttons in Zig-Zag Pattern */}
                <View
                  style={{
                    alignItems: "center",
                    paddingVertical: 16,
                  }}
                >
                  {chapter.levels.map((level, levelIndex) => {
                    const { isCompleted, isActive, isLocked } = getLevelStatus(level.id);
                    
                    // Zig-zag pattern
                    const isFormatB = chapterIndex % 2 === 1;
                    const isOdd = levelIndex % 2 === 1;
                    const goRight = isFormatB ? !isOdd : isOdd;
                    
                    // Show mascot on 2nd level
                    const showMascot = levelIndex === 1;
                    const mascotOnLeft = showMascot && !isFormatB;
                    const mascotOnRight = showMascot && isFormatB;

                    return (
                      <View
                        key={`level-${level.id}`}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "100%",
                          marginBottom: 12,
                        }}
                        onLayout={(e) => {
                          if (isActive) {
                            setActiveLevelY(e.nativeEvent.layout.y);
                          }
                        }}
                      >
                        {/* Left mascot */}
                        {mascotOnLeft && (
                          <View style={{ position: "absolute", left: 20, top: -10 }}>
                            <Image
                              source={chapterMascot}
                              style={{ width: 80, height: 80, resizeMode: "contain" }}
                            />
                          </View>
                        )}

                        {/* Level Button with zig-zag offset */}
                        <View
                          style={{
                            marginLeft: goRight ? 40 : 0,
                            marginRight: goRight ? 0 : 40,
                          }}
                        >
                          <LevelButton
                            levelNumber={level.id}
                            levelTitle={level.title}
                            isLocked={isLocked}
                            isActive={isActive}
                            isCompleted={isCompleted}
                            backgroundColor={colors.background}
                            borderColor={colors.border}
                            iconIndex={levelIndex}
                            onPress={(rect) => handleLevelPress(
                              level.id,
                              level.title,
                              chapter.section - 1,
                              rect,
                              isLocked,
                              isCompleted
                            )}
                          />
                        </View>

                        {/* Right mascot */}
                        {mascotOnRight && (
                          <View style={{ position: "absolute", right: 20, top: -10 }}>
                            <Image
                              source={chapterMascot}
                              style={{ width: 80, height: 80, resizeMode: "contain" }}
                            />
                          </View>
                        )}
                      </View>
                    );
                  })}
                </View>
              </View>
            );
          })}

          {/* Footer */}
          <View style={{ alignItems: "center", paddingVertical: 32 }}>
            <Text style={{ fontSize: 14, color: "#666666", textAlign: "center" }}>
              Complete all 25 levels to become a Solana expert! 🦎
            </Text>
          </View>
        </ScrollView>

        {/* Floating Scroll Button */}
        {showScrollButton && (
          <Pressable
            onPress={scrollToActiveLevel}
            style={{
              position: "absolute",
              bottom: 100,
              right: 20,
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: "#9945FF",
              justifyContent: "center",
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 6,
              elevation: 8,
              zIndex: 1000,
            }}
          >
            <Ionicons
              name={isScrolledBelow ? "arrow-up" : "arrow-down"}
              size={28}
              color="#FFFFFF"
            />
          </Pressable>
        )}

        {/* Level Tooltip */}
        <LevelTooltip
          visible={tooltipVisible}
          title={tooltipData.title}
          backgroundColor={tooltipData.backgroundColor}
          borderColor={tooltipData.borderColor}
          buttonRect={tooltipData.buttonRect}
          isLocked={tooltipData.isLocked}
          isCompleted={tooltipData.isCompleted}
          onClose={() => setTooltipVisible(false)}
          onStart={handleStartLesson}
        />

        {/* Daily Rewards Popup */}
        <DailyRewardsPopup
          visible={showDailyReward}
          onClose={dismissDailyReward}
        />
      </View>
    </>
  );
}
