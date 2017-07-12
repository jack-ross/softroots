import React from "react";
import Chart from "./components/Chart.js";
import { StyleSheet, Text, View } from "react-native";

let data = require("./currentDataFinal.js");
let data2 = require("./pastDataFinal.js");

let dataSets = [
  {
    dataSet: data,
    style: {}
  },
  {
    dataSet: data2,
    style: {
      parent: {
        border: "1px solid #ccc"
      },
      data: {
        stroke: "#c43a31",
        strokeWidth: 3
      }
    }
  }
];

export default class App extends React.Component {
  render() {
    return (
      <View>
        <Chart
          dataSetsAndStyles={dataSets}
          graphType={"line"}
          xValueName={"time"}
          yValueName={"sales"}
          yTickFormatFunction={y => `$${y}`}
          xTickFormatFunction={x => `${x}:00`}
          chartStyle={{
            parent: {
              border: "10px solid #ccc"
            }
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
