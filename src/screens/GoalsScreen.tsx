import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Laptop, Plane, Plus, ShieldCheck, X } from "lucide-react-native";

import { FormSheetModal } from "@/components/FormSheetModal";
import { GlassCard } from "@/components/GlassCard";
import { ProgressBar } from "@/components/ProgressBar";
import { ScreenHeader } from "@/components/ScreenHeader";
import { useFinance } from "@/store/FinanceStore";
import { colors, radius, shadows, typography } from "@/theme/tokens";
import type { Goal } from "@/types";
import { currency, parseMoney, percent } from "@/utils/format";

const goalIcons = {
  Viagem: Plane,
  "Reserva de emergencia": ShieldCheck,
  "Notebook novo": Laptop
};

export function GoalsScreen() {
  const { state, addGoal, addGoalDeposit } = useFinance();
  const [createOpen, setCreateOpen] = useState(false);
  const [depositGoal, setDepositGoal] = useState<Goal | null>(null);
  const [goalName, setGoalName] = useState("");
  const [target, setTarget] = useState("");
  const [saved, setSaved] = useState("");
  const [deadline, setDeadline] = useState("");
  const [deposit, setDeposit] = useState("");
  const canCreate = goalName.trim().length > 1 && parseMoney(target) > 0;

  function resetGoalForm() {
    setGoalName("");
    setTarget("");
    setSaved("");
    setDeadline("");
  }

  function saveGoal() {
    if (!canCreate) return;
    addGoal({
      name: goalName.trim(),
      target: parseMoney(target),
      saved: parseMoney(saved),
      deadline: deadline.trim() || "Sem prazo"
    });
    resetGoalForm();
    setCreateOpen(false);
  }

  function saveDeposit() {
    if (!depositGoal) return;
    const parsed = parseMoney(deposit);
    if (parsed <= 0) return;
    addGoalDeposit(depositGoal.id, parsed);
    setDepositGoal(null);
    setDeposit("");
  }

  return (
    <View style={styles.root}>
      <ScreenHeader title="Metas" subtitle="Progresso simples para seus planos" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Pressable accessibilityRole="button" onPress={() => setCreateOpen(true)}>
          <GlassCard style={styles.createCard}>
            <View style={styles.createText}>
              <Text style={styles.createTitle}>Criar nova meta</Text>
              <Text style={styles.createBody}>Defina valor objetivo, prazo e acompanhe seu avanco.</Text>
            </View>
            <View style={styles.createIcon}>
              <Plus color={colors.navy} size={24} strokeWidth={2.8} />
            </View>
          </GlassCard>
        </Pressable>

        {state.goals.length === 0 && (
          <GlassCard>
            <Text style={styles.emptyText}>Nenhuma meta cadastrada.</Text>
          </GlassCard>
        )}

        {state.goals.map((goal) => {
          const Icon = goalIcons[goal.name as keyof typeof goalIcons] ?? ShieldCheck;
          const progress = goal.target > 0 ? goal.saved / goal.target : 0;

          return (
            <LinearGradient key={goal.id} colors={[goal.imageTone, colors.card]} style={[styles.goalCard, shadows.card]}>
              <View style={styles.goalHeader}>
                <View style={[styles.goalIcon, { backgroundColor: `${goal.accent}24` }]}>
                  <Icon color={goal.accent} size={24} strokeWidth={2.4} />
                </View>
                <View style={styles.goalMeta}>
                  <Text style={styles.goalName}>{goal.name}</Text>
                  <Text style={styles.goalDeadline}>Prazo: {goal.deadline}</Text>
                </View>
                <Text style={styles.goalPercent}>{percent(progress * 100)}</Text>
              </View>

              <View style={styles.goalVisual}>
                <View style={styles.visualLine} />
                <View style={[styles.visualBlock, { backgroundColor: goal.accent, width: `${Math.max(12, Math.min(progress * 100, 100))}%` }]} />
              </View>

              <View style={styles.amountRow}>
                <Text style={styles.amount}>{currency(goal.saved)}</Text>
                <Text style={styles.target}>de {currency(goal.target)}</Text>
              </View>
              <ProgressBar value={progress} color={goal.accent} height={9} />
              <Text style={styles.description}>Faltam {currency(Math.max(goal.target - goal.saved, 0))} para bater sua meta.</Text>
              <Pressable accessibilityRole="button" onPress={() => setDepositGoal(goal)} style={styles.depositButton}>
                <Text style={styles.depositText}>Adicionar valor guardado</Text>
              </Pressable>
            </LinearGradient>
          );
        })}
      </ScrollView>

      <FormSheetModal visible={createOpen} onClose={() => setCreateOpen(false)}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Nova meta</Text>
          <Pressable accessibilityRole="button" onPress={() => setCreateOpen(false)} style={styles.close}>
            <X color={colors.ice} size={18} />
          </Pressable>
        </View>
        <TextInput value={goalName} onChangeText={setGoalName} placeholder="Nome da meta" placeholderTextColor="rgba(245,247,250,0.4)" style={styles.input} />
        <TextInput value={target} onChangeText={setTarget} keyboardType="decimal-pad" placeholder="Valor objetivo" placeholderTextColor="rgba(245,247,250,0.4)" style={styles.input} />
        <TextInput value={saved} onChangeText={setSaved} keyboardType="decimal-pad" placeholder="Valor ja guardado" placeholderTextColor="rgba(245,247,250,0.4)" style={styles.input} />
        <TextInput value={deadline} onChangeText={setDeadline} placeholder="Prazo, ex. Dezembro 2026" placeholderTextColor="rgba(245,247,250,0.4)" style={styles.input} />
        <Pressable accessibilityRole="button" onPress={saveGoal} style={[styles.saveButton, !canCreate && styles.disabled]}>
          <Text style={styles.saveText}>Salvar meta</Text>
        </Pressable>
      </FormSheetModal>

      <FormSheetModal visible={!!depositGoal} onClose={() => setDepositGoal(null)}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Guardar valor</Text>
          <Pressable accessibilityRole="button" onPress={() => setDepositGoal(null)} style={styles.close}>
            <X color={colors.ice} size={18} />
          </Pressable>
        </View>
        <Text style={styles.modalHint}>{depositGoal?.name}</Text>
        <TextInput value={deposit} onChangeText={setDeposit} keyboardType="decimal-pad" placeholder="Ex. 320,00" placeholderTextColor="rgba(245,247,250,0.4)" style={styles.input} />
        <Pressable accessibilityRole="button" onPress={saveDeposit} style={styles.saveButton}>
          <Text style={styles.saveText}>Salvar progresso</Text>
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
  createCard: {
    alignItems: "center",
    flexDirection: "row",
    gap: 14
  },
  createText: {
    flex: 1,
    gap: 4
  },
  createTitle: {
    color: colors.ice,
    fontFamily: typography.bold,
    fontSize: 16,
    fontWeight: "800"
  },
  createBody: {
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
  createIcon: {
    alignItems: "center",
    backgroundColor: colors.green,
    borderRadius: radius.round,
    height: 48,
    justifyContent: "center",
    width: 48
  },
  goalCard: {
    borderColor: "rgba(245,247,250,0.10)",
    borderRadius: 26,
    borderWidth: 1,
    gap: 15,
    overflow: "hidden",
    padding: 18
  },
  goalHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12
  },
  goalIcon: {
    alignItems: "center",
    borderRadius: radius.round,
    height: 48,
    justifyContent: "center",
    width: 48
  },
  goalMeta: {
    flex: 1,
    gap: 3
  },
  goalName: {
    color: colors.ice,
    fontFamily: typography.bold,
    fontSize: 17,
    fontWeight: "800"
  },
  goalDeadline: {
    color: "rgba(245,247,250,0.56)",
    fontFamily: typography.regular,
    fontSize: 12
  },
  goalPercent: {
    color: colors.green,
    fontFamily: typography.bold,
    fontSize: 15,
    fontWeight: "800"
  },
  goalVisual: {
    backgroundColor: "rgba(245,247,250,0.07)",
    borderRadius: 18,
    height: 120,
    justifyContent: "flex-end",
    overflow: "hidden",
    padding: 16
  },
  visualLine: {
    backgroundColor: "rgba(245,247,250,0.22)",
    height: 1,
    left: 16,
    position: "absolute",
    right: 16,
    top: 48,
    transform: [{ rotate: "-14deg" }]
  },
  visualBlock: {
    borderRadius: 12,
    height: 42,
    opacity: 0.9
  },
  amountRow: {
    alignItems: "baseline",
    flexDirection: "row",
    gap: 7
  },
  amount: {
    color: colors.ice,
    fontFamily: typography.bold,
    fontSize: 20,
    fontWeight: "900"
  },
  target: {
    color: "rgba(245,247,250,0.48)",
    fontFamily: typography.medium,
    fontSize: 12
  },
  description: {
    color: "rgba(245,247,250,0.62)",
    fontFamily: typography.regular,
    fontSize: 12,
    lineHeight: 18
  },
  depositButton: {
    alignItems: "center",
    backgroundColor: "rgba(245,247,250,0.10)",
    borderRadius: radius.md,
    minHeight: 42,
    justifyContent: "center"
  },
  depositText: {
    color: colors.ice,
    fontFamily: typography.semibold,
    fontSize: 13,
    fontWeight: "700"
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
  disabled: {
    opacity: 0.46
  },
  saveText: {
    color: colors.navy,
    fontFamily: typography.bold,
    fontSize: 15,
    fontWeight: "800"
  }
});
