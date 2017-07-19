import React, { Component } from "react";
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
  arrayMove
} from "react-sortable-hoc";
import { Input, Icon, Button } from "antd";

/* PROPS
    fields: [obj]
      field: string
      prompt: string
    initialValues (OPTIONAL): [obj]
      field1: string
      ...
      field_n: string
*/

/* STATE
    values: [obj]; same format as this.props.defaultValues
*/

// the drag handle made from Higher Order Component
const DragHandle = SortableHandle(() => <Icon type="bars" />); // This can be any component you want

// the Higher Order Component we'll use to create these inputs
const SortableItem = SortableElement(
  ({
    fieldObjects,
    dataObject,
    handleInputChange,
    removeInputs,
    indexForChange
  }) => {
    // map through the props to create the inputs
    let inputs = fieldObjects.map(fieldObject => {
      let prompt = fieldObject.prompt;
      let field = fieldObject.field;
      return (
        <div>
          <h3>
            {" "}{prompt}{" "}
          </h3>
          <Input
            value={dataObject[field]}
            onChange={e => handleInputChange(e, field, indexForChange)}
          />
        </div>
      );
    });

    // return those inputs and a DragHandle inside a list item
    return (
      <li>
        <DragHandle />
        {inputs}
        <Button onClick={() => removeInputs(indexForChange)}> Remove </Button>
      </li>
    );
  }
);

// the Higher Order Container we'll use to hold these items
const SortableList = SortableContainer(
  ({ dataObjects, fieldObjects, handleInputChange, removeInputs }) => {
    return (
      <ul>
        {dataObjects.map((dataObject, index) =>
          <SortableItem
            key={`item-${index}`}
            index={index}
            indexForChange={index}
            fieldObjects={fieldObjects}
            dataObject={dataObject}
            handleInputChange={handleInputChange}
            removeInputs={removeInputs}
          />
        )}
      </ul>
    );
  }
);

// finally the class itself
export default class DraggableInputs extends Component {
  constructor(props) {
    super(props);

    // set values to initialValues if prop passed down, otherwise
    // make them all empty strings
    let values = [];
    if (this.props.initialValues) {
      values = this.props.initialValues;
    } else {
      let defaultValue = {};
      this.props.fields.map(field => {
        defaultValue[field.field] = "";
      });
      values.push(defaultValue);
    }

    this.state = {
      values: values
    };
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    let values = this.state.values;
    this.setState({
      values: arrayMove(values, oldIndex, newIndex)
    });
  };

  handleInputChange(event, field, index) {
    let values = this.state.values;
    values[index][field] = event.target.value;
    this.setState({
      ...this.state,
      values: values
    });
  }

  addInputs() {
    let values = this.state.values;
    let newValue = {};
    this.props.fields.map(field => {
      newValue[field.field] = "";
    });
    values.push(newValue);
    this.setState({
      ...this.state,
      values: values
    });
  }

  removeInputs(index) {
    console.log(index);
    let values = this.state.values;
    values.splice(index, 1);
    this.setState({
      ...this.state,
      values: values
    });
  }

  render() {
    let values = this.state.values;

    return (
      <div>
        <SortableList
          dataObjects={this.state.values}
          fieldObjects={this.props.fields}
          handleInputChange={(e, field, index) =>
            this.handleInputChange(e, field, index)}
          removeInputs={index => this.removeInputs(index)}
          onSortEnd={this.onSortEnd}
          useDragHandle={true}
        />
        <Button onClick={() => this.addInputs()}> Add Another </Button>
      </div>
    );
  }
}
