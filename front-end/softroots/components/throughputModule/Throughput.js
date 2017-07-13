import React, { Component } from "react";
import { Platform } from "react-native";
import Chart from "../Chart.js";
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
  Text,
  Right,
  Body,
  Left,
  Picker,
  Form,
  Footer,
  Item as FormItem
} from "native-base";
const Item = Picker.Item;

let data = require("../../currentDataFinal.js");
let data2 = require("../../pastDataFinal.js");

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

/* PROPS:
    None for now
*/

/* STATE:
    timeInterval: integer; how long an interval (in minutes) is being used to gauge the throughput
      (default is 60)
*/

export default class Throughput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeInterval: "60"
    };
  }

  onValueChange(value) {
    this.setState({
      timeInterval: value
    });
  }

  render() {
    return (
      <Container>
        <Header />
        <Content>
          <Text> Hello World! </Text>
          <Form>
            <Picker
              iosHeader="Select one"
              mode="dropdown"
              selectedValue={this.state.timeInterval}
              onValueChange={value => this.onValueChange(value)}
            >
              <Item label="10 Minutes" value="10" />
              <Item label="15 Minutes" value="15" />
              <Item label="30 Minutes" value="30" />
              <Item label="60 Minutes" value="60" />
            </Picker>
          </Form>
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
        </Content>
      </Container>
    );
  }
}
