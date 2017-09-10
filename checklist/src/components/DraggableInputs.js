import React, { Component } from "react";
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
  arrayMove
} from "react-sortable-hoc";
import { Input, Button, Card, Select } from "antd";
import dragIcon from "../images/drag.png";
import displayConfirmDeleteModal from "../helperFunctions/displayConfirmDeleteModal.js";
import "../css/DraggableInputs.css";

/* PROPS
    fields: [obj]
      field: string
      prompt: string
    values: [obj]
      field1: string
      ...
      field_n: string
    updateParent: function; updates the parent with the data
*/

// the drag handle made from Higher Order Component
const DragHandle = SortableHandle(() => (
  <img src={dragIcon} alt="DragIcon" height="15" />
));

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
        <div className="singleInput">
          <h3> {prompt} </h3>
          <Input
            type="textarea"
            autosize
            value={dataObject[field]}
            onChange={e =>
              handleInputChange(e.target.value, field, indexForChange)}
            maxLength={2000}
            placeholder="(max 2000 characters)"
          />
        </div>
      );
    });

    // return those inputs and a DragHandle inside a list item
    return (
      <li>
        <Card>
          <div className="flexContainer">
            <div className="dragHandle">
              <DragHandle />
            </div>

            {inputs}
          </div>

          <div style={{ margin: "10px 0" }} />

          <Select
            value={dataObject.displayType}
            style={{ width: "90px" }}
            onChange={value =>
              handleInputChange(value, "displayType", indexForChange)}
          >
            <Select.Option value="checkbox"> Checkbox </Select.Option>
            <Select.Option value="input"> Input </Select.Option>
            <Select.Option value="scale"> Scale </Select.Option>
          </Select>

          <Button
            icon="close-circle-o"
            type="danger"
            onClick={() =>
              displayConfirmDeleteModal(() => removeInputs(indexForChange))}
          >
            {" "}
            Remove Task{" "}
          </Button>
        </Card>
        <div style={{ margin: "24px 0" }} />
      </li>
    );
  }
);

// the Higher Order Container we'll use to hold these items
const SortableList = SortableContainer(
  ({ dataObjects, fieldObjects, handleInputChange, removeInputs }) => {
    return (
      <ul>
        {dataObjects.map((dataObject, index) => (
          <SortableItem
            key={`item-${index}`}
            index={index}
            indexForChange={index}
            fieldObjects={fieldObjects}
            dataObject={dataObject}
            handleInputChange={handleInputChange}
            removeInputs={removeInputs}
          />
        ))}
      </ul>
    );
  }
);

// finally the class itself
export default class DraggableInputs extends Component {
  onSortEnd = ({ oldIndex, newIndex }) => {
    let values = this.props.values;
    values = arrayMove(values, oldIndex, newIndex);
    this.props.updateParent(values);
  };

  handleInputChange(newValue, field, index) {
    let values = this.props.values;
    values[index][field] = newValue;
    this.props.updateParent(values);
  }

  addInputs() {
    let values = this.props.values;
    let newValue = {};
    this.props.fields.map(field => {
      newValue[field.field] = "";
    });
    newValue.displayType = "checkbox";
    values.push(newValue);
    this.props.updateParent(values);
  }

  removeInputs(index) {
    let values = this.props.values;
    values.splice(index, 1);
    this.props.updateParent(values);
  }

  render() {
    return (
      <div>
        <SortableList
          dataObjects={this.props.values}
          fieldObjects={this.props.fields}
          handleInputChange={(newValue, field, index) =>
            this.handleInputChange(newValue, field, index)}
          removeInputs={index => this.removeInputs(index)}
          onSortEnd={this.onSortEnd}
          useDragHandle={true}
        />
        <Button onClick={() => this.addInputs()}> + Add Another Task </Button>
        <div style={{ margin: "24px 0" }} />
      </div>
    );
  }
}
