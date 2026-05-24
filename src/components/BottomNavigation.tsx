import type { ComponentType } from "react";
import { Platform, Pressable, StyleSheet, Text, View, type ViewStyle } from "react-native";
import { ArrowLeftRight, House, Target, UserRound, WalletCards } from "lucide-react-native";

import { colors, radius, shadows, typography } from "@/theme/tokens";
import type { TabKey } from "@/types";

const items: Array<{
  key: TabKey;
  label: string;
  icon: ComponentType<{ color?: string; size?: number; strokeWidth?: number }>;
}> = [
  { key: "home", label: "Início", icon: House },
  { key: "transactions", label: "Transações", icon: ArrowLeftRight },
  { key: "budget", label: "Orçamento", icon: WalletCards },
  { key: "goals", label: "Metas", icon: Target },
  { key: "profile", label: "Perfil", icon: UserRound }
];

const webNoOutline =
  Platform.OS === "web"
    ? ({
        outlineColor: "transparent",
        outlineStyle: "solid",
        outlineWidth: 0
      } as ViewStyle)
    : null;

type Props = {
  active: TabKey;
  onChange: (tab: TabKey) => void;
};

export function BottomNavigation({ active, onChange }: Props) {
  return (
    <View style={[styles.nav, shadows.card]}>
      {items.map((item) => {
        const selected = item.key === active;
        const Icon = item.icon;
        return (
          <Pressable key={item.key} accessibilityRole="tab" onPress={() => onChange(item.key)} style={[styles.item, webNoOutline]}>
            <View style={[styles.iconWrap, selected && styles.activeIcon]}>
              <Icon color={selected ? colors.navy : "rgba(245, 247, 250, 0.7)"} size={18} strokeWidth={2.4} />
            </View>
            <Text style={[styles.label, selected && styles.activeLabel]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    alignItems: "center",
    backgroundColor: "rgba(7, 22, 34, 0.94)",
    borderColor: "rgba(245, 247, 250, 0.09)",
    borderRadius: 24,
    borderWidth: 1,
    bottom: 12,
    flexDirection: "row",
    gap: 2,
    left: 12,
    paddingHorizontal: 6,
    paddingVertical: 8,
    position: "absolute",
    right: 12
  },
  item: {
    alignItems: "center",
    flex: 1,
    gap: 4,
    justifyContent: "center"
  },
  iconWrap: {
    alignItems: "center",
    borderRadius: radius.round,
    height: 30,
    justifyContent: "center",
    width: 42
  },
  activeIcon: {
    backgroundColor: colors.green
  },
  label: {
    color: "rgba(245, 247, 250, 0.68)",
    fontFamily: typography.medium,
    fontSize: 10
  },
  activeLabel: {
    color: colors.ice,
    fontWeight: "700"
  }
});
