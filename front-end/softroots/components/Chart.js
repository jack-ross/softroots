import React, { Component } from "react";
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryTheme,
  VictoryLine
} from "victory-native";

/* PROPS:
  dataSetsAndStyles: [obj]; array of objects with two fields: dataSet (the array of data for VictoryChart to
    use) and style (an object passed into VictoryBar/Line to style individual lines for each data set)
  graphType: string; possible values are "line" and "bar"; determines what type
    of graph gets rendered
  xValueName: string; the name of the value in data that's used for the x-axis
  yValueName: string; the name of the value in data that's used for the y-axis
  xTickFormatFunction: function; how the ticks along the x-axis should be displayed (as per VictoryChart)
  xTickFormatFunction: function; how the ticks along the y-axis should be displayed (as per VictoryChart)
  chartStyle: object; passed in as the style prop for the VictoryChart container
*/

export default class Chart extends Component {
  render() {
    // map through the data, creating the line/bar graphs as needed to be rendered
    // later on
    let graphs = this.props.dataSetsAndStyles.map(dataSetAndStyle => {
      if (this.props.graphType === "line") {
        return (
          <VictoryLine
            data={dataSetAndStyle.dataSet}
            x={this.props.xValueName}
            y={this.props.yValueName}
            style={dataSetAndStyle.style}
          />
        );
      } else if (this.props.graphType === "bar") {
        return (
          <VictoryBar
            data={dataSetAndStyle.dataSet}
            x={this.props.xValueName}
            y={this.props.yValueName}
            style={dataSetAndStyle.style}
          />
        );
      }
    });

    return (
      <VictoryChart
        domainPadding={0}
        theme={VictoryTheme.material}
        style={this.props.chartStyle}
      >
        <VictoryAxis tickFormat={this.props.xTickFormatFunction} />
        <VictoryAxis
          dependentAxis
          tickFormat={this.props.yTickFormatFunction}
        />
        {graphs}
      </VictoryChart>
    );
  }
}
