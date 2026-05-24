import { useEffect, useState } from "react";
import { Keyboard, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Check, ChevronDown, X } from "lucide-react-native";

import { FormSheetModal } from "@/components/FormSheetModal";
import { SegmentedControl } from "@/components/SegmentedControl";
import { expenseCategories, getCategoryMeta } from "@/data/finance";
import { colors, radius, typography } from "@/theme/tokens";
import type { FinanceType, TransactionInput } from "@/types";
import { currency, parseMoney, todayISO } from "@/utils/format";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (transaction: TransactionInput) => void;
};

export function AddTransactionModal({ visible, onClose, onSave }: Props) {
  const [type, setType] = useState<FinanceType>("expense");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Alimentacao");
  const [categoryPickerOpen, setCategoryPickerOpen] = useState(false);
  const [dateISO, setDateISO] = useState(todayISO());
  const [note, setNote] = useState("");
  const parsedAmount = parseMoney(amount);
  const canSave = title.trim().length > 1 && parsedAmount > 0 && dateISO.trim().length >= 10;

  useEffect(() => {
    if (!visible) return;
    setDateISO(todayISO());
  }, [visible]);

  useEffect(() => {
    if (type === "income") {
      setCategoryPickerOpen(false);
    }
  }, [type]);

  function reset() {
    setType("expense");
    setTitle("");
    setAmount("");
    setCategory("Alimentacao");
    setCategoryPickerOpen(false);
    setDateISO(todayISO());
    setNote("");
  }

  function save() {
    if (!canSave) return;

    onSave({
      title: title.trim(),
      amount: parsedAmount,
      type,
      category: type === "income" ? "Receitas" : category.trim() || "Outros",
      dateISO: dateISO.trim(),
      note: note.trim() || undefined
    });
    reset();
    onClose();
  }

  return (
    <FormSheetModal visible={visible} onClose={onClose}>
      <View style={styles.header}>
        <Text style={styles.title}>Adicionar transacao</Text>
        <Pressable accessibilityRole="button" onPress={onClose} style={styles.close}>
          <X color={colors.ice} size={18} />
        </Pressable>
      </View>

      <SegmentedControl
        value={type}
        onChange={setType}
        options={[
          { label: "Despesa", value: "expense" },
          { label: "Receita", value: "income" }
        ]}
      />

      <Text style={styles.amount}>{currency(parsedAmount)}</Text>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Descricao</Text>
        <TextInput value={title} onChangeText={setTitle} placeholder="Ex. Almoco" placeholderTextColor="rgba(245, 247, 250, 0.4)" style={styles.input} />
      </View>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Valor</Text>
        <TextInput value={amount} onChangeText={setAmount} keyboardType="decimal-pad" placeholder="Ex. 156,80" placeholderTextColor="rgba(245, 247, 250, 0.4)" style={styles.input} />
      </View>
      {type === "expense" && (
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Categoria</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              Keyboard.dismiss();
              setCategoryPickerOpen((current) => !current);
            }}
            style={styles.categorySelect}
          >
            <View style={styles.categorySelected}>
              <View style={[styles.categoryDot, { backgroundColor: getCategoryMeta(category, "expense").color }]} />
              <Text style={styles.categoryValue}>{category}</Text>
            </View>
            <ChevronDown color="rgba(245, 247, 250, 0.62)" size={18} strokeWidth={2.4} />
          </Pressable>
          {categoryPickerOpen && (
            <ScrollView nestedScrollEnabled showsVerticalScrollIndicator style={styles.categoryList} contentContainerStyle={styles.categoryListContent}>
              {expenseCategories.map((item) => {
                const meta = getCategoryMeta(item, "expense");
                const Icon = meta.icon;
                const selected = item === category;
                return (
                  <Pressable
                    key={item}
                    accessibilityRole="button"
                    onPress={() => {
                      setCategory(item);
                      setCategoryPickerOpen(false);
                    }}
                    style={[styles.categoryOption, selected && styles.categoryOptionSelected]}
                  >
                    <View style={[styles.categoryIcon, { backgroundColor: `${meta.color}24` }]}>
                      <Icon color={meta.color} size={16} strokeWidth={2.3} />
                    </View>
                    <Text style={styles.categoryOptionText}>{item}</Text>
                    {selected && <Check color={colors.green} size={17} strokeWidth={2.7} />}
                  </Pressable>
                );
              })}
            </ScrollView>
          )}
        </View>
      )}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Data</Text>
        <TextInput value={dateISO} onChangeText={setDateISO} placeholder="AAAA-MM-DD" placeholderTextColor="rgba(245, 247, 250, 0.4)" style={styles.input} />
      </View>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Observacao</Text>
        <TextInput value={note} onChangeText={setNote} placeholder="Opcional" placeholderTextColor="rgba(245, 247, 250, 0.4)" style={styles.input} />
      </View>

      <Pressable accessibilityRole="button" onPress={save} style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}>
        <Text style={styles.saveText}>Salvar no dispositivo</Text>
      </Pressable>
    </FormSheetModal>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  title: {
    color: colors.ice,
    fontFamily: typography.bold,
    fontSize: 20,
    fontWeight: "800"
  },
  close: {
    alignItems: "center",
    backgroundColor: "rgba(245, 247, 250, 0.08)",
    borderRadius: radius.round,
    height: 36,
    justifyContent: "center",
    width: 36
  },
  amount: {
    color: "rgba(245, 247, 250, 0.72)",
    fontFamily: typography.bold,
    fontSize: 34,
    fontWeight: "800",
    textAlign: "center"
  },
  fieldGroup: {
    gap: 7
  },
  label: {
    color: "rgba(245, 247, 250, 0.68)",
    fontFamily: typography.medium,
    fontSize: 12
  },
  input: {
    backgroundColor: "rgba(245, 247, 250, 0.06)",
    borderColor: "rgba(245, 247, 250, 0.09)",
    borderRadius: radius.md,
    borderWidth: 1,
    color: colors.ice,
    fontFamily: typography.regular,
    fontSize: 14,
    minHeight: 44,
    paddingHorizontal: 14
  },
  categorySelect: {
    alignItems: "center",
    backgroundColor: "rgba(245, 247, 250, 0.06)",
    borderColor: "rgba(245, 247, 250, 0.09)",
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 44,
    paddingHorizontal: 14
  },
  categorySelected: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: 9
  },
  categoryDot: {
    borderRadius: radius.round,
    height: 10,
    width: 10
  },
  categoryValue: {
    color: colors.ice,
    fontFamily: typography.regular,
    fontSize: 14
  },
  categoryList: {
    backgroundColor: "rgba(245, 247, 250, 0.05)",
    borderColor: "rgba(245, 247, 250, 0.09)",
    borderRadius: radius.md,
    borderWidth: 1,
    maxHeight: 228
  },
  categoryListContent: {
    padding: 6
  },
  categoryOption: {
    alignItems: "center",
    borderRadius: radius.md,
    flexDirection: "row",
    gap: 10,
    minHeight: 42,
    paddingHorizontal: 10
  },
  categoryOptionSelected: {
    backgroundColor: "rgba(0, 200, 83, 0.10)"
  },
  categoryIcon: {
    alignItems: "center",
    borderRadius: radius.round,
    height: 30,
    justifyContent: "center",
    width: 30
  },
  categoryOptionText: {
    color: colors.ice,
    flex: 1,
    fontFamily: typography.medium,
    fontSize: 13
  },
  saveButton: {
    alignItems: "center",
    backgroundColor: colors.green,
    borderRadius: radius.md,
    justifyContent: "center",
    minHeight: 50
  },
  saveButtonDisabled: {
    opacity: 0.46
  },
  saveText: {
    color: colors.navy,
    fontFamily: typography.bold,
    fontSize: 15,
    fontWeight: "800"
  }
});
