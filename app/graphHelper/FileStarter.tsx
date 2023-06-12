import React from "react";
import { Canvas, Line, vec } from "@shopify/react-native-skia";
import { View, StyleSheet } from "react-native";

export const LineChart = () => {
  const GRAPH_HEIGHT = 475;
  const GRAPH_WIDTH = 360;

  return (
    <View style={styles.container}>
      <Canvas
        style={{
          width: GRAPH_WIDTH,
          height: GRAPH_HEIGHT,
        }}
      >
        <Line
          p1={vec(1e0, 10)}
          p2={vec(400, 10)}
          color="red"
          style="stroke"
          strokeWidth={1}
        />
        <Line
          p1={vec(1e0, 235)}
          p2={vec(400, 235)}
          color="lightgrey"
          style="stroke"
          strokeWidth={1}
        />
        <Line
          p1={vec(1e0, 460)}
          p2={vec(400, 460)}
          color="red"
          style="stroke"
          strokeWidth={1}
        />
      </Canvas>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
});