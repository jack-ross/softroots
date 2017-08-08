import React, { Component } from "react";
import { Button, Modal, notification } from "antd";
import TopNavBar from "../components/TopNavBar.js";
import PleaseLogin from "../components/PleaseLogin.js";
import ChecklistValidation from "../validation/ChecklistValidation.js";
import ChecklistForm from "../components/ChecklistForm.js";
import submitChecklist from "../firebase/submitChecklist.js";
import FindPreexistingListModal from "../components/FindPreexistingListModal.js";
import roleHierarchy from "../roles/roleHierarchy.js";
import firebase from "../configs/firebaseConfig.js";
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

export default class CreateOrEditChecklist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newChecklist: {
        title: "",
        description: "",
        subsections: [],
        daysToRepeat: [],
        endTimes: [],
        locations: [],
        role: ""
      },
      allChecklists: undefined,
      isPreexistingModalVisible: false
    };
  }

  componentWillMount() {
    firebase.database().ref("/checklists/").on("value", snapshot => {
      this.setState({
        ...this.state,
        allChecklists: snapshot.val()
      });
    });
  }

  updateField(field, value) {
    let updatedChecklist = this.state.newChecklist;
    updatedChecklist[field] = value;
    this.setState({
      ...this.state,
      newChecklist: updatedChecklist
    });
  }

  switchModalVisibility() {
    this.setState({
      ...this.state,
      isPreexistingModalVisible: !this.state.isPreexistingModalVisible
    });
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
      content: "Make sure everything is correct!",
      okText: "Submit",
      cancelText: "Cancel",
      onOk: () => {
        submitChecklist(this.state.newChecklist);
      },
      onCancel() {}
    });
  }

  onSelectPreexistingChecklist(checklist) {
    this.setState({
      ...this.state,
      newChecklist: checklist,
      isPreexistingModalVisible: false
    });
  }

  render() {
    if (!this.props.userInfo) {
      return <PleaseLogin />;
    }

    console.log(this.state.allChecklists);

    const preexistingListModal = (
      <div>
        <p
          style={{ cursor: "pointer" }}
          onClick={() => this.switchModalVisibility()}
        >
          {" "}Click here to import a pre-existing checklist.{" "}
        </p>
        <FindPreexistingListModal
          checklists={this.state.allChecklists}
          locations={
            this.props.userInfo.role === "Admin"
              ? ["Charlottesville, VA", "Newark, DE"]
              : [this.props.userInfo.location]
          }
          roles={roleHierarchy[this.props.userInfo.role]}
          onClickSelect={checklist =>
            this.onSelectPreexistingChecklist(checklist)}
          onCancel={() => this.switchModalVisibility()}
          isVisible={this.state.isPreexistingModalVisible}
        />
      </div>
    );

    return (
      <div>
        <TopNavBar
          className="horizontal"
          tabs={tabs}
          currentURL="/createchecklist"
        />
        <div className="createEditPage" style={{ padding: "30px 0" }}>
          {this.state.allChecklists && preexistingListModal}

          <ChecklistForm
            checklistData={this.state.newChecklist}
            updateField={(field, value) => this.updateField(field, value)}
            userInfo={this.props.userInfo}
          />
          <Button type="primary" onClick={() => this.confirmSubmit()}>
            {" "}Submit!{" "}
          </Button>
        </div>
      </div>
    );
  }
}
