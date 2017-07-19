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
          <Input value={datum} onChange={e => this.onHeaderChange(e, index)} />
          <DraggableInputs fields={this.props.fields} />
          <Button onClick={() => this.removeHeader(index)}>
            {" "}Remove Subsection{" "}
          </Button>
        </div>
      );
    });

    return (
      <div>
        {headerInputs}
        <Button onClick={() => this.addHeader()}> + Add Another Header </Button>
      </div>
    );
  }
}
