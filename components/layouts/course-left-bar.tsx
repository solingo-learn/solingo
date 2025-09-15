import { Link, router, usePathname } from "expo-router";
import { Pressable } from "react-native";
import { Image } from "expo-image";

import { Icon } from "@/components/icons";
import { Text, View } from "@/components/themed";
import { colors } from "@/constants/colors";
import { layouts } from "@/constants/layouts";
import { useBreakpoint } from "@/context/breakpoints";
import { useTheme } from "@/context/theme";
import { NavItem } from "@/types";

const splashLogo = require("@/assets/images/splash.png");

interface Props {
  navItems: NavItem[];
  appName: string;
}

export function CourseLeftBar({ navItems, appName }: Props) {
  const { border, accent, foreground } = useTheme();
  const breakpoint = useBreakpoint();
  const pathname = usePathname();

  return (
    <View
      style={{
        padding: layouts.padding * 2,
        borderRightWidth: layouts.borderWidth,
        borderRightColor: border,
        gap: layouts.padding,
      }}
    >
      <Link
        href="/learn"
        style={{
          paddingVertical: layouts.padding,
          paddingLeft: layouts.padding,
          alignItems: "center",
        }}
      >
        <Image
          source={splashLogo}
          style={{
            width: breakpoint == "xl" || breakpoint == "2xl" ? 120 : 40,
            height: breakpoint == "xl" || breakpoint == "2xl" ? 40 : 40,
          }}
          contentFit="contain"
        />
      </Link>
      {navItems.map((navItem, index) => {
        const isActive =
          pathname === navItem.href || pathname.startsWith(navItem.href);
        return (
          <Pressable key={index} onPress={() => router.push(navItem.href)}>
            {({ pressed, hovered }) => (
              <View
                style={{
                  flexDirection: "row",
                  gap: layouts.padding,
                  alignItems: "center",
                  paddingHorizontal:
                    breakpoint == "xl" || breakpoint == "2xl"
                      ? layouts.padding * 1.5
                      : layouts.padding,
                  paddingVertical: layouts.padding,
                  borderWidth: layouts.borderWidth,
                  borderRadius: layouts.padding,
                  borderColor: isActive ? border : colors.transparent,
                  backgroundColor:
                    pressed || hovered ? accent : colors.transparent,
                }}
              >
                <Icon
                  name={navItem.icon}
                  color={isActive ? foreground : undefined}
                />
                {(breakpoint == "xl" || breakpoint == "2xl") && (
                  <Text
                    style={{
                      fontWeight: "800",
                      textTransform: "uppercase",
                    }}
                  >
                    {navItem.label}
                  </Text>
                )}
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}
