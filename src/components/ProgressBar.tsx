import { StyleSheet, View } from "react-native";

import { colors, radius } from "@/theme/tokens";

type Props = {
  value: number;
  color?: string;
  height?: number;
};

export function ProgressBar({ value, color = colors.green, height = 8 }: Props) {
  const progress = Math.min(Math.max(value, 0), 1);

  return (
    <View style={[styles.track, { height, borderRadius: height }]}>
      <View style={[styles.fill, { width: `${progress * 100}%`, backgroundColor: color, borderRadius: height }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: "rgba(245, 247, 250, 0.12)",
    overflow: "hidden",
    width: "100%"
  },
  fill: {
    height: "100%",
    minWidth: radius.sm
  }
});
