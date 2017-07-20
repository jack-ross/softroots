import React, { Component } from "react";
import { Input, Button } from "antd";
import DraggableInputs from "./DraggableInputs.js";

/* PROPS
    initialData (OPTIONAL): [obj]; array of initial data to be rendered formatted as such:
      title: "string", name of subsection
      subtasks: [obj], where objects have field1, field2, ..., field_n as provided
        in this.props.fields
    fields: [obj]
      field: string
      prompt: string
*/

/* STATE
    data: [obj], data currently being stored, where each object rep's a
      subsection of a checklist with the following fields:
      title: "string", name of subsection
      subtasks: [obj], where objects have field1, field2, ..., field_n as provided
        in this.props.fields
*/

export default class NewDynamicHeaders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [""]
    };
  }

  addHeader() {
    // TODO
    let updatedData = this.state.data;
    updatedData.push("");
    this.setState({
      ...this.state,
      data: updatedData
    });
  }

  removeHeader(index) {
    // TODO
    let data = this.state.data;
    data.splice(index, 1);
    this.setState({
      ...this.state,
      data: data
    });
  }

  onHeaderChange(event, index) {
    let data = this.state.data;
    data[index] = event.target.value;
    this.setState({
      ...this.state,
      data: data
    });
  }

  render() {
    // TODO
    const headerInputs = this.state.data.map((datum, index) => {
      return (
        <div>
          <h2> Subsection Title </h2>
          <Input
            style={{ width: 200 }}
            value={datum}
            onChange={e => this.onHeaderChange(e, index)}
          />
          <div style={{ margin: "16px 0" }} />
          <h2> Tasks </h2>
          <DraggableInputs fields={this.props.fields} />
          <Button onClick={() => this.removeHeader(index)}>
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
