import type { PropsWithChildren } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";

import { colors, radius, shadows } from "@/theme/tokens";

type Props = PropsWithChildren<{
  style?: ViewStyle | ViewStyle[];
  elevated?: boolean;
}>;

export function GlassCard({ children, style, elevated = true }: Props) {
  return <View style={[styles.card, elevated && shadows.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: "rgba(245, 247, 250, 0.10)",
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: "hidden",
    padding: 16
  }
});
