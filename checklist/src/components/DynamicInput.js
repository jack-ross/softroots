import React, { Component } from "react";
import { Form, Input, Button } from "antd";
let FormItem = Form.Item;

/* PROPS:
  defaultValues (OPTIONAL): [string]; values to be placed in the state (and accordingly 
    the Inputs) when this component is first rendered
*/

/* STATE:
    inputValues: object; keys take the form "input_n" where n is a positive number generated
      by count (see below); these keys are applied to the Inputs that are rendered.  The values
      held by these Inputs are stored as the values in this object.
    count: int; number of times an input has been added; used to generate key for new inputs
*/

export default class DynamicInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValues: {
        input_0: ""
      },
      count: 1
    };
  }

  componentWillMount() {
    // if default values are passed in, put them in the state to be rendered as Inputs
    if (this.props.defaultValues) {
      let updatedInputValues = {};
      this.props.defaultValues.map((value, index) => {
        let key = `input_${index}`;
        updatedInputValues[key] = value;
      });

      this.setState({
        inputValues: updatedInputValues,
        count: this.props.defaultValues.length
      });
    }
  }

  // creates a new key and value for inputValues in the state; results in another
  // Input being rendered
  addInput() {
    let newInputKey = `input_${this.state.count}`;
    let newInputValues = this.state.inputValues;
    newInputValues[newInputKey] = "";

    this.setState({
      ...this.state,
      count: this.state.count + 1,
      inputValues: newInputValues
    });
  }

  // removes the specified Input's data from the state
  deleteInput(inputKey) {
    let modifiedInputs = this.state.inputValues;
    delete modifiedInputs[inputKey];
    this.setState({
      ...this.state,
      inputValues: modifiedInputs
    });
  }

  // while typing in an Input, the new value is reflected in the state
  onChange(event, key) {
    let newInputValues = this.state.inputValues;
    newInputValues[key] = event.target.value;
    this.setState({
      ...this.state,
      inputValues: newInputValues
    });
  }

  render() {
    // grab the keys and sort them (so it's [input_0, input_1, ..., input_n] )
    const inputKeys = Object.keys(this.state.inputValues);
    const sortedKeys = inputKeys.sort();

    // map over the keys to create the Inputs to be rendered
    const inputs = sortedKeys.map(inputKey => {
      return (
        <div>
          <Input
            key={inputKey}
            value={this.state.inputValues[inputKey]}
            onChange={e => this.onChange(e, inputKey)}
            name={inputKey}
          />
          <Button onClick={() => this.deleteInput(inputKey)}>Remove</Button>
        </div>
      );
    });

    // render everything
    return (
      <div>
        <Form>
          {inputs}
          <Button onClick={() => this.addInput()}>+ Add Another</Button>
        </Form>
      </div>
    );
  }
}
