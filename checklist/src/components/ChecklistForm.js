import React, { Component } from "react";
import { Input, notification, Modal, Button, Select, Switch } from "antd";
import NewDynamicHeaders from "../components/NewDynamicHeaders.js";
import Checklist from "../components/Checklist.js";
import ChecklistValidation from "../validation/ChecklistValidation.js";
import submitChecklist from "../firebase/submitChecklist.js";
import DropdownSelection from "../components/DropdownSelection.js";
import TimeDropdowns from "../components/TimeDropdowns.js";
import roleHierarchy from "../roles/roleHierarchy.js";
import "../css/ChecklistForm.css";
import firebase from "../configs/firebaseConfig.js";
import { storeLocations } from "../locations.js";

/* PROPS
    checklistData: obj; has all the relevant fields for checklists (managed by parent component)
    updateField: function; updates the relevant field in the parent's state
    userInfo: obj; the logged-in user's info (used to determine which roles to display)
    hideLocations: boolean, determines whether to render the locations or not (for now, they should
      be hidden when you go to edit a checklist)
*/

const Option = Select.Option;

const testFields = [
  {
    field: "shortDescription",
    prompt: "Short Description:"
  },
  {
    field: "longDescription",
    prompt: "Detailed Description(Optional):"
  }
];

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

let locations = ["Charlottesville, VA", "Newark, DE"];

