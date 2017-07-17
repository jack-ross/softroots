import React, { Component } from "react";
import { Form, Input, Button } from "antd";
let FormItem = Form.Item;

/* PROPS:
  defaultValues (OPTIONAL): [objects]; values to be placed in the state (and accordingly 
    the Inputs) when this component is first rendered; each object MUST have the same
    fields as the field names in this.props.fields (see below)
  fields: [obj]; the fields that the inputs correspond to; each object has two fields:
    name: string; the name of the field being used as a key (i.e. "name")
    description: string; the description to be displayed to the user (i.e. "Enter Date of Birth:")
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

    // create dummy object with the fields that were passed in as props
    let initialValues = {};
    this.props.fields.map(field => {
      initialValues[field.name] = "";
    });
    this.state = {
      inputValues: {
        input_0: initialValues
      },
      count: 1
    };
  }

  componentWillMount() {
    // if default values are passed in, put them in the state to be rendered as Inputs
    if (this.props.defaultValues) {
      let updatedInputValues = {};
      this.props.defaultValues.map((dataObject, index) => {
        let key = `input_${index}`;
        updatedInputValues[key] = dataObject;
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
    let newValue = {};
    this.props.fields.map(field => {
      newValue[field.name] = "";
    });
    newInputValues[newInputKey] = newValue;

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
  onChange(event, field, key) {
    let newInputValues = this.state.inputValues;
    newInputValues[key][field] = event.target.value;
    this.setState({
      ...this.state,
      inputValues: newInputValues
    });
  }

  render() {
    console.log(this.state.inputValues);
    // grab the keys and sort them (so it's [input_0, input_1, ..., input_n] )
    const inputKeys = Object.keys(this.state.inputValues);
    const sortedKeys = inputKeys.sort((a, b) => {
      // from the strings input_a and input_b, grab the numbers a and b and compare them
      let firstIndexAsInt = parseInt(a.split("_")[1]);
      let secondIndexAsInt = parseInt(b.split("_")[1]);
      return firstIndexAsInt - secondIndexAsInt;
    });

    // map over the keys to create the Inputs to be rendered
    const inputs = sortedKeys.map(inputKey => {
      // map over the fields too
      const individualInputs = this.props.fields.map(field => {
        return (
          <div>
            <p>
              {" "}{field.description}{" "}
            </p>
            <Input
              value={this.state.inputValues[inputKey][field.name]}
              onChange={e => this.onChange(e, field.name, inputKey)}
            />
          </div>
        );
      });
      return (
        <div key={inputKey}>
          {individualInputs}
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
