import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useMemo, useRef, useState, type PropsWithChildren } from "react";

import { getCategoryMeta, initialFinanceState, reportInsightIcons } from "@/data/finance";
import { colors } from "@/theme/tokens";
import type {
  Budget,
  BudgetProgress,
  CreditCardInput,
  CategorySummary,
  FinanceSnapshot,
  FinanceState,
  FinanceType,
  Goal,
  GoalInput,
  MonthlyPoint,
  SubscriptionInput,
  Transaction,
  TransactionInput
} from "@/types";
import { currency, shortMonth } from "@/utils/format";

const LEGACY_STORAGE_KEY = "@finup/local-finance-state/v1";
const STORAGE_KEY = "@finup/local-finance-state/v2";

type FinanceContextValue = {
  ready: boolean;
  state: FinanceState;
  snapshot: FinanceSnapshot;
  monthlyEvolution: MonthlyPoint[];
  categories: CategorySummary[];
  budgets: BudgetProgress[];
  reportInsights: Array<{ id: string; title: string; body: string; icon: typeof reportInsightIcons.trend }>;
  addTransaction: (input: TransactionInput) => void;
  deleteTransaction: (id: string) => void;
  addGoal: (input: GoalInput) => void;
  addGoalDeposit: (goalId: string, amount: number) => void;
  updateBudgetLimit: (category: string, limit: number) => void;
  addCard: (input: CreditCardInput) => void;
  deleteCard: (id: string) => void;
  addSubscription: (input: SubscriptionInput) => void;
  deleteSubscription: (id: string) => void;
  toggleDarkMode: () => void;
  completeOnboarding: () => void;
  resetLocalData: () => void;
};

const FinanceContext = createContext<FinanceContextValue | null>(null);

function createId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function isSameMonth(dateISO: string, reference = new Date()) {
  const date = new Date(`${dateISO}T12:00:00`);
  return date.getFullYear() === reference.getFullYear() && date.getMonth() === reference.getMonth();
}

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function transactionMonthKey(transaction: Transaction) {
  return transaction.dateISO.slice(0, 7);
}

function sumTransactions(transactions: Transaction[], type: FinanceType) {
  return transactions.filter((transaction) => transaction.type === type).reduce((sum, transaction) => sum + transaction.amount, 0);
}

function sortTransactions(transactions: Transaction[]) {
  return [...transactions].sort((a, b) => `${b.dateISO}-${b.id}`.localeCompare(`${a.dateISO}-${a.id}`));
}

function safeState(candidate: unknown): FinanceState {
  if (!candidate || typeof candidate !== "object") {
    return initialFinanceState;
  }

  const value = candidate as Partial<FinanceState>;
  return {
    ...initialFinanceState,
    ...value,
    transactions: Array.isArray(value.transactions) ? value.transactions : initialFinanceState.transactions,
    budgets: Array.isArray(value.budgets) ? value.budgets : initialFinanceState.budgets,
    goals: Array.isArray(value.goals) ? value.goals : initialFinanceState.goals,
    cards: Array.isArray(value.cards) ? value.cards : initialFinanceState.cards,
    subscriptions: Array.isArray(value.subscriptions) ? value.subscriptions : initialFinanceState.subscriptions,
    preferences: {
      ...initialFinanceState.preferences,
      ...(value.preferences ?? {})
    }
  };
}

