import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { Logo } from "@/components/Logo";
import { colors, typography } from "@/theme/tokens";

export function SplashScreen() {
  return (
    <LinearGradient colors={[colors.navy, colors.petroleum, colors.ink]} style={styles.container}>
      <View style={styles.gridLineTop} />
      <View style={styles.gridLineBottom} />
      <Logo centered />
      <Text style={styles.caption}>Organização, segurança e evolução financeira em um só lugar.</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    overflow: "hidden",
    padding: 32
  },
  caption: {
    color: "rgba(245, 247, 250, 0.68)",
    fontFamily: typography.regular,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 24,
    maxWidth: 290,
    textAlign: "center"
  },
  gridLineTop: {
    backgroundColor: "rgba(0, 200, 83, 0.16)",
    height: 1,
    left: 0,
    position: "absolute",
    right: 0,
    top: 120,
    transform: [{ rotate: "-18deg" }]
  },
  gridLineBottom: {
    backgroundColor: "rgba(245, 247, 250, 0.08)",
    bottom: 148,
    height: 1,
    left: -60,
    position: "absolute",
    right: -60,
    transform: [{ rotate: "-18deg" }]
  }
});
