import React, { Component } from "react";
import { Input, Button, Modal } from "antd";
import TopNavBar from "../components/TopNavBar.js";
import DynamicInput from "../components/DynamicInput.js";
import DraggableInputs from "../components/DraggableInputs.js";
import NewDynamicHeaders from "../components/NewDynamicHeaders.js";
import Checklist from "../components/Checklist.js";
import DropdownSelection from "../components/DropdownSelection.js";
import PleaseLogin from "../components/PleaseLogin.js";
import TimeDropdowns from "../components/TimeDropdowns.js";
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

const locations = ["Charlottesville", "Pittsburgh", "Richmond"];

export default class CreateOrEditChecklist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      description: "",
      subsections: [],
      daysToRepeat: [],
      endTimes: [],
      locations: [],
      role: ""
    };
  }

  onDropdownClick(value, field) {
    this.setState({
      ...this.state,
      [field]: value
    });
  }

  onChangeEndTime(timeData) {
    this.setState({
      ...this.state,
      endTimes: timeData
    });
  }

  onCheck(field, checkedItems) {
    this.setState({
      ...this.state,
      [field]: checkedItems
    });
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

    console.log("the object in the state is");
    console.log(this.state.endTimes);

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
            checkedValues={this.state.daysToRepeat}
            onCheck={checkedItems => this.onCheck("daysToRepeat", checkedItems)}
          />
          <div style={{ margin: "24px 0" }} />

          <h2> End Times </h2>
          <TimeDropdowns
            timeData={this.state.endTimes}
            onChange={data => this.onChangeEndTime(data)}
          />
          <div style={{ margin: "24px 0" }} />

          <h1> Role? </h1>
          <DropdownSelection
            promptText={"Select Role"}
            dropdownValues={roles}
            onClickField={value => this.onDropdownClick(value, "role")}
            selectedValue={this.state.role}
          />
          <div style={{ margin: "24px 0" }} />

          <h1> Location(s)? </h1>
          <Checklist
            checklistValues={locations}
            checkedValues={this.state.locations}
            onCheck={checkedItems => this.onCheck("locations", checkedItems)}
          />
          <div style={{ margin: "24px 0" }} />

          <Button type="primary" onClick={() => this.confirmSubmit()}>
            {" "}Submit!{" "}
          </Button>
        </div>
      </div>
    );
  }
}
