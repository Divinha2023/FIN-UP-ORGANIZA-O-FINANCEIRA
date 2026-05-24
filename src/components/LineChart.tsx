import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Path, Polyline, Stop } from "react-native-svg";

import { colors, typography } from "@/theme/tokens";

type Point = {
  label: string;
  value: number;
};

type Props = {
  data: Point[];
  height?: number;
};

export function LineChart({ data, height = 150 }: Props) {
  const width = 320;
  const padding = 18;
  const values = data.map((point) => point.value);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const chartHeight = height - 26;

  const coordinates = data.map((point, index) => {
    const x = padding + (index * (width - padding * 2)) / Math.max(data.length - 1, 1);
    const ratio = (point.value - min) / Math.max(max - min, 1);
    const y = padding + (1 - ratio) * (chartHeight - padding);
    return { x, y };
  });

  const line = coordinates.map((point) => `${point.x},${point.y}`).join(" ");
  const area = `M ${coordinates[0].x} ${height - 22} L ${coordinates.map((point) => `${point.x} ${point.y}`).join(" L ")} L ${
    coordinates[coordinates.length - 1].x
  } ${height - 22} Z`;
  const last = coordinates[coordinates.length - 1];

  return (
    <View style={styles.container}>
      <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        <Defs>
          <LinearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={colors.green} stopOpacity="0.34" />
            <Stop offset="1" stopColor={colors.green} stopOpacity="0" />
          </LinearGradient>
        </Defs>
        <Path d={area} fill="url(#chartFill)" />
        <Polyline points={line} fill="none" stroke={colors.green} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        {coordinates.map((point) => (
          <Circle key={`${point.x}-${point.y}`} cx={point.x} cy={point.y} r="3.5" fill={colors.navy} stroke={colors.green} strokeWidth="2" />
        ))}
        <Circle cx={last.x} cy={last.y} r="5" fill={colors.green} />
      </Svg>
      <View style={styles.labels}>
        {data.map((point) => (
          <Text key={point.label} style={styles.label}>
            {point.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
    width: "100%"
  },
  labels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 18
  },
  label: {
    color: "rgba(245, 247, 250, 0.55)",
    fontFamily: typography.medium,
    fontSize: 11
  }
});
