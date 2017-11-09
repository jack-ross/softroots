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
    firebase
      .database()
      .ref("/checklists/")
      .on("value", snapshot => {
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

    const preexistingListModal = (
      <div>
        <p
          style={{ cursor: "pointer", color: "#108ee9" }}
          onClick={() => this.switchModalVisibility()}
        >
          {" "}
          Import Checklist{" "}
        </p>
        <div style={{ margin: "20px" }} />
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
          onClickSignOut={this.props.onClickSignOut}
        />
        <div className="createEditPage" style={{ padding: "30px 0" }}>
          {this.state.allChecklists && preexistingListModal}

          <ChecklistForm
            checklistData={this.state.newChecklist}
            updateField={(field, value) => this.updateField(field, value)}
            userInfo={this.props.userInfo}
          />
        </div>
      </div>
    );
  }
}
