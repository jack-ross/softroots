import React, { Component } from "react";
import { Input, Button, Modal } from "antd";
import TopNavBar from "../components/TopNavBar.js";
import DynamicInput from "../components/DynamicInput.js";
import DraggableInputs from "../components/DraggableInputs.js";
import NewDynamicHeaders from "../components/NewDynamicHeaders.js";
import Checklist from "../components/Checklist.js";
import DropdownSelection from "../components/DropdownSelection.js";
import PleaseLogin from "../components/PleaseLogin.js";
import "../css/CreateOrEditChecklist.css";

const tabs = [
  {
    name: "Home",
    url: "/home"
  },
  {
    name: "Create a Checklist",
    url: "/createchecklist"
  },
  {
    name: "View Current Checklists",
    url: "/viewchecklists"
  },
  {
    name: "Manage Users",
    url: "/users"
  }
];

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

const timeFields = [
  {
    name: "time",
    description: "How long should this take (in hours)?"
  }
];

const testData = [
  {
    shortDescription: "Do the laundry",
    longDescription: "Open the hatch, throw in a laundry pod."
  },
  {
    shortDescription: "Clean the grill",
    longDescription: "Throw some alcohol on there and start a fire"
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

const checkedItems = [];

const locations = ["Charlottesville", "Pittsburgh", "Richmond"];

export default class CreateOrEditChecklist extends Component {
  onDropdownClick(value) {
    console.log(value);
  }

  confirmSubmit() {
    Modal.confirm({
      title: "Submit Checklist?",
      content: "Make sure everything is correct!",
      okText: "Submit",
      cancelText: "Cancel",
      onOk: () => {},
      onCancel() {}
    });
  }

  render() {
    if (!this.props.userInfo) {
      return <PleaseLogin />;
    }

    return (
      <div>
        <TopNavBar
          className="horizontal"
          tabs={tabs}
          currentURL="/createchecklist"
        />
        <div className="createEditPage">
          <h1> Checklist Title </h1>
          <Input style={{ width: 300 }} />

          <h1> Description </h1>
          <Input style={{ width: 300 }} type="textarea" autosize />
          <div style={{ margin: "24px 0" }} />

          <h1> Create Subsections </h1>
          <NewDynamicHeaders fields={testFields} />
          <div style={{ margin: "24px 0" }} />

          <h1> Repeat? </h1>
          <div style={{ margin: "24px 0" }} />
          <h2> Days to Repeat </h2>
          <Checklist
            checklistValues={daysOfWeek}
            defaultCheckedValues={checkedItems}
          />
          <div style={{ margin: "24px 0" }} />

          <h2> Duration (in hours) </h2>
          <Input style={{ width: 300 }} />
          <div style={{ margin: "24px 0" }} />

          <h1> Role? </h1>
          <DropdownSelection
            defaultText={"Select Role"}
            dropdownValues={roles}
            onClickField={value => this.onDropdownClick(value)}
          />
          <div style={{ margin: "24px 0" }} />

          <h1> Location(s)? </h1>
          <Checklist checklistValues={locations} defaultCheckedValues={[]} />
          <div style={{ margin: "24px 0" }} />

          <Button type="primary" onClick={() => this.confirmSubmit()}>
            {" "}Submit!{" "}
          </Button>
        </div>
      </div>
    );
  }
}
