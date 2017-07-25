import React, { Component } from "react";
import { Input, Button, Modal, notification } from "antd";
import TopNavBar from "../components/TopNavBar.js";
import DynamicInput from "../components/DynamicInput.js";
import DraggableInputs from "../components/DraggableInputs.js";
import NewDynamicHeaders from "../components/NewDynamicHeaders.js";
import Checklist from "../components/Checklist.js";
import DropdownSelection from "../components/DropdownSelection.js";
import PleaseLogin from "../components/PleaseLogin.js";
import TimeDropdowns from "../components/TimeDropdowns.js";
import ChecklistValidation from "../validation/ChecklistValidation.js";
import ChecklistForm from "../components/ChecklistForm.js";
import submitChecklist from "../firebase/submitChecklist.js";
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

  updateField(field, value) {
    this.setState({
      ...this.state,
      [field]: value
    });
  }

  confirmSubmit() {
    // validate input; throw errors if found
    let valid = new ChecklistValidation();
    let errorsAndWarnings = valid.validateChecklist(this.state);
    if (errorsAndWarnings.errors.length !== 0) {
      errorsAndWarnings.errors.map(error => {
        notification.error({
          message: "ERROR",
          description: error
        });
      });
      return;
    }

    // if no errors, but warnings, display them along with submit modal
    errorsAndWarnings.warnings.map(warning => {
      notification.warning({
        message: "WARNING",
        description: warning
      });
    });

    // confirm submit with a modal
    Modal.confirm({
      title: "Submit Checklist?",
      content: "Make sure everything is correct!",
      okText: "Submit",
      cancelText: "Cancel",
      onOk: () => {
        submitChecklist(this.state);
      },
      onCancel() {}
    });
  }

  render() {
    if (!this.props.userInfo) {
      return <PleaseLogin />;
    }

    console.log(this.state);

    return (
      <div>
        <TopNavBar
          className="horizontal"
          tabs={tabs}
          currentURL="/createchecklist"
        />
        <ChecklistForm
          checklistData={this.state}
          updateField={(field, value) => this.updateField(field, value)}
        />
        <Button type="primary" onClick={() => this.confirmSubmit()}>
          {" "}Submit!{" "}
        </Button>
      </div>
    );
  }
}
