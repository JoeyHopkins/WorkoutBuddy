import React, { useEffect } from "react";

import {
  Canvas,
  Line,
  Path,
  Skia,
  Text,
  useFont,
} from "@shopify/react-native-skia";

import { View, StyleSheet } from "react-native";
import * as d3 from "d3";
import Utils from '../utils'

export const LineChart = (props) => {
  const { tableData, dimensions } = props; 
  
  let yScale = 10;

  const CanvasHeight = dimensions.height;
  const CanvasWidth = dimensions.width;
  const GRAPH_MARGIN = dimensions.margin;
  
  const graphHeight = CanvasHeight - GRAPH_MARGIN * 2;
  const graphWidth = CanvasWidth - GRAPH_MARGIN * 2;

  const font = useFont(require("./Roboto-Bold.ttf"), 10);

  const dates = tableData.map((val) => new Date(val.date));
  const min = Math.min(...tableData.map((val) => val.weight)) - yScale < 0 ? 
    Math.min(...tableData.map((val) => val.weight)) - yScale : 0

  const max = Math.max(...tableData.map((val) => val.weight)) + yScale;
  const minDate = new Date(Math.min(...dates));
  const maxDate = new Date(Math.max(...dates));
  const minDateConvert = minDate.toISOString().substring(0, 10).split('-')
  const maxDateConvert = maxDate.toISOString().substring(0, 10).split('-')

  const y = d3.scaleLinear()
    .domain([min, max])
    .range([graphHeight, 0]);
  
  const x = d3.scaleTime().domain([
    new Date(parseInt(minDateConvert[0]), (parseInt(minDateConvert[1]) - 1), parseInt(minDateConvert[2])), 
    new Date(parseInt(maxDateConvert[0]), (parseInt(maxDateConvert[1]) - 1), parseInt(maxDateConvert[2]))
  ])
    .range([0, graphWidth]);

  const curvedLine = d3.line()
    .x((d) => x(new Date(d.date + 'T06:00:00.000Z')) + GRAPH_MARGIN)
    .y((d) => y(d.weight) + GRAPH_MARGIN)
    .curve(d3.curveNatural)(tableData);
  
  const skPath = Skia.Path.MakeFromSVGString(curvedLine);

  if(!font)
    return <View/>

  return (
    <View style={styles.container}>

      <Canvas style={{ 
        width: CanvasWidth, 
        height: CanvasHeight,
        backgroundColor: 'lightblue',
      }}>

        {/* Draw the line path */}
        <Path style="stroke" path={skPath} strokeWidth={4} color="#6231ff" />

        {/* Draw the y-axis ticks and labels */}
        {y.ticks().map((tick, index) => (
          <React.Fragment key={index}>
            {/* Draw tick line */}
            <Line
              p1={{ x: graphWidth + GRAPH_MARGIN, y: y(tick) + GRAPH_MARGIN }}
              p2={{ x: GRAPH_MARGIN - 5, y: y(tick) + GRAPH_MARGIN }}
              color="black"
              style="stroke"
              strokeWidth={1}
            />
            {/* Draw tick label */}
            <Text font={font} x={10} y={y(tick) + GRAPH_MARGIN} text={tick.toString()} />
          </React.Fragment>
        ))}

        {/* Draw the x-axis ticks and labels */}
        {x.ticks(d3.timeDay).map((t, i) => (
          <React.Fragment key={i}>
            {/* Draw tick line */}
            <Line
              p1={{ x: x(t) + GRAPH_MARGIN, y: GRAPH_MARGIN }}
              p2={{ x: x(t) + GRAPH_MARGIN, y: graphHeight + GRAPH_MARGIN + 5}}
              color="black"
              style="stroke"
              strokeWidth={1}
            />
            {/* Draw tick label */}
            <Text font={font} x={x(t) + GRAPH_MARGIN} y={CanvasHeight - GRAPH_MARGIN / 2} text={Utils.formatDate(t)} />
          </React.Fragment>
        ))}
      </Canvas>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "white",
    flex: 1,
  },
});