export default class ChecklistForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newChecklist: this.props.checklistTemplate
    };
  }

  componentWillReceiveProps(props) {
    this.state.newChecklist = props.checklistTemplate;
  }

  confirmSubmit() {
    // validate input; throw errors if found
    let valid = new ChecklistValidation();
    let errorsAndWarnings = valid.validateChecklist(this.state.newChecklist);
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
      okText: "Yes",
      cancelText: "No",
      onOk: () => {
        submitChecklist(this.state.newChecklist);
        this.setState({
          newChecklist: {
            title: "",
            description: "",
            subsections: [],
            daysToRepeat: [],
            endTimes: [],
            location: "",
            role: "",
            phoneNumbers: [""],
            emails: [""]
          }
        });
      },
      onCancel() {}
    });
  }

  updateField(field, value, index) {
    let updatedChecklist = this.state.newChecklist;
    if (index >= 0) {
      updatedChecklist[field][index] = value;
    } else {
      updatedChecklist[field] = value;
    }
    this.setState({
      ...this.state,
      newChecklist: updatedChecklist
    });
  }

  handleAddPhoneNumber = () => {
    let temp = this.state.newChecklist;
    temp.phoneNumbers.push("");
    this.setState({
      newChecklist: temp
    });
  };

  handleAddEmail = () => {
    let temp = this.state.newChecklist;
    temp.emails.push("");
    this.setState({
      newChecklist: temp
    });
  };

  handleRemovePhoneNumber = index => {
    let temp = this.state.newChecklist;
    temp.phoneNumbers.splice(index, 1);
    this.setState({
      newChecklist: temp
    });
  };

  handleRemoveEmail = index => {
    let temp = this.state.newChecklist;
    temp.emails.splice(index, 1);
    this.setState({
      newChecklist: temp
    });
  };

  render() {
    // if user not an admin, restrict locations to just that user's location
    var locations = [];
    let pickerLocations = [];
    var locationsUserCanSee = [];
    if (this.props.userInfo.role !== "Admin") {
      locationsUserCanSee = [this.props.userInfo.location];
    } else {
      locationsUserCanSee = storeLocations;
    }
    console.log(locations, locationsUserCanSee);

    // grab the relevant roles based on user's position in the hierarchy
    var roles = [];
    roleHierarchy[this.props.userInfo.role].forEach(role => {
      roles.push(<Option value={role}>{role}</Option>);
    });

    locationsUserCanSee.forEach(location => {
      pickerLocations.push(<Option value={location}>{location}</Option>);
    });

    let phoneFields = [];
    let phoneNumbers = this.state.newChecklist.phoneNumbers;
    if (phoneNumbers == undefined) phoneNumbers = [""];
    for (let i = 0; i < phoneNumbers.length; i++) {
      phoneFields.push(
        <div className="contact-container">
          <Input
            value={phoneNumbers[i]}
            placeholder="Phone Number"
            className="title-input"
            onChange={e => {
              this.updateField("phoneNumbers", e.target.value, i);
            }}
          />
          <Button
            icon="plus-circle-o"
            type="secondary"
            onClick={this.handleAddPhoneNumber}
          />
          {phoneNumbers.length > 1 && (
            <Button
              icon="close-circle-o"
              type="danger"
              onClick={() => this.handleRemovePhoneNumber(i)}
            />
          )}
        </div>
      );
    }

    let emailFields = [];
    let emails = this.state.newChecklist.emails;
    if (emails == undefined) emails = [""];
    for (let i = 0; i < emails.length; i++) {
      emailFields.push(
        <div className="contact-container">
          <Input
            value={emails[i]}
            className="title-input"
            placeholder="Email"
            onChange={e => {
              this.updateField("emails", e.target.value, i);
            }}
          />
          <Button
            icon="plus-circle-o"
            type="secondary"
            onClick={this.handleAddEmail}
          />
          {emails.length > 1 && (
            <Button
              icon="close-circle-o"
              type="danger"
              onClick={() => this.handleRemoveEmail(i)}
            />
          )}
        </div>
      );
    }

    return (
      <div className="checklist-container">
        <h1 className="header">Create A New Checklist</h1>
        <br />
        <div className="container">
          <p className="text"> Title </p>
          <Input
            className="title-input"
            onChange={e => this.updateField("title", e.target.value)}
            maxLength={50}
            placeholder={"Title (max 50 characters)"}
            value={this.state.newChecklist.title}
          />
        </div>
        <div className="description-container">
          <p className="text"> Description </p>
          <Input
            className="description-input"
            onChange={e => this.updateField("description", e.target.value)}
            placeholder={"Description (max 500 characters)"}
            type="textarea"
            value={this.state.newChecklist.description}
          />
        </div>
        <div className="description-container">
          <p className="text"> Requires signature? </p>
          <Switch
            checked={this.state.newChecklist.requiresSignature}
            onChange={checked => this.updateField("requiresSignature", checked)}
          />,
        </div>

        <div className="container">
          <p className="text">End Times</p>
          <TimeDropdowns
            timeData={this.state.newChecklist.endTimes}
            onChange={data => this.updateField("endTimes", data)}
          />
        </div>
        <div className="container">
          <p className="text"> Days to Repeat </p>
          <Checklist
            checklistValues={daysOfWeek}
            checkedValues={this.state.newChecklist.daysToRepeat}
            onCheck={checkedItems =>
              this.updateField("daysToRepeat", checkedItems)
            }
          />
        </div>
        <div className="container">
          <p className="text"> Role </p>
          <Select
            className="picker"
            value={this.state.newChecklist.role}
            onChange={value => this.updateField("role", value)}
          >
            {roles}
          </Select>
        </div>
        <div className="container">
          <p className="text"> Location </p>
          <Select
            className="picker"
            value={this.state.newChecklist.location}
            onChange={value => this.updateField("location", value)}
          >
            {pickerLocations}
          </Select>
        </div>
        <div className="double-container">
          <div className="phone-container">
            <p className="text">Email</p>{" "}
            <p> Send email reminder when task is overdue (optional) </p>
            {emailFields}
          </div>
          <div className="phone-container">
            <p className="text">Phone</p>
            <p> Send text reminder when task is overdue (optional) </p>
            {phoneFields}
          </div>
        </div>
        <div className="subsection-container">
          <h1 className="subsection-header">Checklist Sections and Tasks</h1>
          <p className="text"> Subsections </p>
          <NewDynamicHeaders
            fields={testFields}
            data={this.state.newChecklist.subsections}
            updateParent={subsections =>
              this.updateField("subsections", subsections)
            }
          />
        </div>
        <Button
          className="submit-button"
          type="primary"
          onClick={() => this.confirmSubmit()}
        >
          Submit
        </Button>
      </div>
    );
  }
}
