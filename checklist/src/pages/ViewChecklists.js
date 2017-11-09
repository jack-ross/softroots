import React, { Component } from "react";
import { Modal, notification } from "antd";
import TopNavBar from "../components/TopNavBar.js";
import CollapseableList from "../components/CollapseableList.js";
import PleaseLogin from "../components/PleaseLogin.js";
import firebase from "../configs/firebaseConfig.js";
import ChecklistForm from "../components/ChecklistForm.js";
import Validation from "../validation/ChecklistValidation.js";
import submitEditedChecklist from "../firebase/submitEditedChecklist.js";
import deleteChecklist from "../firebase/deleteChecklist.js";
import roleHierarchy from "../roles/roleHierarchy.js";
import "../css/ViewChecklists.css";

const tabs = [
  {
    name: "Home",
    url: "/home"
  },
  {
    name: "Create",
    url: "/createchecklist"
  },
  {
    name: "View",
    url: "/viewchecklists"
  },
  {
    name: "Manage",
    url: "/users"
  }
];

export default class ViewChecklists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "Loading...",
      data: [],
      checklistToEdit: {},
      isModalVisible: false,
      initialRole: "",
      initialLocations: []
    };
  }

  componentWillMount() {
    // pull all the data from firebase (initially locations are hardcoded just for Roots)
    firebase
      .database()
      .ref("/checklists")
      .on("value", snapshot => {
        if (snapshot.val()) {
          this.setState({
            ...this.state,
            status: "",
            data: snapshot.val()
          });
        } else {
          this.setState({
            ...this.state,
            status: "No checklists found.",
            data: []
          });
        }
      });
  }

  onClickEdit(checklist) {
    let checklistToEdit = Object.assign({}, checklist);
    // if checklist doesn't have end times, initalize those fields
    if (!checklistToEdit.endTimes) {
      checklistToEdit.endTimes = [];
    }
    if (!checklistToEdit.daysToRepeat) {
      checklistToEdit.daysToRepeat = [];
    }
    this.setState({
      ...this.state,
      checklistToEdit: checklistToEdit,
      isModalVisible: true,
      initialRole: checklist.role,
      initialLocations: checklist.locations
    });
  }

  onClickDelete(checklist) {
    Modal.confirm({
      title: "Delete Checklist?",
      content:
        "This will delete the checklist across all locations.  This action CANNOT be undone.",
      okText: "Delete",
      cancelText: "Cancel",
      onOk: () => {
        deleteChecklist(checklist);
      },
      onCancel: () => {}
    });
  }

  updateChecklistField(field, value) {
    let checklistData = this.state.checklistToEdit;
    checklistData[field] = value;
    this.setState({
      ...this.state,
      checklistToEdit: checklistData
    });
  }

  onCancel() {
    this.setState({
      ...this.state,
      isModalVisible: false
    });
  }

  onClickSubmit(updatedChecklist) {
    // validate the new input first, throw any errors and break if they exist
    let valid = new Validation();
    let errorsAndWarnings = valid.validateChecklist(updatedChecklist);
    if (errorsAndWarnings.errors.length > 0) {
      errorsAndWarnings.errors.map(error => {
        notification.error({
          message: "ERROR",
          description: error
        });
      });
      return;
    }

    // otherwise, display any warnings and confirm they want to save these changes
    errorsAndWarnings.warnings.map(warning => {
      notification.warning({
        message: "WARNING",
        description: warning
      });
    });
    Modal.confirm({
      title: "Confirm Changes?",
      content: "Do you want to save these changes?",
      onOk: () =>
        submitEditedChecklist(
          this.state.checklistToEdit,
          this.state.initialLocations,
          this.state.initialRole
        ),
      onCancel: () => {},
      okText: "Save Changes",
      cancelText: "Cancel"
    });
  }

  render() {
    if (!this.props.userInfo) {
      return <PleaseLogin />;
    }

    // grab the roles below the user in the hierarchy to know which ones to render
    const roles = roleHierarchy[this.props.userInfo.role];

    // if user is admin, we want ALL locations; otherwise, just that user's location
    let locations = ["Charlottesville, VA", "Newark, DE"];
    if (this.props.userInfo.role !== "Admin") {
      locations = [this.props.userInfo.location];
    }

    const checklistDisplays = locations.map(location => {
      let roleInfoAtLocation = this.state.data[location];
      // if there are NO checklists at that location, render this
      if (!roleInfoAtLocation) {
        return (
          <div>
            <h1> {location} </h1>
            <p> No checklists at this location. </p>
          </div>
        );
      }

      // otherwise, go through that location's roles and render each
      // checklist within that role
      const roleChecklists = roles.map(role => {
        let roleChecklists = roleInfoAtLocation[role];
        if (!roleChecklists) {
          return (
            <div>
              <h3 style={{ fontSize: "16px" }}> {role} </h3>
              <p> None </p>
              <div style={{ margin: "24px 0" }} />
            </div>
          );
        }
        const checklists = Object.keys(roleChecklists).map(key => {
          return roleChecklists[key];
        });
        return (
          <div>
            <h3 style={{ fontSize: "16px" }}> {role} </h3>
            <CollapseableList
              listInfo={checklists}
              onClickEdit={checklist => this.onClickEdit(checklist)}
              onClickDelete={checklist => this.onClickDelete(checklist)}
              canEditDelete={this.props.userInfo.role === "Admin"}
            />
            <div style={{ margin: "30px 0" }} />
          </div>
        );
      });
      return (
        <div>
          <h1 style={{ textAlign: "center", textDecoration: "underline" }}>
            {" "}
            {location}{" "}
          </h1>
          <div style={{ margin: "16px 0" }} />
          {roleChecklists}
        </div>
      );
    });

    return (
      <div>
        <TopNavBar
          className="horizontal"
          tabs={tabs}
          currentURL="/viewchecklists"
        />
        <p> {this.state.status} </p>
        <div className="viewChecklists">{checklistDisplays}</div>

        <Modal
          style={{ top: "30px" }}
          title="Edit Checklist"
          visible={this.state.isModalVisible}
          onOk={() => this.onClickSubmit(this.state.checklistToEdit)}
          onCancel={() => this.onCancel()}
          okText="Save Changes"
          cancelText="Cancel"
          width="80%"
        >
          <ChecklistForm
            checklistData={this.state.checklistToEdit}
            updateField={(field, value) =>
              this.updateChecklistField(field, value)}
            userInfo={this.props.userInfo}
            hideLocations={true}
          />
        </Modal>
      </div>
    );
  }
}
