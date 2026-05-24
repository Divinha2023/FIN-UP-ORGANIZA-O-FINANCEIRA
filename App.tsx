import { useEffect, useState } from "react";
import { Platform, StatusBar, StyleSheet, useWindowDimensions, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { BottomNavigation } from "@/components/BottomNavigation";
import { BudgetScreen } from "@/screens/BudgetScreen";
import { DashboardScreen } from "@/screens/DashboardScreen";
import { GoalsScreen } from "@/screens/GoalsScreen";
import { OnboardingScreen } from "@/screens/OnboardingScreen";
import { ProfileScreen } from "@/screens/ProfileScreen";
import { SplashScreen } from "@/screens/SplashScreen";
import { TransactionsScreen } from "@/screens/TransactionsScreen";
import { FinanceProvider, useFinance } from "@/store/FinanceStore";
import { colors } from "@/theme/tokens";
import type { TabKey } from "@/types";

type Flow = "splash" | "onboarding" | "app";

function FinUpApp() {
  const { ready, state, completeOnboarding } = useFinance();
  const [flow, setFlow] = useState<Flow>("splash");
  const [activeTab, setActiveTab] = useState<TabKey>("home");
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    if (!ready) return undefined;
    const timer = setTimeout(() => setFlow(state.preferences.hasCompletedOnboarding ? "app" : "onboarding"), 850);
    return () => clearTimeout(timer);
  }, [ready, state.preferences.hasCompletedOnboarding]);

  const isWeb = Platform.OS === "web";
  const phoneStyle = isWeb
    ? {
        borderRadius: 36,
        height: Math.max(700, Math.min(920, height - 28)),
        width: Math.max(320, Math.min(430, width - 28))
      }
    : null;

  return (
    <LinearGradient colors={[colors.ink, colors.navy, "#062720"]} style={[styles.stage, isWeb && styles.webStage]}>
      <StatusBar barStyle="light-content" />
      <View style={[isWeb ? styles.webPhone : styles.phone, phoneStyle]}>
        {flow === "splash" ? (
          <SplashScreen />
        ) : flow === "onboarding" ? (
          <OnboardingScreen
            onFinish={() => {
              completeOnboarding();
              setFlow("app");
            }}
          />
        ) : (
          <View style={styles.appShell}>
            {activeTab === "home" && <DashboardScreen />}
            {activeTab === "transactions" && <TransactionsScreen />}
            {activeTab === "budget" && <BudgetScreen />}
            {activeTab === "goals" && <GoalsScreen />}
            {activeTab === "profile" && <ProfileScreen />}
            <BottomNavigation active={activeTab} onChange={setActiveTab} />
          </View>
        )}
      </View>
    </LinearGradient>
  );
}

export default function App() {
  return (
    <FinanceProvider>
      <FinUpApp />
    </FinanceProvider>
  );
}

const styles = StyleSheet.create({
  stage: {
    backgroundColor: colors.navy,
    flex: 1
  },
  webStage: {
    alignItems: "center",
    justifyContent: "center",
    padding: 14
  },
  phone: {
    backgroundColor: colors.navy,
    flex: 1,
    overflow: "hidden"
  },
  webPhone: {
    backgroundColor: colors.navy,
    borderColor: "rgba(245, 247, 250, 0.18)",
    borderWidth: 1,
    overflow: "hidden"
  },
  appShell: {
    backgroundColor: colors.navy,
    flex: 1,
    position: "relative"
  }
});
