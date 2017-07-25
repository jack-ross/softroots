import React, { Component } from "react";
import { Input, Button, Modal, notification } from "antd";
import DynamicInput from "../components/DynamicInput.js";
import DraggableInputs from "../components/DraggableInputs.js";
import NewDynamicHeaders from "../components/NewDynamicHeaders.js";
import Checklist from "../components/Checklist.js";
import DropdownSelection from "../components/DropdownSelection.js";
import TimeDropdowns from "../components/TimeDropdowns.js";

/* PROPS
    checklistData: obj; has all the relevant fields for checklists (managed by parent component)
    updateField: function; updates the relevant field in the parent's state
*/

const testFields = [
  {
    field: "shortDescription",
    prompt: "Short Description:"
  },
  {
    field: "longDescription",
    prompt: "Detailed Description:"
  }
];

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

const roles = ["GM", "Grill", "Line", "Prep"];

const locations = ["Charlottesville, VA", "Newark, DE"];

export default class ChecklistForm extends Component {
  render() {
    return (
      <div className="createEditPage">
        <h1> Checklist Title </h1>
        <Input
          style={{ width: 300 }}
          value={this.props.checklistData.title}
          onChange={e => this.props.updateField("title", e.target.value)}
        />

        <h1> Description </h1>
        <Input
          style={{ width: 300 }}
          value={this.props.checklistData.description}
          onChange={e => this.props.updateField("description", e.target.value)}
          type="textarea"
          autosize
        />
        <div style={{ margin: "24px 0" }} />

        <h1> Create Subsections </h1>
        <NewDynamicHeaders
          fields={testFields}
          data={this.props.checklistData.subsections}
          updateParent={subsections =>
            this.props.updateField("subsections", subsections)}
        />
        <div style={{ margin: "24px 0" }} />

        <h1> Repeat? </h1>
        <div style={{ margin: "24px 0" }} />
        <h2> Days to Repeat </h2>
        <Checklist
          checklistValues={daysOfWeek}
          checkedValues={this.props.checklistData.daysToRepeat}
          onCheck={checkedItems =>
            this.props.updateField("daysToRepeat", checkedItems)}
        />
        <div style={{ margin: "24px 0" }} />

        <h2> End Times </h2>
        <TimeDropdowns
          timeData={this.props.checklistData.endTimes}
          onChange={data => this.props.updateField("endTimes", data)}
        />
        <div style={{ margin: "24px 0" }} />

        <h1> Role? </h1>
        <DropdownSelection
          promptText={"Select Role"}
          dropdownValues={roles}
          onClickField={value => this.props.updateField("role", value)}
          selectedValue={this.props.checklistData.role}
        />
        <div style={{ margin: "24px 0" }} />

        <h1> Location(s)? </h1>
        <Checklist
          checklistValues={locations}
          checkedValues={this.props.checklistData.locations}
          onCheck={checkedItems =>
            this.props.updateField("locations", checkedItems)}
        />
        <div style={{ margin: "24px 0" }} />
      </div>
    );
  }
}
