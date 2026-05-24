import type { ComponentType } from "react";
import { Platform, Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import { Bell, Search } from "lucide-react-native";

import { Logo } from "@/components/Logo";
import { colors, radius, typography } from "@/theme/tokens";

type Props = {
  title?: string;
  subtitle?: string;
  actionIcon?: ComponentType<{ color?: string; size?: number; strokeWidth?: number }>;
};

export function ScreenHeader({ title, subtitle, actionIcon: ActionIcon }: Props) {
  return (
    <View style={styles.header}>
      <View style={styles.left}>
        {title ? (
          <>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </>
        ) : (
          <Logo compact />
        )}
      </View>
      <View style={styles.actions}>
        <Pressable accessibilityRole="button" style={styles.iconButton}>
          <Search color={colors.ice} size={18} strokeWidth={2.3} />
        </Pressable>
        <Pressable accessibilityRole="button" style={styles.iconButton}>
          {ActionIcon ? <ActionIcon color={colors.ice} size={18} strokeWidth={2.3} /> : <Bell color={colors.ice} size={18} strokeWidth={2.3} />}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) + 12 : 18
  },
  left: {
    flex: 1
  },
  title: {
    color: colors.ice,
    fontFamily: typography.bold,
    fontSize: 24,
    fontWeight: "800"
  },
  subtitle: {
    color: "rgba(245, 247, 250, 0.62)",
    fontFamily: typography.regular,
    fontSize: 13,
    marginTop: 4
  },
  actions: {
    flexDirection: "row",
    gap: 8
  },
  iconButton: {
    alignItems: "center",
    backgroundColor: "rgba(245, 247, 250, 0.08)",
    borderColor: "rgba(245, 247, 250, 0.08)",
    borderRadius: radius.round,
    borderWidth: 1,
    height: 38,
    justifyContent: "center",
    width: 38
  }
});
