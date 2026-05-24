import type { ComponentType } from "react";
import type { SvgProps } from "react-native-svg";

export type IconComponent = ComponentType<{ color?: string; size?: number; strokeWidth?: number }>;

export type FinanceType = "income" | "expense";

export type Transaction = {
  id: string;
  title: string;
  amount: number;
  type: FinanceType;
  category: string;
  dateISO: string;
  note?: string;
};

export type TransactionInput = Omit<Transaction, "id">;

export type CategorySummary = {
  id: string;
  name: string;
  amount: number;
  share: number;
  color: string;
  icon: IconComponent;
};

export type Budget = {
  id: string;
  category: string;
  limit: number;
  color: string;
};

export type BudgetProgress = Budget & {
  spent: number;
  progress: number;
  trend: string;
};

export type Goal = {
  id: string;
  name: string;
  target: number;
  saved: number;
  deadline: string;
  imageTone: string;
  accent: string;
};

export type GoalInput = Omit<Goal, "id" | "imageTone" | "accent">;

export type CreditCard = {
  id: string;
  name: string;
  brand: string;
  digits: string;
  limit: number;
  used: number;
  dueDate: string;
  color: string;
};

export type CreditCardInput = Omit<CreditCard, "id" | "color">;

export type Subscription = {
  id: string;
  name: string;
  dueDate: string;
  amount: number;
  category: string;
};

export type SubscriptionInput = Omit<Subscription, "id">;

export type FinancePreferences = {
  hasCompletedOnboarding: boolean;
  darkMode: boolean;
};

export type FinanceState = {
  version: number;
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  cards: CreditCard[];
  subscriptions: Subscription[];
  preferences: FinancePreferences;
};

export type FinanceSnapshot = {
  balance: number;
  income: number;
  expenses: number;
  savings: number;
  trend: number;
  alert: string;
  mainSpend: string;
};

export type MonthlyPoint = {
  label: string;
  value: number;
};

export type TabKey = "home" | "transactions" | "budget" | "goals" | "profile";

export type LogoMarkProps = SvgProps & {
  size?: number;
};
