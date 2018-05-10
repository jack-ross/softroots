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
import roles from "../roles/roles.js";

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

export default class ChecklistForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allChecklists: undefined,
      isPreexistingModalVisible: false
    };
  }

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
    console.log(locationsUserCanSee);

    // grab the relevant roles based on user's position in the hierarchy
    var roles = [];
    roleHierarchy[this.props.userInfo.role].forEach(role => {
      roles.push(<Option value={role}>{role}</Option>);
    });

    locationsUserCanSee.forEach(location => {
      let rolesInLocation = roles;
      if (rolesInLocation.includes(this.props.checklistData.role)) {
        locations.push(location);
      }
    });

    locationsUserCanSee.forEach(location => {
      pickerLocations.push(<Option value={location}>{location}</Option>);
    });

    let phoneFields = [];
    let phoneNumbers = this.props.checklistData.phoneNumbers;
    if (phoneNumbers == undefined) {
      phoneNumbers = [""];
      this.props.checklistData.phoneNumbers = phoneNumbers; // so that updating the field (below) works
    }
    for (let i = 0; i < phoneNumbers.length; i++) {
      phoneFields.push(
        <div className="contact-container">
          <Input
            value={phoneNumbers[i]}
            placeholder="Phone Number"
            className="title-input"
            onChange={e => {
              this.props.updateField("phoneNumbers", e.target.value, i);
            }}
          />
          <Button
            icon="plus-circle-o"
            type="secondary"
            onClick={this.props.handleAddPhoneNumber}
          />
          {phoneNumbers.length > 1 && (
            <Button
              icon="close-circle-o"
              type="danger"
              onClick={() => this.props.handleRemovePhoneNumber(i)}
            />
          )}
        </div>
      );
    }

    let emailFields = [];
    let emails = this.props.checklistData.emails;
    if (emails == undefined) {
      emails = [""];
      this.props.checklistData.emails = emails; // so that updating the field (below) works
    }
    for (let i = 0; i < emails.length; i++) {
      emailFields.push(
        <div className="contact-container">
          <Input
            value={emails[i]}
            className="title-input"
            placeholder="Email"
            onChange={e => {
              this.props.updateField("emails", e.target.value, i);
            }}
          />
          <Button
            icon="plus-circle-o"
            type="secondary"
            onClick={this.props.handleAddEmail}
          />
          {emails.length > 1 && (
            <Button
              icon="close-circle-o"
              type="danger"
              onClick={() => this.props.handleRemoveEmail(i)}
            />
          )}
        </div>
      );
    }

    return (
      <div className="checklist-container">
        <h1 className="header">Edit Checklist</h1>
        <br />
        <div className="container">
          <p className="text"> Title </p>
          <Input
            className="title-input"
            value={this.props.checklistData.title}
            onChange={e => this.props.updateField("title", e.target.value)}
            maxLength={50}
            placeholder={"Title (max 50 characters)"}
          />
        </div>
        <div className="description-container">
          <p className="text"> Description </p>
          <Input
            className="description-input"
            value={this.props.checklistData.description}
            onChange={e =>
              this.props.updateField("description", e.target.value)
            }
            placeholder={"Description (max 500 characters)"}
            type="textarea"
          />
        </div>

        <div className="description-container">
          <p className="text"> Requires signature? </p>
          <Switch
            checked={this.props.checklistData.requiresSignature}
            onChange={checked =>
              this.props.updateField("requiresSignature", checked)
            }
          />,
        </div>
        <div className="container">
          <p className="text">End Times</p>
          <TimeDropdowns
            timeData={this.props.checklistData.endTimes}
            onChange={data => this.props.updateField("endTimes", data)}
          />
        </div>
        <div className="container">
          <p className="text"> Days to Repeat </p>
          <Checklist
            checklistValues={daysOfWeek}
            checkedValues={this.props.checklistData.daysToRepeat}
            onCheck={checkedItems =>
              this.props.updateField("daysToRepeat", checkedItems)
            }
          />
        </div>
        <div className="container">
          <p className="text"> Role </p>
          <Select
            className="picker"
            value={this.props.checklistData.role}
            onChange={value => this.props.updateField("role", value)}
          >
            {roles}
          </Select>
        </div>
        <div className="container">
          <p className="text"> Location </p>
          <Select
            className="picker"
            value={this.props.checklistData.location}
            onChange={value => this.props.updateField("location", value)}
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
            data={this.props.checklistData.subsections}
            updateParent={subsections =>
              this.props.updateField("subsections", subsections)
            }
          />
        </div>
      </div>
    );
  }
}
