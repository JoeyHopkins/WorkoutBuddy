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
  
  //lines on chart will cycle this color list
  const colors = [
    "#6231ff",
    "#ff0000",
  ]

  const CanvasHeight = dimensions.height;
  const CanvasWidth = dimensions.width;
  const GRAPH_MARGIN = dimensions.margin;
  
  const graphHeight = CanvasHeight - GRAPH_MARGIN * 2;
  const graphWidth = CanvasWidth - GRAPH_MARGIN * 2;

  const font = useFont(require("./Roboto-Bold.ttf"), 10);
  
  const maxWeight = findMaxWeight(tableData) + 15;
  let minWeight = findMinWeight(tableData) - 10;

  if(minWeight < 30)
    minWeight = 0

  const minDate = findMinDate(tableData);
  minDate.setDate(minDate.getDate() - 1);
  
  let  maxDate = findMaxDate(tableData);
  maxDate.setDate(maxDate.getDate() + 1);
  
  const minDateConvert = minDate.toISOString().substring(0, 10).split('-')
  const maxDateConvert = maxDate.toISOString().substring(0, 10).split('-')
  
  const y = d3.scaleLinear()
  .domain([minWeight, maxWeight])
  .range([graphHeight, 0]);
  
  const x = d3.scaleTime().domain([
    new Date(parseInt(minDateConvert[0]), (parseInt(minDateConvert[1]) - 1), parseInt(minDateConvert[2])), 
    new Date(parseInt(maxDateConvert[0]), (parseInt(maxDateConvert[1]) - 1), parseInt(maxDateConvert[2]))
  ])
  .range([0, graphWidth]);
  
  const skPaths = [];

  tableData.forEach((data) => {
    if (data.length > 0) {

      const curvedLine = d3.line()
        .x((d) => x(new Date(d.date + 'T06:00:00.000Z')) + GRAPH_MARGIN)
        .y((d) => y(d.weight) + GRAPH_MARGIN)
        .curve(d3.curveNatural)(data);
    
      const skPath = Skia.Path.MakeFromSVGString(curvedLine);

      skPaths.push({ skPath });
    }
  });

  function findMaxWeight(data) {
    let maxWeight = Number.MIN_SAFE_INTEGER;
  
    data.forEach((array) => {
      array.forEach((item) => {
        const weight = parseFloat(item.weight);
        if (weight > maxWeight) {
          maxWeight = weight;
        }
      });
    });
  
    return maxWeight;
  }
  
  function findMinWeight(data) {
    let minWeight = Number.MAX_SAFE_INTEGER;
  
    data.forEach((array) => {
      array.forEach((item) => {
        const weight = parseFloat(item.weight);
        if (weight < minWeight) {
          minWeight = weight;
        }
      });
    });
  
    return minWeight;
  }
  
  function findMinDate(data) {
    let minDate = null;
  
    data.forEach((array) => {
      array.forEach((item) => {
        const date = new Date(item.date);
        if (!minDate || date < minDate) {
          minDate = date;
        }
      });
    });
  
    return minDate;
  }
  
  function findMaxDate(data) {
    let maxDate = null;
  
    data.forEach((array) => {
      array.forEach((item) => {
        const date = new Date(item.date);
        if (!maxDate || date > maxDate) {
          maxDate = date;
        }
      });
    });
  
    return maxDate;
  }

  if(!font)
    return <View/>

  return (
    <View style={styles.container}>

      <Canvas style={{ 
        width: CanvasWidth, 
        height: CanvasHeight,
        backgroundColor: 'lightblue',
      }}>

        {/* Draw the line paths */}
        {skPaths.map((path, index) => (
          <Path key={index} style="stroke" path={path.skPath} strokeWidth={4} color={colors[index % colors.length]} />
        ))}

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