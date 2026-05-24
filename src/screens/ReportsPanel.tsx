import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { GlassCard } from "@/components/GlassCard";
import { ProgressBar } from "@/components/ProgressBar";
import { useFinance } from "@/store/FinanceStore";
import { colors, radius, typography } from "@/theme/tokens";
import { currency } from "@/utils/format";

export function ReportsPanel() {
  const { categories, monthlyEvolution, reportInsights, snapshot } = useFinance();
  const circumference = 2 * Math.PI * 45;
  const maxMonth = Math.max(...monthlyEvolution.map((month) => month.value), 1);
  let offset = 0;

  return (
    <View style={styles.wrapper}>
      <GlassCard style={styles.revenueCard}>
        <Text style={styles.kicker}>Receitas x Despesas</Text>
        <View style={styles.donutRow}>
          <View style={styles.donutWrap}>
            <Svg width={122} height={122} viewBox="0 0 122 122">
              <Circle cx="61" cy="61" r="45" stroke="rgba(245,247,250,0.08)" strokeWidth="17" fill="none" />
              {(categories.length ? categories : [{ id: "empty", share: 100, color: colors.green }]).map((category) => {
                const dash = (category.share / 100) * circumference;
                const segment = (
                  <Circle
                    key={category.id}
                    cx="61"
                    cy="61"
                    r="45"
                    stroke={category.color}
                    strokeWidth="17"
                    fill="none"
                    strokeDasharray={`${dash} ${circumference - dash}`}
                    strokeDashoffset={-offset}
                    strokeLinecap="round"
                    transform="rotate(-90 61 61)"
                  />
                );
                offset += dash + 7;
                return segment;
              })}
            </Svg>
            <View style={styles.donutCenter}>
              <Text style={styles.donutValue}>{currency(snapshot.income)}</Text>
              <Text style={styles.donutLabel}>Receitas</Text>
            </View>
          </View>
          <View style={styles.legend}>
            <Text style={styles.legendValue}>{currency(snapshot.expenses)}</Text>
            <Text style={styles.legendLabel}>Despesas</Text>
            <Text style={styles.legendValueGreen}>{currency(snapshot.balance)}</Text>
            <Text style={styles.legendLabel}>Disponivel</Text>
          </View>
        </View>
      </GlassCard>

      <GlassCard>
        <Text style={styles.kicker}>Comparacao entre meses</Text>
        <View style={styles.monthBars}>
          {monthlyEvolution.map((month) => (
            <View key={month.label} style={styles.monthItem}>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { height: `${Math.max(10, (month.value / maxMonth) * 100)}%` }]} />
              </View>
              <Text style={styles.monthLabel}>{month.label}</Text>
            </View>
          ))}
        </View>
      </GlassCard>

      <GlassCard>
        <Text style={styles.kicker}>Insights financeiros</Text>
        <View style={styles.insights}>
          {reportInsights.map((insight) => {
            const Icon = insight.icon;
            return (
              <View key={insight.id} style={styles.insightRow}>
                <View style={styles.insightIcon}>
                  <Icon color={colors.green} size={18} strokeWidth={2.4} />
                </View>
                <View style={styles.insightTextWrap}>
                  <Text style={styles.insightTitle}>{insight.title}</Text>
                  <Text style={styles.insightBody}>{insight.body}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </GlassCard>

      <GlassCard>
        <Text style={styles.kicker}>Por categoria</Text>
        <View style={styles.categoryList}>
          {categories.length === 0 ? (
            <Text style={styles.insightBody}>Adicione despesas para gerar o ranking de categorias.</Text>
          ) : (
            categories.map((category) => (
              <View key={category.id} style={styles.categoryItem}>
                <View style={styles.categoryTop}>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryAmount}>{currency(category.amount)}</Text>
                </View>
                <ProgressBar value={category.share / 100} color={category.color} height={7} />
              </View>
            ))
          )}
        </View>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 16
  },
  revenueCard: {
    gap: 16
  },
  kicker: {
    color: colors.ice,
    fontFamily: typography.bold,
    fontSize: 15,
    fontWeight: "800"
  },
  donutRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  donutWrap: {
    alignItems: "center",
    height: 122,
    justifyContent: "center",
    width: 122
  },
  donutCenter: {
    alignItems: "center",
    position: "absolute"
  },
  donutValue: {
    color: colors.ice,
    fontFamily: typography.bold,
    fontSize: 13,
    fontWeight: "800"
  },
  donutLabel: {
    color: colors.green,
    fontFamily: typography.medium,
    fontSize: 10,
    marginTop: 2
  },
  legend: {
    flex: 1,
    paddingLeft: 18
  },
  legendValue: {
    color: colors.ice,
    fontFamily: typography.bold,
    fontSize: 17,
    fontWeight: "800"
  },
  legendValueGreen: {
    color: colors.green,
    fontFamily: typography.bold,
    fontSize: 17,
    fontWeight: "800",
    marginTop: 12
  },
  legendLabel: {
    color: "rgba(245,247,250,0.55)",
    fontFamily: typography.regular,
    fontSize: 12,
    marginTop: 2
  },
  monthBars: {
    alignItems: "flex-end",
    flexDirection: "row",
    gap: 12,
    height: 150,
    justifyContent: "space-between",
    marginTop: 18
  },
  monthItem: {
    alignItems: "center",
    flex: 1,
    gap: 8
  },
  barTrack: {
    backgroundColor: "rgba(245,247,250,0.08)",
    borderRadius: radius.round,
    height: 116,
    justifyContent: "flex-end",
    overflow: "hidden",
    width: "100%"
  },
  barFill: {
    backgroundColor: colors.green,
    borderRadius: radius.round,
    width: "100%"
  },
  monthLabel: {
    color: "rgba(245,247,250,0.56)",
    fontFamily: typography.medium,
    fontSize: 11
  },
  insights: {
    gap: 14,
    marginTop: 14
  },
  insightRow: {
    flexDirection: "row",
    gap: 12
  },
  insightIcon: {
    alignItems: "center",
    backgroundColor: colors.greenSoft,
    borderRadius: radius.round,
    height: 36,
    justifyContent: "center",
    width: 36
  },
  insightTextWrap: {
    flex: 1,
    gap: 3
  },
  insightTitle: {
    color: colors.ice,
    fontFamily: typography.semibold,
    fontSize: 13,
    fontWeight: "700"
  },
  insightBody: {
    color: "rgba(245,247,250,0.58)",
    fontFamily: typography.regular,
    fontSize: 12,
    lineHeight: 17
  },
  categoryList: {
    gap: 14,
    marginTop: 14
  },
  categoryItem: {
    gap: 8
  },
  categoryTop: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  categoryName: {
    color: colors.ice,
    fontFamily: typography.semibold,
    fontSize: 13,
    fontWeight: "700"
  },
  categoryAmount: {
    color: "rgba(245,247,250,0.62)",
    fontFamily: typography.medium,
    fontSize: 12
  }
});
