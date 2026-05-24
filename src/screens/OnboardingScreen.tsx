import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";

import { LogoMark } from "@/components/Logo";
import { onboarding } from "@/data/finance";
import { colors, radius, shadows, typography } from "@/theme/tokens";

type Props = {
  onFinish: () => void;
};

export function OnboardingScreen({ onFinish }: Props) {
  const [step, setStep] = useState(0);
  const item = onboarding[step];
  const Icon = item.icon;
  const isLast = step === onboarding.length - 1;

  function next() {
    if (isLast) {
      onFinish();
      return;
    }
    setStep((current) => current + 1);
  }

  return (
    <LinearGradient colors={[colors.navy, colors.petroleum, colors.ink]} style={styles.container}>
      <View style={styles.top}>
        <LogoMark size={42} />
        <Text style={styles.brand}>FinUp</Text>
      </View>

      <View style={[styles.illustration, shadows.card]}>
        <Svg width="100%" height="130" viewBox="0 0 290 130" fill="none">
          <Path d="M18 106C54 72 82 87 112 56C147 20 186 36 218 25C242 17 260 11 274 7" stroke={colors.green} strokeWidth="8" strokeLinecap="round" />
          <Path d="M219 25h40v39" stroke={colors.green} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M36 102V72M88 98V48M140 82V34M192 61V26" stroke="rgba(245,247,250,0.35)" strokeWidth="10" strokeLinecap="round" />
        </Svg>
        <View style={styles.iconBadge}>
          <Icon color={colors.green} size={34} strokeWidth={2.2} />
        </View>
      </View>

      <View style={styles.copy}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.body}>{item.body}</Text>
      </View>

      <View style={styles.dots}>
        {onboarding.map((dot, index) => (
          <View key={dot.id} style={[styles.dot, index === step && styles.dotActive]} />
        ))}
      </View>

      <Pressable accessibilityRole="button" onPress={next} style={styles.cta}>
        <Text style={styles.ctaText}>{isLast ? "Começar agora" : "Continuar"}</Text>
      </Pressable>
      <Pressable accessibilityRole="button" onPress={onFinish} style={styles.secondary}>
        <Text style={styles.secondaryText}>Entrar</Text>
      </Pressable>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: 24,
    paddingBottom: 34,
    paddingTop: 34
  },
  top: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10
  },
  brand: {
    color: colors.ice,
    fontFamily: typography.bold,
    fontSize: 24,
    fontWeight: "800"
  },
  illustration: {
    alignItems: "center",
    backgroundColor: "rgba(245, 247, 250, 0.07)",
    borderColor: "rgba(245, 247, 250, 0.10)",
    borderRadius: 30,
    borderWidth: 1,
    height: 250,
    justifyContent: "center",
    marginTop: 36,
    overflow: "hidden"
  },
  iconBadge: {
    alignItems: "center",
    backgroundColor: colors.greenSoft,
    borderColor: "rgba(0, 200, 83, 0.35)",
    borderRadius: radius.round,
    borderWidth: 1,
    height: 72,
    justifyContent: "center",
    marginTop: 18,
    width: 72
  },
  copy: {
    gap: 12,
    marginTop: 30
  },
  title: {
    color: colors.ice,
    fontFamily: typography.bold,
    fontSize: 30,
    fontWeight: "800",
    lineHeight: 36,
    textAlign: "center"
  },
  body: {
    color: "rgba(245, 247, 250, 0.68)",
    fontFamily: typography.regular,
    fontSize: 15,
    lineHeight: 23,
    textAlign: "center"
  },
  dots: {
    alignSelf: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 12
  },
  dot: {
    backgroundColor: "rgba(245, 247, 250, 0.24)",
    borderRadius: radius.round,
    height: 8,
    width: 8
  },
  dotActive: {
    backgroundColor: colors.green,
    width: 28
  },
  cta: {
    alignItems: "center",
    backgroundColor: colors.green,
    borderRadius: radius.md,
    justifyContent: "center",
    minHeight: 54
  },
  ctaText: {
    color: colors.navy,
    fontFamily: typography.bold,
    fontSize: 16,
    fontWeight: "800"
  },
  secondary: {
    alignItems: "center",
    paddingTop: 14
  },
  secondaryText: {
    color: "rgba(245, 247, 250, 0.72)",
    fontFamily: typography.medium,
    fontSize: 14
  }
});
