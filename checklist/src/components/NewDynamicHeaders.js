import React, { Component } from "react";
import { Input, Button } from "antd";
import DraggableInputs from "./DraggableInputs.js";
import displayConfirmDeleteModal from "../helperFunctions/displayConfirmDeleteModal.js";

/* PROPS
    data: [obj]; array of initial data to be rendered formatted as such:
      title: "string", name of subsection
      subtasks: [obj], where objects have field1, field2, ..., field_n as provided
        in this.props.fields
    fields: [obj]
      field: string
      prompt: string
    updateParent: function for updating the parent's state to be passed in again as data props
*/

export default class NewDynamicHeaders extends Component {
  addHeader() {
    let updatedData = this.props.data;
    let newObject = {
      title: "",
      subtasks: []
    };
    updatedData.push(newObject);
    this.props.updateParent(updatedData);
  }

  removeHeader(index) {
    let data = this.props.data;
    data.splice(index, 1);
    this.props.updateParent(data);
  }

  onHeaderChange(event, index) {
    let data = this.props.data;
    data[index].title = event.target.value;
    this.props.updateParent(data);
  }

  onSubtasksChange(subtasks, index) {
    let data = this.props.data;
    data[index].subtasks = subtasks;
    this.props.updateParent(data);
  }

  render() {
    const headerInputs = this.props.data.map((dataObj, index) => {
      return (
        <div>
          <h3> Subsection Title </h3>
          <Input
            style={{ width: 200 }}
            value={dataObj.title}
            onChange={e => this.onHeaderChange(e, index)}
            placeholder={"Title (max 100 characters)"}
            maxLength={100}
          />
          <div style={{ margin: "16px 0" }} />
          <h3> Tasks </h3>
          <DraggableInputs
            values={this.props.data[index].subtasks}
            fields={this.props.fields}
            updateParent={subtasks => this.onSubtasksChange(subtasks, index)}
          />
          <Button
            onClick={() =>
              displayConfirmDeleteModal(() => this.removeHeader(index))}
          >
            {" "}Remove Subsection{" "}
          </Button>
          <div style={{ margin: "24px 0" }} />
        </div>
      );
    });

    return (
      <div>
        {headerInputs}
        <div style={{ margin: "24px 0" }} />
        <Button type="primary" onClick={() => this.addHeader()}>
          {" "}+ New Subsection{" "}
        </Button>
      </div>
    );
  }
}
