import { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Plus, Trash2 } from "lucide-react-native";

import { AddTransactionModal } from "@/components/AddTransactionModal";
import { GlassCard } from "@/components/GlassCard";
import { ScreenHeader } from "@/components/ScreenHeader";
import { SegmentedControl } from "@/components/SegmentedControl";
import { getTransactionIcon } from "@/data/finance";
import { useFinance } from "@/store/FinanceStore";
import { colors, radius, shadows, typography } from "@/theme/tokens";
import type { FinanceType, Transaction } from "@/types";
import { currency, formatDateLabel } from "@/utils/format";

type Filter = "all" | FinanceType;

export function TransactionsScreen() {
  const [filter, setFilter] = useState<Filter>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const { state, snapshot, addTransaction, deleteTransaction } = useFinance();
  const visibleTransactions = state.transactions.filter((transaction) => filter === "all" || transaction.type === filter);
  const groups = visibleTransactions.reduce<Record<string, Transaction[]>>((acc, transaction) => {
    const label = formatDateLabel(transaction.dateISO);
    acc[label] = acc[label] ?? [];
    acc[label].push(transaction);
    return acc;
  }, {});

  function confirmDelete(transaction: Transaction) {
    Alert.alert("Excluir transacao?", `${transaction.title} sera removida do dispositivo.`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => deleteTransaction(transaction.id)
      }
    ]);
  }

  return (
    <View style={styles.root}>
      <ScreenHeader title="Transacoes" subtitle="Entradas e saidas organizadas" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <SegmentedControl
          value={filter}
          onChange={setFilter}
          options={[
            { label: "Todas", value: "all" },
            { label: "Receitas", value: "income" },
            { label: "Despesas", value: "expense" }
          ]}
        />

        <GlassCard style={styles.summary}>
          <Text style={styles.summaryLabel}>Movimentacao do mes</Text>
          <Text style={styles.summaryValue}>{currency(snapshot.income + snapshot.expenses)}</Text>
          <Text style={styles.summaryHint}>
            {state.transactions.length} transacoes salvas no dispositivo e {state.subscriptions.length} recorrencias ativas.
          </Text>
        </GlassCard>

        {visibleTransactions.length === 0 ? (
          <GlassCard>
            <Text style={styles.emptyText}>Nenhuma transacao nesse filtro. Toque em + para salvar a primeira.</Text>
          </GlassCard>
        ) : (
          Object.entries(groups).map(([date, items]) => (
            <View key={date} style={styles.group}>
              <Text style={styles.groupTitle}>{date}</Text>
              <View style={styles.transactionList}>
                {items.map((transaction) => {
                  const Icon = getTransactionIcon(transaction.category, transaction.type);
                  const isIncome = transaction.type === "income";
                  return (
                    <GlassCard key={transaction.id} style={styles.transaction} elevated={false}>
                      <View style={[styles.transactionIcon, { backgroundColor: isIncome ? colors.greenSoft : colors.yellowSoft }]}>
                        <Icon color={isIncome ? colors.green : colors.yellow} size={18} strokeWidth={2.4} />
                      </View>
                      <View style={styles.transactionCopy}>
                        <Text style={styles.transactionTitle}>{transaction.title}</Text>
                        <Text style={styles.transactionSubtitle}>{transaction.note || transaction.category}</Text>
                      </View>
                      <View style={styles.amountWrap}>
                        <Text style={[styles.transactionAmount, isIncome ? styles.income : styles.expense]}>
                          {isIncome ? "+" : "-"}
                          {currency(transaction.amount)}
                        </Text>
                        <Pressable accessibilityRole="button" onPress={() => confirmDelete(transaction)} style={styles.deleteButton}>
                          <Trash2 color="rgba(245,247,250,0.58)" size={15} strokeWidth={2.2} />
                        </Pressable>
                      </View>
                    </GlassCard>
                  );
                })}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <Pressable accessibilityRole="button" onPress={() => setModalOpen(true)} style={[styles.fab, shadows.card]}>
        <Plus color={colors.navy} size={28} strokeWidth={2.8} />
      </Pressable>
      <AddTransactionModal visible={modalOpen} onClose={() => setModalOpen(false)} onSave={addTransaction} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1
  },
  content: {
    gap: 18,
    padding: 20,
    paddingBottom: 120
  },
  summary: {
    gap: 5
  },
  summaryLabel: {
    color: "rgba(245,247,250,0.62)",
    fontFamily: typography.medium,
    fontSize: 12
  },
  summaryValue: {
    color: colors.ice,
    fontFamily: typography.bold,
    fontSize: 28,
    fontWeight: "900"
  },
  summaryHint: {
    color: "rgba(245,247,250,0.58)",
    fontFamily: typography.regular,
    fontSize: 12,
    lineHeight: 18
  },
  emptyText: {
    color: "rgba(245,247,250,0.62)",
    fontFamily: typography.regular,
    fontSize: 13,
    lineHeight: 19
  },
  group: {
    gap: 10
  },
  groupTitle: {
    color: colors.ice,
    fontFamily: typography.bold,
    fontSize: 15,
    fontWeight: "800"
  },
  transactionList: {
    gap: 10
  },
  transaction: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    padding: 13
  },
  transactionIcon: {
    alignItems: "center",
    borderRadius: radius.round,
    height: 40,
    justifyContent: "center",
    width: 40
  },
  transactionCopy: {
    flex: 1,
    gap: 3
  },
  transactionTitle: {
    color: colors.ice,
    fontFamily: typography.semibold,
    fontSize: 14,
    fontWeight: "700"
  },
  transactionSubtitle: {
    color: "rgba(245,247,250,0.52)",
    fontFamily: typography.regular,
    fontSize: 12
  },
  amountWrap: {
    alignItems: "flex-end",
    gap: 6
  },
  transactionAmount: {
    fontFamily: typography.bold,
    fontSize: 13,
    fontWeight: "800"
  },
  income: {
    color: colors.green
  },
  expense: {
    color: colors.ice
  },
  deleteButton: {
    alignItems: "center",
    height: 24,
    justifyContent: "center",
    width: 28
  },
  fab: {
    alignItems: "center",
    backgroundColor: colors.green,
    borderRadius: radius.round,
    bottom: 102,
    height: 58,
    justifyContent: "center",
    position: "absolute",
    right: 22,
    width: 58
  }
});
