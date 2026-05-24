import {
  Banknote,
  BriefcaseBusiness,
  Car,
  GraduationCap,
  HeartPulse,
  Home,
  Laptop,
  Plane,
  ReceiptText,
  Smartphone,
  Target,
  Utensils
} from "lucide-react-native";

import { colors } from "@/theme/tokens";
import type { FinanceState, IconComponent } from "@/types";

export const categoryCatalog: Record<string, { color: string; icon: IconComponent }> = {
  Alimentacao: { color: colors.yellow, icon: Utensils },
  Mercado: { color: "#FCD34D", icon: Utensils },
  Restaurante: { color: "#FB923C", icon: Utensils },
  Moradia: { color: colors.green, icon: Home },
  Aluguel: { color: "#34D399", icon: Home },
  Condominio: { color: "#6EE7B7", icon: Home },
  Energia: { color: "#FACC15", icon: Home },
  Agua: { color: "#38BDF8", icon: Home },
  Internet: { color: "#60A5FA", icon: Smartphone },
  Transporte: { color: "#7DE2D1", icon: Car },
  Combustivel: { color: "#2DD4BF", icon: Car },
  Estacionamento: { color: "#99F6E4", icon: Car },
  Manutencao: { color: "#94A3B8", icon: Car },
  Saude: { color: colors.red, icon: HeartPulse },
  Farmacia: { color: "#F87171", icon: HeartPulse },
  Consultas: { color: "#FB7185", icon: HeartPulse },
  Academia: { color: "#F43F5E", icon: HeartPulse },
  Lazer: { color: "#A78BFA", icon: Smartphone },
  Streaming: { color: "#C084FC", icon: Smartphone },
  Jogos: { color: "#818CF8", icon: Smartphone },
  Eventos: { color: "#F0ABFC", icon: Smartphone },
  Educacao: { color: "#7DD3FC", icon: GraduationCap },
  Cursos: { color: "#38BDF8", icon: GraduationCap },
  Livros: { color: "#93C5FD", icon: GraduationCap },
  Compras: { color: "#F472B6", icon: ReceiptText },
  Roupas: { color: "#FDA4AF", icon: ReceiptText },
  Beleza: { color: "#F9A8D4", icon: ReceiptText },
  Pets: { color: "#FDBA74", icon: ReceiptText },
  Viagem: { color: "#22D3EE", icon: Plane },
  Hospedagem: { color: "#67E8F9", icon: Plane },
  Presentes: { color: "#FDE047", icon: ReceiptText },
  Impostos: { color: "#CBD5E1", icon: ReceiptText },
  Seguros: { color: "#A3E635", icon: ReceiptText },
  Assinaturas: { color: "#A78BFA", icon: Smartphone },
  Familia: { color: "#FCA5A5", icon: Home },
  Trabalho: { color: "#86EFAC", icon: BriefcaseBusiness },
  Receitas: { color: colors.green, icon: Banknote },
  Outros: { color: colors.line, icon: ReceiptText }
};

export const expenseCategories = [
  "Alimentacao",
  "Mercado",
  "Restaurante",
  "Moradia",
  "Aluguel",
  "Condominio",
  "Energia",
  "Agua",
  "Internet",
  "Transporte",
  "Combustivel",
  "Estacionamento",
  "Manutencao",
  "Saude",
  "Farmacia",
  "Consultas",
  "Academia",
  "Lazer",
  "Streaming",
  "Jogos",
  "Eventos",
  "Educacao",
  "Cursos",
  "Livros",
  "Compras",
  "Roupas",
  "Beleza",
  "Pets",
  "Viagem",
  "Hospedagem",
  "Presentes",
  "Impostos",
  "Seguros",
  "Assinaturas",
  "Familia",
  "Trabalho",
  "Outros"
];

export function getCategoryMeta(category: string, type?: "income" | "expense") {
  if (type === "income") {
    return categoryCatalog.Receitas;
  }

  return categoryCatalog[category] ?? categoryCatalog.Outros;
}

export function getTransactionIcon(category: string, type: "income" | "expense") {
  if (type === "income") {
    return category === "Salario" ? BriefcaseBusiness : Banknote;
  }

  return getCategoryMeta(category, type).icon;
}

export const initialFinanceState: FinanceState = {
  version: 1,
  transactions: [],
  budgets: [],
  goals: [],
  cards: [],
  subscriptions: [],
  preferences: {
    hasCompletedOnboarding: true,
    darkMode: true
  }
};

export const onboarding = [
  {
    id: "o1",
    title: "Controle seus gastos sem complicacao",
    body: "Veja receitas, despesas e saldo disponivel em poucos segundos.",
    icon: ReceiptText
  },
  {
    id: "o2",
    title: "Transforme metas em progresso visual",
    body: "Acompanhe viagem, reserva e compras importantes com clareza.",
    icon: Target
  },
  {
    id: "o3",
    title: "Entenda melhor seu dinheiro",
    body: "Receba alertas simples sobre onde voce esta gastando mais.",
    icon: Laptop
  }
];

export const reportInsightIcons = {
  trend: Target,
  attention: ReceiptText,
  goal: Plane
};
