import type { ComponentType } from "react";
import { StyleSheet, Text, View } from "react-native";

import { GlassCard } from "@/components/GlassCard";
import { colors, radius, typography } from "@/theme/tokens";

type Props = {
  label: string;
  value: string;
  hint: string;
  color: string;
  icon: ComponentType<{ color?: string; size?: number; strokeWidth?: number }>;
};

export function MetricCard({ label, value, hint, color, icon: Icon }: Props) {
  return (
    <GlassCard style={styles.card}>
      <View style={[styles.iconWrap, { backgroundColor: `${color}22` }]}>
        <Icon color={color} size={18} strokeWidth={2.4} />
      </View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.hint}>{hint}</Text>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 138,
    padding: 13
  },
  iconWrap: {
    alignItems: "center",
    borderRadius: radius.md,
    height: 34,
    justifyContent: "center",
    marginBottom: 12,
    width: 34
  },
  label: {
    color: "rgba(245, 247, 250, 0.7)",
    fontFamily: typography.medium,
    fontSize: 12
  },
  value: {
    color: colors.ice,
    fontFamily: typography.bold,
    fontSize: 17,
    fontWeight: "800",
    marginTop: 5
  },
  hint: {
    color: "rgba(245, 247, 250, 0.55)",
    fontFamily: typography.regular,
    fontSize: 11,
    lineHeight: 15,
    marginTop: 4
  }
});
