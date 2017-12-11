import React, { Component } from "react";
import { Input, notification, Modal, Button, Select } from "antd";
import NewDynamicHeaders from "../components/NewDynamicHeaders.js";
import Checklist from "../components/Checklist.js";
import ChecklistValidation from "../validation/ChecklistValidation.js";
import submitChecklist from "../firebase/submitChecklist.js";
import DropdownSelection from "../components/DropdownSelection.js";
import TimeDropdowns from "../components/TimeDropdowns.js";
import roleHierarchy from "../roles/roleHierarchy.js";
import "../css/ChecklistForm.css";
import firebase from "../configs/firebaseConfig.js";

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
      },
      allChecklists: undefined,
      isPreexistingModalVisible: false
    };
  }

  componentWillMount() {
    firebase
      .database()
      .ref("/roles")
      .on("value", snapshot => {
        if (snapshot.val()) {
          this.setState({
            ...this.state,
            roles: snapshot.val()
          });
        } else {
          this.setState({
            ...this.state,
            roles: ["error loading locations"]
          });
        }
      });
  }

  confirmSubmit() {
    // validate input; throw errors if found
    let valid = new ChecklistValidation();
    let errorsAndWarnings = valid.validateChecklist(this.props.checklistData);
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
        submitChecklist(this.props.checklistData);
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
        this.props.updateField(field, value, index);
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
      locationsUserCanSee = Object.keys(this.state.roles);
    }

    // grab the relevant roles based on user's position in the hierarchy
    var roles = [];
    locationsUserCanSee.forEach(location => {
      let rolesInLocation = Object.keys(this.state.roles[location]);
      rolesInLocation.forEach(role => {
        if (!roles.includes(role)) {
          roles.push(<Option value={role}>{role}</Option>);
        }
      });
    });
    
    locationsUserCanSee.forEach(location => {
      let rolesInLocation = Object.keys(this.state.roles[location]);
      if (rolesInLocation.includes(this.props.checklistData.role)) {
        locations.push(location);
      }
    });

    locationsUserCanSee.forEach(location => {
      pickerLocations.push(<Option value={location}>{location}</Option>);
    })

    let phoneFields = [];
    for (let i = 0; i < this.state.newChecklist.phoneNumbers.length; i++) {
      phoneFields.push(<div className="contact-container">
          <Input value={this.state.newChecklist.phoneNumbers[i]} placeholder="Phone Number" className="title-input" onChange={e => {
              this.updateField("phoneNumbers", e.target.value, i)
            }} />
          <Button icon="plus-circle-o" type="secondary" onClick={this.handleAddPhoneNumber} />
          {this.state.newChecklist.phoneNumbers.length > 1 && <Button icon="close-circle-o" type="danger" onClick={() => this.handleRemovePhoneNumber(i)} />}
        </div>);
    }

    let emailFields = [];
    for (let i = 0; i < this.state.newChecklist.emails.length; i++) {
      emailFields.push(<div className="contact-container">
          <Input value={this.state.newChecklist.emails[i]} className="title-input" placeholder="Email" onChange={e => {
              this.updateField("emails", e.target.value, i);
            }} />
          <Button icon="plus-circle-o" type="secondary" onClick={this.handleAddEmail} />
          {this.state.newChecklist.emails.length > 1 && <Button icon="close-circle-o" type="danger" onClick={() => this.handleRemoveEmail(i)} />}
        </div>);
    }

    return (
      <div className="checklist-container">
        <h1 className="header">Create A New Checklist</h1>
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
            onChange={value =>
              this.props.updateField("role", value)
            }>
            {roles}
            </Select>
        </div>
        <div className="container">
          <p className="text"> Location </p>
          <Select
            className="picker"
            onChange={value =>
              this.props.updateField("location", value)
            }>
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
