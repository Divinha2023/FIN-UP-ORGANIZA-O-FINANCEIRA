import { ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowDownLeft, ArrowUpRight, CalendarClock, PiggyBank, TrendingDown, TrendingUp } from "lucide-react-native";

import { CategoryRow } from "@/components/CategoryRow";
import { ExpenseDonutChart } from "@/components/ExpenseDonutChart";
import { GlassCard } from "@/components/GlassCard";
import { MetricCard } from "@/components/MetricCard";
import { ProgressBar } from "@/components/ProgressBar";
import { ScreenHeader } from "@/components/ScreenHeader";
import { getCategoryMeta } from "@/data/finance";
import { useFinance } from "@/store/FinanceStore";
import { colors, radius, shadows, typography } from "@/theme/tokens";
import { compactCurrency, currency, percent } from "@/utils/format";

export function DashboardScreen() {
  const { snapshot, categories, state } = useFinance();
  const featuredGoal = state.goals[0];
  const hasActivity = state.transactions.length > 0;
  const hasExpenses = categories.length > 0;
  const TrendIcon = snapshot.trend >= 0 ? ArrowUpRight : TrendingDown;

  return (
    <View style={styles.root}>
      <ScreenHeader subtitle={new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "2-digit", month: "long" }).format(new Date())} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <LinearGradient colors={[colors.petroleumSoft, colors.card, colors.navy]} style={[styles.balanceCard, shadows.card]}>
          <View style={styles.balanceTop}>
            <Text style={styles.balanceLabel}>Saldo disponivel</Text>
            <View style={[styles.trendChip, snapshot.trend < 0 && styles.trendChipDanger]}>
              <TrendIcon color={snapshot.trend >= 0 ? colors.green : colors.red} size={14} strokeWidth={2.4} />
              <Text style={[styles.trendText, snapshot.trend < 0 && styles.trendTextDanger]}>
                {snapshot.trend >= 0 ? "+" : ""}
                {percent(snapshot.trend)}
              </Text>
            </View>
          </View>
          <Text style={styles.balanceValue}>{currency(snapshot.balance)}</Text>
          <Text style={styles.balanceHint}>{snapshot.alert}</Text>
        </LinearGradient>

        <GlassCard>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Despesas por categoria</Text>
            <Text style={styles.link}>{hasExpenses ? `${categories.length} categorias` : "vazio"}</Text>
          </View>
          {hasExpenses ? (
            <ExpenseDonutChart balance={snapshot.balance} categories={categories} total={snapshot.expenses} />
          ) : (
            <Text style={styles.emptyText}>Quando voce adicionar despesas, elas aparecem aqui separadas por cor.</Text>
          )}
        </GlassCard>

        <View style={styles.periodBlock}>
          <Text style={styles.blockTitle}>Gastos no periodo</Text>
          <View style={styles.metricGrid}>
            <MetricCard label="Receitas" value={compactCurrency(snapshot.income)} hint="Entradas deste mes" color={colors.green} icon={ArrowDownLeft} />
            <MetricCard label="Despesas" value={compactCurrency(snapshot.expenses)} hint="Gastos ate agora" color={colors.red} icon={ArrowUpRight} />
            <MetricCard label="Economia" value={compactCurrency(snapshot.savings)} hint="Guardado no mes" color={colors.yellow} icon={PiggyBank} />
          </View>
        </View>

        <GlassCard style={styles.insightCard}>
          <View style={styles.insightIcon}>
            <TrendingUp color={colors.green} size={22} strokeWidth={2.5} />
          </View>
          <View style={styles.insightCopy}>
            <Text style={styles.insightTitle}>{hasActivity ? (snapshot.balance >= 0 ? "Suas financas estao melhorando" : "Ajuste seu mes com calma") : "Sua area financeira esta zerada"}</Text>
            <Text style={styles.insightText}>
              {hasActivity ? `${snapshot.mainSpend}. Todos os numeros abaixo sao calculados pelos dados salvos no dispositivo.` : "Receitas, despesas, metas e limites aparecerao conforme voce preencher o app."}
            </Text>
          </View>
        </GlassCard>

        <GlassCard>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categorias com maiores gastos</Text>
            <Text style={styles.link}>{categories.length} itens</Text>
          </View>
          <View style={styles.listGap}>
            {categories.length === 0 ? (
              <Text style={styles.emptyText}>Adicione uma despesa para ver onde seu dinheiro esta indo.</Text>
            ) : (
              categories.slice(0, 3).map((category) => <CategoryRow key={category.id} category={category} />)
            )}
          </View>
        </GlassCard>

        <View style={styles.twoColumn}>
          <GlassCard style={styles.goalCard}>
            {featuredGoal ? (
              <>
                <Text style={styles.sectionTitle}>{featuredGoal.name}</Text>
                <Text style={styles.goalAmount}>
                  {currency(featuredGoal.saved)} <Text style={styles.goalMuted}>/ {currency(featuredGoal.target)}</Text>
                </Text>
                <ProgressBar value={featuredGoal.saved / featuredGoal.target} color={featuredGoal.accent} />
                <Text style={styles.goalDescription}>Faltam {currency(Math.max(featuredGoal.target - featuredGoal.saved, 0))} para bater sua meta.</Text>
              </>
            ) : (
              <Text style={styles.emptyText}>Crie uma meta para acompanhar seu progresso.</Text>
            )}
          </GlassCard>

          <GlassCard style={styles.billsCard}>
            <View style={styles.billsIcon}>
              <CalendarClock color={colors.yellow} size={20} strokeWidth={2.3} />
            </View>
            <Text style={styles.sectionTitle}>Proximas contas</Text>
            <View style={styles.billRows}>
              {state.subscriptions.length === 0 ? (
                <Text style={styles.emptyText}>Nenhuma conta recorrente cadastrada.</Text>
              ) : (
                state.subscriptions.slice(0, 2).map((subscription) => {
                  const Icon = getCategoryMeta(subscription.category).icon;
                  return (
                    <View key={subscription.id} style={styles.billRow}>
                      <View style={styles.billLine}>
                        <Icon color={colors.green} size={15} strokeWidth={2.3} />
                        <Text style={styles.billName}>{subscription.name}</Text>
                      </View>
                      <Text style={styles.billAmount}>{currency(subscription.amount)}</Text>
                    </View>
                  );
                })
              )}
            </View>
          </GlassCard>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1
  },
  content: {
    gap: 16,
    padding: 20,
    paddingBottom: 112
  },
  balanceCard: {
    borderColor: "rgba(245, 247, 250, 0.10)",
    borderRadius: 28,
    borderWidth: 1,
    overflow: "hidden",
    padding: 20
  },
  balanceTop: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  balanceLabel: {
    color: "rgba(245, 247, 250, 0.68)",
    fontFamily: typography.medium,
    fontSize: 13
  },
  trendChip: {
    alignItems: "center",
    backgroundColor: colors.greenSoft,
    borderRadius: radius.round,
    flexDirection: "row",
    gap: 3,
    paddingHorizontal: 9,
    paddingVertical: 5
  },
  trendChipDanger: {
    backgroundColor: colors.redSoft
  },
  trendText: {
    color: colors.green,
    fontFamily: typography.bold,
    fontSize: 12,
    fontWeight: "800"
  },
  trendTextDanger: {
    color: colors.red
  },
  balanceValue: {
    color: colors.ice,
    fontFamily: typography.bold,
    fontSize: 33,
    fontWeight: "900",
    marginTop: 10
  },
  balanceHint: {
    color: "rgba(245, 247, 250, 0.64)",
    fontFamily: typography.regular,
    fontSize: 13,
    marginBottom: 8,
    marginTop: 4
  },
  metricGrid: {
    flexDirection: "row",
    gap: 10
  },
  periodBlock: {
    gap: 10
  },
  blockTitle: {
    color: colors.ice,
    fontFamily: typography.bold,
    fontSize: 15,
    fontWeight: "800"
  },
  insightCard: {
    alignItems: "center",
    flexDirection: "row",
    gap: 13
  },
  insightIcon: {
    alignItems: "center",
    backgroundColor: colors.greenSoft,
    borderRadius: radius.round,
    height: 46,
    justifyContent: "center",
    width: 46
  },
  insightCopy: {
    flex: 1,
    gap: 4
  },
  insightTitle: {
    color: colors.ice,
    fontFamily: typography.bold,
    fontSize: 15,
    fontWeight: "800"
  },
  insightText: {
    color: "rgba(245, 247, 250, 0.62)",
    fontFamily: typography.regular,
    fontSize: 12,
    lineHeight: 18
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14
  },
  sectionTitle: {
    color: colors.ice,
    fontFamily: typography.bold,
    fontSize: 15,
    fontWeight: "800"
  },
  link: {
    color: colors.green,
    fontFamily: typography.semibold,
    fontSize: 12,
    fontWeight: "700"
  },
  listGap: {
    gap: 16
  },
  emptyText: {
    color: "rgba(245,247,250,0.58)",
    fontFamily: typography.regular,
    fontSize: 12,
    lineHeight: 18
  },
  twoColumn: {
    flexDirection: "row",
    gap: 12
  },
  goalCard: {
    flex: 1,
    gap: 10
  },
  goalAmount: {
    color: colors.ice,
    fontFamily: typography.bold,
    fontSize: 14,
    fontWeight: "800"
  },
  goalMuted: {
    color: "rgba(245,247,250,0.42)",
    fontSize: 12
  },
  goalDescription: {
    color: "rgba(245,247,250,0.62)",
    fontFamily: typography.regular,
    fontSize: 12,
    lineHeight: 17
  },
  billsCard: {
    flex: 1,
    gap: 12
  },
  billsIcon: {
    alignItems: "center",
    backgroundColor: colors.yellowSoft,
    borderRadius: radius.round,
    height: 42,
    justifyContent: "center",
    width: 42
  },
  billRows: {
    gap: 10
  },
  billRow: {
    gap: 2
  },
  billLine: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6
  },
  billName: {
    color: "rgba(245,247,250,0.7)",
    fontFamily: typography.medium,
    fontSize: 12
  },
  billAmount: {
    color: colors.ice,
    fontFamily: typography.bold,
    fontSize: 13,
    fontWeight: "800"
  }
});
