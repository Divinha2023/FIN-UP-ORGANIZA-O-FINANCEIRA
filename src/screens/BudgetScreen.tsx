import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Plus, ShieldAlert, Trash2, X } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";

import { FormSheetModal } from "@/components/FormSheetModal";
import { GlassCard } from "@/components/GlassCard";
import { ProgressBar } from "@/components/ProgressBar";
import { ScreenHeader } from "@/components/ScreenHeader";
import { SegmentedControl } from "@/components/SegmentedControl";
import { getCategoryMeta } from "@/data/finance";
import { ReportsPanel } from "@/screens/ReportsPanel";
import { useFinance } from "@/store/FinanceStore";
import { colors, radius, shadows, typography } from "@/theme/tokens";
import type { BudgetProgress } from "@/types";
import { currency, parseMoney } from "@/utils/format";

type Mode = "budget" | "reports";

export function BudgetScreen() {
  const [mode, setMode] = useState<Mode>("budget");
  const [editingBudget, setEditingBudget] = useState<BudgetProgress | null>(null);
  const [budgetOpen, setBudgetOpen] = useState(false);
  const [cardOpen, setCardOpen] = useState(false);
  const [subscriptionOpen, setSubscriptionOpen] = useState(false);
  const [budgetCategory, setBudgetCategory] = useState("Alimentacao");
  const [limitText, setLimitText] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardBrand, setCardBrand] = useState("VISA");
  const [cardDigits, setCardDigits] = useState("");
  const [cardLimit, setCardLimit] = useState("");
  const [cardUsed, setCardUsed] = useState("");
  const [cardDueDate, setCardDueDate] = useState("");
  const [subscriptionName, setSubscriptionName] = useState("");
  const [subscriptionAmount, setSubscriptionAmount] = useState("");
  const [subscriptionDueDate, setSubscriptionDueDate] = useState("");
  const [subscriptionCategory, setSubscriptionCategory] = useState("Lazer");
  const { budgets, state, updateBudgetLimit, addCard, deleteCard, addSubscription, deleteSubscription } = useFinance();
  const monthLimit = budgets.reduce((sum, budget) => sum + budget.limit, 0);
  const monthSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const monthProgress = monthLimit > 0 ? monthSpent / monthLimit : 0;
  const alertBudget = budgets.find((budget) => budget.progress >= 0.8) ?? budgets[0];

  function openBudgetCreator() {
    setEditingBudget(null);
    setBudgetCategory("Alimentacao");
    setLimitText("");
    setBudgetOpen(true);
  }

  function openBudgetEditor(budget: BudgetProgress) {
    setEditingBudget(budget);
    setBudgetCategory(budget.category);
    setLimitText(String(budget.limit).replace(".", ","));
    setBudgetOpen(true);
  }

  function closeBudgetEditor() {
    setEditingBudget(null);
    setLimitText("");
    setBudgetOpen(false);
  }

  function saveLimit() {
    const category = editingBudget?.category ?? budgetCategory.trim();
    const parsed = parseMoney(limitText);
    if (!category || parsed <= 0) return;
    updateBudgetLimit(category, parsed);
    closeBudgetEditor();
  }

  function saveCard() {
    const limit = parseMoney(cardLimit);
    const used = parseMoney(cardUsed);
    if (!cardName.trim() || !cardDigits.trim() || limit <= 0) return;
    addCard({
      name: cardName.trim(),
      brand: cardBrand.trim() || "CARD",
      digits: cardDigits.trim().slice(-4),
      limit,
      used,
      dueDate: cardDueDate.trim() || "Sem data"
    });
    setCardName("");
    setCardBrand("VISA");
    setCardDigits("");
    setCardLimit("");
    setCardUsed("");
    setCardDueDate("");
    setCardOpen(false);
  }

  function saveSubscription() {
    const amount = parseMoney(subscriptionAmount);
    if (!subscriptionName.trim() || amount <= 0) return;
    addSubscription({
      name: subscriptionName.trim(),
      amount,
      dueDate: subscriptionDueDate.trim() || "Sem data",
      category: subscriptionCategory.trim() || "Outros"
    });
    setSubscriptionName("");
    setSubscriptionAmount("");
    setSubscriptionDueDate("");
    setSubscriptionCategory("Lazer");
    setSubscriptionOpen(false);
  }

  return (
    <View style={styles.root}>
      <ScreenHeader title="Orcamento" subtitle="Limites, cartoes e relatorios" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <SegmentedControl
          value={mode}
          onChange={setMode}
          options={[
            { label: "Planejamento", value: "budget" },
            { label: "Relatorios", value: "reports" }
          ]}
        />

        {mode === "reports" ? (
          <ReportsPanel />
        ) : (
          <>
            <LinearGradient colors={[colors.cardSoft, colors.card]} style={[styles.monthPlan, shadows.card]}>
              <View style={styles.monthHeader}>
                <View>
                  <Text style={styles.kicker}>Orcamento mensal</Text>
                  <Text style={styles.monthValue}>{currency(monthLimit)}</Text>
                </View>
                <Pressable accessibilityRole="button" onPress={budgets[0] ? () => openBudgetEditor(budgets[0]) : openBudgetCreator}>
                  <Text style={styles.edit}>{budgets[0] ? "Editar" : "Criar"}</Text>
                </Pressable>
              </View>
              <ProgressBar value={monthProgress} color={monthProgress > 0.9 ? colors.red : colors.green} height={10} />
              <Text style={styles.monthHint}>
                {currency(monthSpent)} gastos de {currency(monthLimit)}. Os limites sao salvos no dispositivo.
              </Text>
            </LinearGradient>

            {alertBudget && (
              <GlassCard style={styles.alertCard}>
                <View style={styles.alertIcon}>
                  <ShieldAlert color={alertBudget.progress >= 0.8 ? colors.yellow : colors.green} size={20} strokeWidth={2.4} />
                </View>
                <View style={styles.alertCopy}>
                  <Text style={styles.alertTitle}>{alertBudget.progress >= 0.8 ? `${alertBudget.category} esta perto do limite` : "Orcamento sob controle"}</Text>
                  <Text style={styles.alertText}>{alertBudget.trend}</Text>
                </View>
              </GlassCard>
            )}

            <GlassCard>
              <View style={styles.sectionRow}>
                <Text style={styles.sectionTitle}>Limites por categoria</Text>
                <Pressable accessibilityRole="button" onPress={openBudgetCreator} style={styles.smallAction}>
                  <Plus color={colors.navy} size={17} strokeWidth={2.7} />
                </Pressable>
              </View>
              <View style={styles.budgetList}>
                {budgets.length === 0 ? (
                  <Text style={styles.emptyText}>Nenhum limite cadastrado.</Text>
                ) : (
                  budgets.map((budget) => {
                    const warning = budget.progress > 0.8;
                    return (
                      <Pressable key={budget.id} accessibilityRole="button" onPress={() => openBudgetEditor(budget)} style={styles.budgetItem}>
                        <View style={styles.budgetTop}>
                          <View>
                            <Text style={styles.budgetName}>{budget.category}</Text>
                            <Text style={[styles.budgetTrend, warning && styles.warningText]}>{budget.trend}</Text>
                          </View>
                          <Text style={styles.budgetAmount}>
                            {currency(budget.spent)} <Text style={styles.limitMuted}>/ {currency(budget.limit)}</Text>
                          </Text>
                        </View>
                        <ProgressBar value={budget.progress} color={warning ? colors.red : budget.color} />
                      </Pressable>
                    );
                  })
                )}
              </View>
            </GlassCard>

            <GlassCard>
              <View style={styles.sectionRow}>
                <Text style={styles.sectionTitle}>Cartoes</Text>
                <Pressable accessibilityRole="button" onPress={() => setCardOpen(true)} style={styles.smallAction}>
                  <Plus color={colors.navy} size={17} strokeWidth={2.7} />
                </Pressable>
              </View>
              <View style={styles.cardList}>
                {state.cards.length === 0 ? (
                  <Text style={styles.emptyText}>Nenhum cartao cadastrado.</Text>
                ) : (
                  state.cards.map((card) => (
                    <LinearGradient key={card.id} colors={[card.color, colors.navy]} style={styles.creditCard}>
                      <View style={styles.cardTop}>
                        <View>
                          <Text style={styles.cardName}>{card.name}</Text>
                          <Text style={styles.cardDigits}>**** {card.digits}</Text>
                        </View>
                        <View style={styles.cardActions}>
                          <Text style={styles.cardBrand}>{card.brand}</Text>
                          <Pressable accessibilityRole="button" onPress={() => deleteCard(card.id)} style={styles.deleteSmall}>
                            <Trash2 color="rgba(245,247,250,0.75)" size={16} strokeWidth={2.2} />
                          </Pressable>
                        </View>
                      </View>
                      <View>
                        <Text style={styles.cardLimit}>{currency(card.used)}</Text>
                        <Text style={styles.cardMeta}>Fatura atual - vence {card.dueDate}</Text>
                      </View>
                      <ProgressBar value={card.limit > 0 ? card.used / card.limit : 0} color={colors.ice} height={7} />
                    </LinearGradient>
                  ))
                )}
              </View>
            </GlassCard>

            <GlassCard>
              <View style={styles.sectionRow}>
                <Text style={styles.sectionTitle}>Assinaturas recorrentes</Text>
                <Pressable accessibilityRole="button" onPress={() => setSubscriptionOpen(true)} style={styles.smallAction}>
                  <Plus color={colors.navy} size={17} strokeWidth={2.7} />
                </Pressable>
              </View>
              <View style={styles.subscriptionList}>
                {state.subscriptions.length === 0 ? (
                  <Text style={styles.emptyText}>Nenhuma assinatura cadastrada.</Text>
                ) : (
                  state.subscriptions.map((subscription) => {
                    const Icon = getCategoryMeta(subscription.category).icon;
                    return (
                      <View key={subscription.id} style={styles.subscriptionRow}>
                        <View style={styles.subscriptionIcon}>
                          <Icon color={colors.green} size={18} strokeWidth={2.4} />
                        </View>
                        <View style={styles.subscriptionCopy}>
                          <Text style={styles.subscriptionName}>{subscription.name}</Text>
                          <Text style={styles.subscriptionDue}>Vence {subscription.dueDate}</Text>
                        </View>
                        <Text style={styles.subscriptionAmount}>{currency(subscription.amount)}</Text>
                        <Pressable accessibilityRole="button" onPress={() => deleteSubscription(subscription.id)} style={styles.deleteSmall}>
                          <Trash2 color="rgba(245,247,250,0.62)" size={15} strokeWidth={2.2} />
                        </Pressable>
                      </View>
                    );
                  })
                )}
              </View>
            </GlassCard>
          </>
        )}
      </ScrollView>

      <FormSheetModal visible={budgetOpen} onClose={closeBudgetEditor}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{editingBudget ? "Editar limite" : "Novo limite"}</Text>
          <Pressable accessibilityRole="button" onPress={closeBudgetEditor} style={styles.close}>
            <X color={colors.ice} size={18} />
          </Pressable>
        </View>
        {editingBudget ? (
          <Text style={styles.modalHint}>{editingBudget.category}</Text>
        ) : (
          <TextInput value={budgetCategory} onChangeText={setBudgetCategory} placeholder="Categoria" placeholderTextColor="rgba(245,247,250,0.4)" style={styles.input} />
        )}
        <TextInput value={limitText} onChangeText={setLimitText} keyboardType="decimal-pad" placeholder="Ex. 850,00" placeholderTextColor="rgba(245,247,250,0.4)" style={styles.input} />
        <Pressable accessibilityRole="button" onPress={saveLimit} style={styles.saveButton}>
          <Text style={styles.saveText}>{editingBudget ? "Salvar limite" : "Criar limite"}</Text>
        </Pressable>
      </FormSheetModal>

      <FormSheetModal visible={cardOpen} onClose={() => setCardOpen(false)}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Novo cartao</Text>
          <Pressable accessibilityRole="button" onPress={() => setCardOpen(false)} style={styles.close}>
            <X color={colors.ice} size={18} />
          </Pressable>
        </View>
        <TextInput value={cardName} onChangeText={setCardName} placeholder="Nome do cartao" placeholderTextColor="rgba(245,247,250,0.4)" style={styles.input} />
        <TextInput value={cardBrand} onChangeText={setCardBrand} placeholder="Bandeira" placeholderTextColor="rgba(245,247,250,0.4)" style={styles.input} />
        <TextInput value={cardDigits} onChangeText={setCardDigits} keyboardType="number-pad" placeholder="4 ultimos digitos" placeholderTextColor="rgba(245,247,250,0.4)" style={styles.input} />
        <TextInput value={cardLimit} onChangeText={setCardLimit} keyboardType="decimal-pad" placeholder="Limite total" placeholderTextColor="rgba(245,247,250,0.4)" style={styles.input} />
        <TextInput value={cardUsed} onChangeText={setCardUsed} keyboardType="decimal-pad" placeholder="Fatura atual" placeholderTextColor="rgba(245,247,250,0.4)" style={styles.input} />
        <TextInput value={cardDueDate} onChangeText={setCardDueDate} placeholder="Vencimento, ex. 25/05" placeholderTextColor="rgba(245,247,250,0.4)" style={styles.input} />
        <Pressable accessibilityRole="button" onPress={saveCard} style={styles.saveButton}>
          <Text style={styles.saveText}>Salvar cartao</Text>
        </Pressable>
      </FormSheetModal>

      <FormSheetModal visible={subscriptionOpen} onClose={() => setSubscriptionOpen(false)}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Nova assinatura</Text>
          <Pressable accessibilityRole="button" onPress={() => setSubscriptionOpen(false)} style={styles.close}>
            <X color={colors.ice} size={18} />
          </Pressable>
        </View>
        <TextInput value={subscriptionName} onChangeText={setSubscriptionName} placeholder="Nome" placeholderTextColor="rgba(245,247,250,0.4)" style={styles.input} />
        <TextInput value={subscriptionAmount} onChangeText={setSubscriptionAmount} keyboardType="decimal-pad" placeholder="Valor mensal" placeholderTextColor="rgba(245,247,250,0.4)" style={styles.input} />
        <TextInput value={subscriptionDueDate} onChangeText={setSubscriptionDueDate} placeholder="Vencimento" placeholderTextColor="rgba(245,247,250,0.4)" style={styles.input} />
        <TextInput value={subscriptionCategory} onChangeText={setSubscriptionCategory} placeholder="Categoria" placeholderTextColor="rgba(245,247,250,0.4)" style={styles.input} />
        <Pressable accessibilityRole="button" onPress={saveSubscription} style={styles.saveButton}>
          <Text style={styles.saveText}>Salvar assinatura</Text>
        </Pressable>
      </FormSheetModal>
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
  monthPlan: {
    borderColor: "rgba(245,247,250,0.10)",
    borderRadius: 24,
    borderWidth: 1,
    gap: 14,
    padding: 18
  },
  monthHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  kicker: {
    color: "rgba(245,247,250,0.62)",
    fontFamily: typography.medium,
    fontSize: 12
  },
  monthValue: {
    color: colors.ice,
    fontFamily: typography.bold,
    fontSize: 28,
    fontWeight: "900",
    marginTop: 3
  },
  edit: {
    color: colors.green,
    fontFamily: typography.semibold,
    fontSize: 12,
    fontWeight: "700",
    marginTop: 3
  },
  monthHint: {
    color: "rgba(245,247,250,0.58)",
    fontFamily: typography.regular,
    fontSize: 12,
    lineHeight: 18
  },
  alertCard: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12
  },
  alertIcon: {
    alignItems: "center",
    backgroundColor: colors.yellowSoft,
    borderRadius: radius.round,
    height: 42,
    justifyContent: "center",
    width: 42
  },
  alertCopy: {
    flex: 1,
    gap: 4
  },
  alertTitle: {
    color: colors.ice,
    fontFamily: typography.bold,
    fontSize: 14,
    fontWeight: "800"
  },
  alertText: {
    color: "rgba(245,247,250,0.62)",
    fontFamily: typography.regular,
    fontSize: 12,
    lineHeight: 17
  },
  sectionTitle: {
    color: colors.ice,
    fontFamily: typography.bold,
    fontSize: 15,
    fontWeight: "800"
  },
  emptyText: {
    color: "rgba(245,247,250,0.58)",
    fontFamily: typography.regular,
    fontSize: 12,
    lineHeight: 18
  },
  sectionRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  smallAction: {
    alignItems: "center",
    backgroundColor: colors.green,
    borderRadius: radius.round,
    height: 32,
    justifyContent: "center",
    width: 32
  },
  budgetList: {
    gap: 17,
    marginTop: 16
  },
  budgetItem: {
    gap: 9
  },
  budgetTop: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between"
  },
  budgetName: {
    color: colors.ice,
    fontFamily: typography.semibold,
    fontSize: 14,
    fontWeight: "700"
  },
  budgetTrend: {
    color: "rgba(245,247,250,0.52)",
    fontFamily: typography.regular,
    fontSize: 11,
    marginTop: 2
  },
  warningText: {
    color: colors.yellow
  },
  budgetAmount: {
    color: colors.ice,
    fontFamily: typography.bold,
    fontSize: 12,
    fontWeight: "800",
    textAlign: "right"
  },
  limitMuted: {
    color: "rgba(245,247,250,0.42)"
  },
  cardList: {
    gap: 12,
    marginTop: 16
  },
  creditCard: {
    borderRadius: 18,
    gap: 20,
    minHeight: 160,
    padding: 18
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  cardName: {
    color: "rgba(245,247,250,0.72)",
    fontFamily: typography.medium,
    fontSize: 12
  },
  cardDigits: {
    color: colors.ice,
    fontFamily: typography.bold,
    fontSize: 18,
    fontWeight: "800",
    marginTop: 6
  },
  cardBrand: {
    color: colors.ice,
    fontFamily: typography.bold,
    fontSize: 18,
    fontWeight: "900"
  },
  cardActions: {
    alignItems: "flex-end",
    gap: 10
  },
  deleteSmall: {
    alignItems: "center",
    height: 28,
    justifyContent: "center",
    width: 28
  },
  cardLimit: {
    color: colors.ice,
    fontFamily: typography.bold,
    fontSize: 24,
    fontWeight: "900"
  },
  cardMeta: {
    color: "rgba(245,247,250,0.6)",
    fontFamily: typography.regular,
    fontSize: 12,
    marginTop: 3
  },
  subscriptionList: {
    gap: 14,
    marginTop: 16
  },
  subscriptionRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12
  },
  subscriptionIcon: {
    alignItems: "center",
    backgroundColor: colors.greenSoft,
    borderRadius: radius.round,
    height: 38,
    justifyContent: "center",
    width: 38
  },
  subscriptionCopy: {
    flex: 1,
    gap: 2
  },
  subscriptionName: {
    color: colors.ice,
    fontFamily: typography.semibold,
    fontSize: 13,
    fontWeight: "700"
  },
  subscriptionDue: {
    color: "rgba(245,247,250,0.52)",
    fontFamily: typography.regular,
    fontSize: 12
  },
  subscriptionAmount: {
    color: colors.ice,
    fontFamily: typography.bold,
    fontSize: 13,
    fontWeight: "800"
  },
  overlay: {
    backgroundColor: "rgba(7,22,34,0.72)",
    flex: 1,
    justifyContent: "flex-end"
  },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    gap: 14,
    padding: 20,
    paddingBottom: 28
  },
  modalHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  modalTitle: {
    color: colors.ice,
    fontFamily: typography.bold,
    fontSize: 20,
    fontWeight: "800"
  },
  modalHint: {
    color: "rgba(245,247,250,0.62)",
    fontFamily: typography.medium,
    fontSize: 13
  },
  close: {
    alignItems: "center",
    backgroundColor: "rgba(245,247,250,0.08)",
    borderRadius: radius.round,
    height: 36,
    justifyContent: "center",
    width: 36
  },
  input: {
    backgroundColor: "rgba(245,247,250,0.06)",
    borderColor: "rgba(245,247,250,0.09)",
    borderRadius: radius.md,
    borderWidth: 1,
    color: colors.ice,
    fontFamily: typography.regular,
    fontSize: 14,
    minHeight: 46,
    paddingHorizontal: 14
  },
  saveButton: {
    alignItems: "center",
    backgroundColor: colors.green,
    borderRadius: radius.md,
    justifyContent: "center",
    minHeight: 50
  },
  saveText: {
    color: colors.navy,
    fontFamily: typography.bold,
    fontSize: 15,
    fontWeight: "800"
  }
});
