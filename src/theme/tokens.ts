import { Platform, type ViewStyle } from "react-native";

export const colors = {
  green: "#00C853",
  greenDark: "#049A43",
  navy: "#0B1F33",
  petroleum: "#123A4A",
  petroleumSoft: "#174758",
  ink: "#071622",
  ice: "#F5F7FA",
  white: "#FFFFFF",
  line: "#D9E2EC",
  muted: "#5F6C7B",
  yellow: "#FFC857",
  red: "#FF4D4D",
  card: "#0E2B39",
  cardSoft: "#103647",
  surface: "rgba(245, 247, 250, 0.08)",
  surfaceStrong: "rgba(245, 247, 250, 0.14)",
  greenSoft: "rgba(0, 200, 83, 0.14)",
  yellowSoft: "rgba(255, 200, 87, 0.15)",
  redSoft: "rgba(255, 77, 77, 0.14)",
  shadow: "rgba(0, 0, 0, 0.28)"
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 18,
  xl: 26,
  round: 999
};

export const typography = {
  regular: "Inter, Manrope, Poppins, Arial, sans-serif",
  medium: "Inter, Manrope, Poppins, Arial, sans-serif",
  semibold: "Inter, Manrope, Poppins, Arial, sans-serif",
  bold: "Inter, Manrope, Poppins, Arial, sans-serif"
};

export const shadows: { card: ViewStyle } = {
  card:
    Platform.OS === "web"
      ? {
          boxShadow: `0 14px 24px ${colors.shadow}`
        }
      : {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 14 },
          shadowOpacity: 0.24,
          shadowRadius: 24,
          elevation: 8
        }
};
