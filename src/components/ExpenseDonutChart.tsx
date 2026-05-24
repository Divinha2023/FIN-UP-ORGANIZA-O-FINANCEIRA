import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { colors, radius, typography } from "@/theme/tokens";
import type { CategorySummary } from "@/types";
import { currency } from "@/utils/format";

type Props = {
  categories: CategorySummary[];
  balance: number;
  total: number;
};

export function ExpenseDonutChart({ balance, categories, total }: Props) {
  const size = 148;
  const center = size / 2;
  const radiusValue = 54;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * radiusValue;
  let offset = 0;

  return (
    <View style={styles.wrapper}>
      <View style={styles.chartWrap}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <Circle cx={center} cy={center} r={radiusValue} stroke="rgba(245,247,250,0.08)" strokeWidth={strokeWidth} fill="none" />
          {categories.map((category) => {
            const dash = Math.max(0, (category.share / 100) * circumference - 3);
            const segment = (
              <Circle
                key={category.id}
                cx={center}
                cy={center}
                r={radiusValue}
                stroke={category.color}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offset}
                strokeLinecap="round"
                transform={`rotate(-90 ${center} ${center})`}
              />
            );
            offset += (category.share / 100) * circumference;
            return segment;
          })}
        </Svg>
        <View style={styles.center}>
          <Text style={styles.centerValue}>{currency(total)}</Text>
          <Text style={styles.centerLabel}>Despesas</Text>
        </View>
      </View>

      <View style={styles.legend}>
        <View style={styles.summary}>
          <View>
            <Text style={styles.summaryValue}>{currency(total)}</Text>
            <Text style={styles.summaryLabel}>Despesas</Text>
          </View>
          <View>
            <Text style={[styles.summaryValue, balance >= 0 ? styles.available : styles.negative]}>{currency(balance)}</Text>
            <Text style={styles.summaryLabel}>Disponivel</Text>
          </View>
        </View>
        {categories.slice(0, 5).map((category) => (
          <View key={category.id} style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: category.color }]} />
            <Text style={styles.legendName} numberOfLines={1}>
              {category.name}
            </Text>
            <Text style={styles.legendShare}>{Math.round(category.share)}%</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    flexDirection: "row",
    gap: 16
  },
  chartWrap: {
    alignItems: "center",
    height: 148,
    justifyContent: "center",
    width: 148
  },
  center: {
    alignItems: "center",
    position: "absolute"
  },
  centerValue: {
    color: colors.ice,
    fontFamily: typography.bold,
    fontSize: 14,
    fontWeight: "900",
    maxWidth: 86,
    textAlign: "center"
  },
  centerLabel: {
    color: "rgba(245,247,250,0.58)",
    fontFamily: typography.medium,
    fontSize: 10,
    marginTop: 3
  },
  legend: {
    flex: 1,
    gap: 10
  },
  summary: {
    borderBottomColor: "rgba(245,247,250,0.08)",
    borderBottomWidth: 1,
    gap: 9,
    paddingBottom: 11
  },
  summaryValue: {
    color: colors.ice,
    fontFamily: typography.bold,
    fontSize: 15,
    fontWeight: "900"
  },
  available: {
    color: colors.green
  },
  negative: {
    color: colors.red
  },
  summaryLabel: {
    color: "rgba(245,247,250,0.55)",
    fontFamily: typography.regular,
    fontSize: 11,
    marginTop: 2
  },
  legendRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    minHeight: 22
  },
  legendDot: {
    borderRadius: radius.round,
    height: 9,
    width: 9
  },
  legendName: {
    color: "rgba(245,247,250,0.78)",
    flex: 1,
    fontFamily: typography.medium,
    fontSize: 12
  },
  legendShare: {
    color: colors.ice,
    fontFamily: typography.bold,
    fontSize: 12,
    fontWeight: "800",
    minWidth: 34,
    textAlign: "right"
  }
});
