import { Platform, Pressable, StyleSheet, Text, View, type ViewStyle } from "react-native";

import { colors, radius, typography } from "@/theme/tokens";

type Option<T extends string> = {
  label: string;
  value: T;
};

type Props<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
};

const webNoOutline =
  Platform.OS === "web"
    ? ({
        outlineColor: "transparent",
        outlineStyle: "solid",
        outlineWidth: 0
      } as ViewStyle)
    : null;

export function SegmentedControl<T extends string>({ options, value, onChange }: Props<T>) {
  return (
    <View style={styles.segment}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Pressable key={option.value} accessibilityRole="button" onPress={() => onChange(option.value)} style={[styles.option, active && styles.active, webNoOutline]}>
            <Text style={[styles.label, active && styles.activeLabel]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  segment: {
    backgroundColor: "rgba(245, 247, 250, 0.08)",
    borderRadius: radius.round,
    flexDirection: "row",
    gap: 4,
    padding: 4
  },
  option: {
    alignItems: "center",
    borderRadius: radius.round,
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 9
  },
  active: {
    backgroundColor: colors.ice
  },
  label: {
    color: "rgba(245, 247, 250, 0.7)",
    fontFamily: typography.semibold,
    fontSize: 12,
    fontWeight: "700"
  },
  activeLabel: {
    color: colors.navy
  }
});
