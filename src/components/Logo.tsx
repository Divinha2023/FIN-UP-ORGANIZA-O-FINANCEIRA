import { Text, View, StyleSheet } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from "react-native-svg";

import { colors, typography } from "@/theme/tokens";
import type { LogoMarkProps } from "@/types";

export function LogoMark({ size = 64, ...props }: LogoMarkProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none" {...props}>
      <Defs>
        <LinearGradient id="markGradient" x1="12" y1="54" x2="56" y2="12" gradientUnits="userSpaceOnUse">
          <Stop stopColor={colors.greenDark} />
          <Stop offset="1" stopColor={colors.green} />
        </LinearGradient>
      </Defs>
      <Path
        d="M32 7.5 51.5 15v15.5c0 12.3-8 21.6-19.5 26C20.5 52.1 12.5 42.8 12.5 30.5V15L32 7.5Z"
        fill="rgba(0, 200, 83, 0.12)"
        stroke="url(#markGradient)"
        strokeWidth="3"
      />
      <Path
        d="M19 39.5c8.8 1.7 20.1-3.1 27-17.5"
        stroke="url(#markGradient)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <Path
        d="M37 22h9v9"
        stroke="url(#markGradient)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M21 35V24M30 35V18M39 35V27" stroke="url(#markGradient)" strokeWidth="5" strokeLinecap="round" />
      <Circle cx="49" cy="17" r="2.5" fill={colors.green} />
    </Svg>
  );
}

type LogoProps = {
  compact?: boolean;
  centered?: boolean;
};

export function Logo({ compact = false, centered = false }: LogoProps) {
  return (
    <View style={[styles.logo, centered && styles.centered]}>
      <LogoMark size={compact ? 34 : 58} />
      <View>
        <Text style={[styles.wordmark, compact && styles.wordmarkCompact]}>
          Fin<Text style={styles.green}>Up</Text>
        </Text>
        {!compact && <Text style={styles.slogan}>Sua vida financeira no controle.</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10
  },
  centered: {
    flexDirection: "column",
    gap: 16
  },
  wordmark: {
    color: colors.ice,
    fontFamily: typography.bold,
    fontSize: 36,
    fontWeight: "800",
    letterSpacing: 0
  },
  wordmarkCompact: {
    fontSize: 24
  },
  green: {
    color: colors.green
  },
  slogan: {
    color: "rgba(245, 247, 250, 0.82)",
    fontFamily: typography.medium,
    fontSize: 13,
    marginTop: 3
  }
});