function buildSnapshot(transactions: Transaction[]): FinanceSnapshot {
  const monthTransactions = transactions.filter((transaction) => isSameMonth(transaction.dateISO));
  const income = sumTransactions(monthTransactions, "income");
  const expenses = sumTransactions(monthTransactions, "expense");
  const balance = income - expenses;
  const previousMonth = new Date();
  previousMonth.setMonth(previousMonth.getMonth() - 1);
  const previousTransactions = transactions.filter((transaction) => isSameMonth(transaction.dateISO, previousMonth));
  const previousSavings = sumTransactions(previousTransactions, "income") - sumTransactions(previousTransactions, "expense");
  const hasMonthActivity = monthTransactions.length > 0;
  const trend = !hasMonthActivity && previousTransactions.length === 0 ? 0 : previousSavings === 0 ? (balance === 0 ? 0 : 100) : ((balance - previousSavings) / Math.abs(previousSavings)) * 100;

  const categoryTotals = new Map<string, number>();
  monthTransactions
    .filter((transaction) => transaction.type === "expense")
    .forEach((transaction) => categoryTotals.set(transaction.category, (categoryTotals.get(transaction.category) ?? 0) + transaction.amount));
  const topCategory = [...categoryTotals.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "despesas";

  return {
    balance,
    income,
    expenses,
    savings: Math.max(balance, 0),
    trend,
    alert: hasMonthActivity ? (balance >= 0 ? "Voce economizou mais este mes" : "Este mes fechou acima do previsto") : "Adicione receitas e despesas para acompanhar seu mes",
    mainSpend: topCategory === "despesas" ? "Ainda nao ha gastos registrados" : `Seu maior gasto foi com ${topCategory}`
  };
}

function buildMonthlyEvolution(transactions: Transaction[]): MonthlyPoint[] {
  const now = new Date();
  return Array.from({ length: 6 }).map((_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    const key = monthKey(date);
    const monthTransactions = transactions.filter((transaction) => transactionMonthKey(transaction) === key);
    const value = sumTransactions(monthTransactions, "income") - sumTransactions(monthTransactions, "expense");
    return { label: shortMonth(date), value: Math.max(value, 0) };
  });
}

function buildCategories(transactions: Transaction[]): CategorySummary[] {
  const monthTransactions = transactions.filter((transaction) => isSameMonth(transaction.dateISO) && transaction.type === "expense");
  const total = sumTransactions(monthTransactions, "expense");
  const grouped = new Map<string, number>();

  monthTransactions.forEach((transaction) => {
    grouped.set(transaction.category, (grouped.get(transaction.category) ?? 0) + transaction.amount);
  });

  return [...grouped.entries()]
    .map(([name, amount]) => {
      const meta = getCategoryMeta(name, "expense");
      return {
        id: name,
        name,
        amount,
        share: total > 0 ? (amount / total) * 100 : 0,
        color: meta.color,
        icon: meta.icon
      };
    })
    .sort((a, b) => b.amount - a.amount);
}

function buildBudgets(budgets: Budget[], transactions: Transaction[]): BudgetProgress[] {
  const monthExpenses = transactions.filter((transaction) => isSameMonth(transaction.dateISO) && transaction.type === "expense");

  return budgets.map((budget) => {
    const spent = monthExpenses.filter((transaction) => transaction.category === budget.category).reduce((sum, transaction) => sum + transaction.amount, 0);
    const progress = budget.limit > 0 ? spent / budget.limit : 0;
    const remaining = budget.limit - spent;
    const trend =
      progress >= 1
        ? "Limite ultrapassado"
        : progress >= 0.8
          ? "Perto do limite"
          : `Voce ainda pode gastar ${currency(Math.max(remaining, 0))}`;

    return {
      ...budget,
      spent,
      progress,
      trend
    };
  });
}

function buildReportInsights(snapshot: FinanceSnapshot, categories: CategorySummary[], goals: Goal[]) {
  const topCategory = categories[0];
  const firstGoal = goals[0];
  const hasActivity = snapshot.income > 0 || snapshot.expenses > 0;

  return [
    {
      id: "i-trend",
      icon: reportInsightIcons.trend,
      title: hasActivity ? (snapshot.balance >= 0 ? "Suas financas estao melhorando" : "Seu saldo precisa de atencao") : "Seu controle esta pronto",
      body: hasActivity
        ? snapshot.balance >= 0
          ? `Voce fechou o mes com ${currency(snapshot.savings)} disponivel.`
          : `As despesas passaram das receitas em ${currency(Math.abs(snapshot.balance))}.`
        : "Os relatorios serao calculados conforme voce registrar movimentacoes."
    },
    {
      id: "i-attention",
      icon: reportInsightIcons.attention,
      title: topCategory ? `${topCategory.name} foi seu maior gasto` : "Poucos gastos registrados",
      body: topCategory ? `Essa categoria representa ${Math.round(topCategory.share)}% das despesas do mes.` : "As categorias aparecem quando houver despesas salvas."
    },
    {
      id: "i-goal",
      icon: reportInsightIcons.goal,
      title: firstGoal ? `${firstGoal.name} em andamento` : "Crie sua primeira meta",
      body: firstGoal
        ? `Faltam ${currency(Math.max(firstGoal.target - firstGoal.saved, 0))} para bater sua meta.`
        : "Metas deixam seu progresso financeiro mais visual."
    }
  ];
}

export function FinanceProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<FinanceState>(initialFinanceState);
  const [ready, setReady] = useState(false);
  const hydrated = useRef(false);

  useEffect(() => {
    let active = true;

    async function hydrate() {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw && active) {
          setState(safeState(JSON.parse(raw)));
        }
        AsyncStorage.removeItem(LEGACY_STORAGE_KEY).catch(() => undefined);
      } catch {
        if (active) {
          setState(initialFinanceState);
        }
      } finally {
        hydrated.current = true;
        if (active) {
          setReady(true);
        }
      }
    }

    hydrate();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => undefined);
  }, [state]);

  const snapshot = useMemo(() => buildSnapshot(state.transactions), [state.transactions]);
  const monthlyEvolution = useMemo(() => buildMonthlyEvolution(state.transactions), [state.transactions]);
  const categories = useMemo(() => buildCategories(state.transactions), [state.transactions]);
  const budgets = useMemo(() => buildBudgets(state.budgets, state.transactions), [state.budgets, state.transactions]);
  const reportInsights = useMemo(() => buildReportInsights(snapshot, categories, state.goals), [categories, snapshot, state.goals]);

  const value = useMemo<FinanceContextValue>(
    () => ({
      ready,
      state: {
        ...state,
        transactions: sortTransactions(state.transactions)
      },
      snapshot,
      monthlyEvolution,
      categories,
      budgets,
      reportInsights,
      addTransaction(input) {
        setState((current) => ({
          ...current,
          transactions: sortTransactions([{ ...input, id: createId("t") }, ...current.transactions])
        }));
      },
      deleteTransaction(id) {
        setState((current) => ({
          ...current,
          transactions: current.transactions.filter((transaction) => transaction.id !== id)
        }));
      },
      addGoal(input) {
        const accentPool = [colors.green, colors.yellow, "#7DE2D1", "#A78BFA"];
        const tonePool = ["#1A6E7D", "#0F4C3A", "#263D64", "#123A4A"];
        const index = state.goals.length % accentPool.length;
        setState((current) => ({
          ...current,
          goals: [
            {
              ...input,
              id: createId("g"),
              accent: accentPool[index],
              imageTone: tonePool[index]
            },
            ...current.goals
          ]
        }));
      },
      addGoalDeposit(goalId, amount) {
        setState((current) => ({
          ...current,
          goals: current.goals.map((goal) => (goal.id === goalId ? { ...goal, saved: Math.min(goal.target, goal.saved + amount) } : goal))
        }));
      },
      updateBudgetLimit(category, limit) {
        setState((current) => {
          const exists = current.budgets.some((budget) => budget.category === category);
          const meta = getCategoryMeta(category, "expense");
          return {
            ...current,
            budgets: exists
              ? current.budgets.map((budget) => (budget.category === category ? { ...budget, limit } : budget))
              : [...current.budgets, { id: createId("b"), category, limit, color: meta.color }]
          };
        });
      },
      addCard(input) {
        const palette = ["#078A3D", colors.petroleumSoft, "#1A6E7D", "#263D64"];
        setState((current) => ({
          ...current,
          cards: [{ ...input, id: createId("c"), color: palette[current.cards.length % palette.length] }, ...current.cards]
        }));
      },
      deleteCard(id) {
        setState((current) => ({
          ...current,
          cards: current.cards.filter((card) => card.id !== id)
        }));
      },
      addSubscription(input) {
        setState((current) => ({
          ...current,
          subscriptions: [{ ...input, id: createId("s") }, ...current.subscriptions]
        }));
      },
      deleteSubscription(id) {
        setState((current) => ({
          ...current,
          subscriptions: current.subscriptions.filter((subscription) => subscription.id !== id)
        }));
      },
      toggleDarkMode() {
        setState((current) => ({
          ...current,
          preferences: {
            ...current.preferences,
            darkMode: !current.preferences.darkMode
          }
        }));
      },
      completeOnboarding() {
        setState((current) => ({
          ...current,
          preferences: {
            ...current.preferences,
            hasCompletedOnboarding: true
          }
        }));
      },
      resetLocalData() {
        setState(initialFinanceState);
      }
    }),
    [budgets, categories, monthlyEvolution, ready, reportInsights, snapshot, state]
  );

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error("useFinance must be used inside FinanceProvider");
  }

  return context;
}
