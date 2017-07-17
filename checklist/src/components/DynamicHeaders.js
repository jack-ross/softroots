import React, { Component } from "react";
import { Input, Button } from "antd";
import DynamicInput from "./DynamicInput.js";

/* PROPS:
    defaultValues (OPTIONAL): [obj]; intitial values to be rendered and displayed as Inputs if needed
*/

/* STATE:
    headerValues: object; keys take the form "input_n" where n is a positive number generated
      by count (see below); these keys are applied to each Header and its subtasks that are built
    count: int; number of times an input has been added; used to generate key for new inputs
*/

export default class DynamicHeaders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      headerValues: {
        header_0: {
          subtasks: [],
          headerTitle: ""
        }
      },
      count: 1
    };
  }

  componentWillMount() {
    // TODO make this work with the default values prop
  }

  // creates a new header with an input for its title and a DynamicInput for its subtasks
  addHeader() {
    let newHeaderKey = `header_${this.state.count}`;
    let newHeaderValues = this.state.headerValues;
    let newValue = {
      subtasks: [],
      headerTitle: ""
    };
    newHeaderValues[newHeaderKey] = newValue;

    this.setState({
      ...this.state,
      count: this.state.count + 1,
      headerValues: newHeaderValues
    });
  }

  // deletes the specified header + its data from the state
  deleteHeader(headerKey) {
    let modifiedHeaders = this.state.headerValues;
    console.log(headerKey);
    delete modifiedHeaders[headerKey];
    this.setState({
      ...this.state,
      headerValues: modifiedHeaders
    });
  }

  onHeaderTitleChange(event, headerKey) {
    let newHeaderValues = this.state.headerValues;
    newHeaderValues[headerKey].headerTitle = event.target.value;
    this.setState({
      ...this.state,
      headerValues: newHeaderValues
    });
  }

  render() {
    // grab all the header keys and sort them appropriately
    const headerKeys = Object.keys(this.state.headerValues);
    const sortedKeys = headerKeys.sort((a, b) => {
      // from the strings input_a and input_b, grab the numbers a and b and compare them
      let firstIndexAsInt = parseInt(a.split("_")[1]);
      let secondIndexAsInt = parseInt(b.split("_")[1]);
      return firstIndexAsInt - secondIndexAsInt;
    });

    // fields to be passed into DynamicInput
    const subtaskFields = [
      {
        name: "shortVersion",
        description: "Enter the short version to be displayed on the checklist."
      },
      {
        name: "longVersion",
        description: "Enter a more detailed description here."
      }
    ];

    const headerInputs = sortedKeys.map(headerKey => {
      return (
        <div>
          <h2> Header Title: </h2>
          <Input
            value={this.state.headerValues[headerKey].headerTitle}
            onChange={e => this.onHeaderTitleChange(e, headerKey)}
          />
          <DynamicInput
            defaultValues={this.state.headerValues[headerKey].subtasks}
            fields={subtaskFields}
          />
          <Button onClick={() => this.addHeader()}> Add Header </Button>
          <Button onClick={() => this.deleteHeader(headerKey)}>
            {" "}Delete Header{" "}
          </Button>
        </div>
      );
    });

    return (
      <div>
        {headerInputs}
      </div>
    );
  }
}
