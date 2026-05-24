import { StyleSheet, Text, View } from "react-native";

import { ProgressBar } from "@/components/ProgressBar";
import { colors, radius, typography } from "@/theme/tokens";
import type { CategorySummary } from "@/types";
import { currency } from "@/utils/format";

type Props = {
  category: CategorySummary;
};

export function CategoryRow({ category }: Props) {
  const Icon = category.icon;

  return (
    <View style={styles.row}>
      <View style={[styles.icon, { backgroundColor: `${category.color}24` }]}>
        <Icon color={category.color} size={17} strokeWidth={2.3} />
      </View>
      <View style={styles.content}>
        <View style={styles.topLine}>
          <Text style={styles.name}>{category.name}</Text>
          <Text style={styles.amount}>{currency(category.amount)}</Text>
        </View>
        <View style={styles.bottomLine}>
          <ProgressBar value={category.share / 100} color={category.color} height={6} />
          <Text style={styles.share}>{Math.round(category.share)}%</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12
  },
  icon: {
    alignItems: "center",
    borderRadius: radius.round,
    height: 36,
    justifyContent: "center",
    width: 36
  },
  content: {
    flex: 1,
    gap: 7
  },
  topLine: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  bottomLine: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10
  },
  name: {
    color: colors.ice,
    fontFamily: typography.semibold,
    fontSize: 13,
    fontWeight: "700"
  },
  amount: {
    color: "rgba(245, 247, 250, 0.74)",
    fontFamily: typography.medium,
    fontSize: 12
  },
  share: {
    color: "rgba(245, 247, 250, 0.56)",
    fontFamily: typography.medium,
    fontSize: 11,
    minWidth: 30,
    textAlign: "right"
  }
});
