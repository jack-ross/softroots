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
import { storeLocations } from "../locations.js";
import roles from "../roles/roles.js";
import {getChecklistsFromVal} from "../helperFunctions/getChecklistsFromVal";

const tabs = [
  {
    name: "Home",
    url: "/home"
  },
  {
    name: "Create Checklist",
    url: "/createchecklist"
  },
  {
    name: "View Checklist",
    url: "/viewchecklists"
  },
  {
    name: "Manage",
    url: "/users"
  }
];

export default class CreateOrEditChecklist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allChecklists: undefined,
      isPreexistingModalVisible: false,
      checklistTemplate: {
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
    };
  }

  componentWillMount() {
    this.setState({
      roles: roles
    })
    firebase
        .database()
        .ref("/checklists/")
        .on("value", snapshot => {
          this.setState({
            allChecklists: getChecklistsFromVal(snapshot.val())
          });
        });
  }

  switchModalVisibility() {
    firebase
      .database()
      .ref("/checklists/")
      .on("value", snapshot => {
        this.setState({
          ...this.state,
          isPreexistingModalVisible: !this.state.isPreexistingModalVisible,
          allChecklists: snapshot.val()
        });
      });
  }

  onSelectPreexistingChecklist(checklist) {
    this.setState({
      ...this.state,
      checklistTemplate: checklist,
      isPreexistingModalVisible: false
    });
  }

  render() {
    if (!this.props.userInfo) {
      return <PleaseLogin />;
    }
    const preexistingListModal = (
      <div>
        <p
          style={{ cursor: "pointer", color: "#108ee9" }}
          onClick={() => this.switchModalVisibility()}
        >
          Import Checklist
        </p>
        <div style={{ margin: "20px" }} />
        <FindPreexistingListModal
          checklists={this.state.allChecklists}
          locations={
            this.props.userInfo.role === "Admin"
              ? storeLocations
              : [this.props.userInfo.location]
          }
          roles={this.state.roles}
          onClickSelect={checklist =>
            this.onSelectPreexistingChecklist(checklist)
          }
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
          onClickSignOut={this.props.onClickSignOut}
        />
        <div className="createEditPage" style={{ padding: "30px 0" }}>
          {preexistingListModal}

          <ChecklistForm
            userInfo={this.props.userInfo}
            checklistTemplate={this.state.checklistTemplate}
            checklists = {this.state.allChecklists}
          />
        </div>
      </div>
    );
  }
}
