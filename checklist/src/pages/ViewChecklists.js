import React, { Component } from "react";
import { Modal } from "antd";
import TopNavBar from "../components/TopNavBar.js";
import CollapseableList from "../components/CollapseableList.js";
import PleaseLogin from "../components/PleaseLogin.js";
import { Redirect } from "react-router-dom";
import firebase from "../configs/firebaseConfig.js";
import ChecklistForm from "../components/ChecklistForm.js";
import submitChecklist from "../firebase/submitChecklist.js";

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

let testdata = [
  {
    title: "Closing List",
    description: "Things to be done when store is closing",
    subsections: [
      {
        title: "Back of the store",
        subtasks: ["Mop the floor", "Clean the grill"]
      },
      {
        title: "Front of the store",
        subtasks: ["Mop the front", "Change the water", "Clean tables"]
      }
    ]
  },
  {
    title: "Opening List",
    description: "Finish these before 10:30 when store opens",
    subsections: [
      {
        title: "Grill Duty",
        subtasks: ["Make sure it's hot", "Sanitize"]
      },
      {
        title: "Food Prep",
        subtasks: ["Cut chicken", "Wash lettuce", "Eat laugh love"]
      }
    ]
  }
];

export default class ViewChecklists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "Loading...",
      data: [],
      checklistToEdit: {},
      isModalVisible: false
    };
  }

  componentWillMount() {
    // pull all the data from firebase (initially locations are hardcoded just for Roots)
    firebase.database().ref("/checklists").on("value", snapshot => {
      if (snapshot.val()) {
        this.setState({
          status: "",
          data: snapshot.val()
        });
      } else {
        this.setState({
          status: "No checklists found.",
          data: []
        });
      }
    });
  }

  onClickEdit(checklist) {
    this.setState({
      ...this.state,
      checklistToEdit: checklist,
      isModalVisible: true
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

  render() {
    console.log(this.state);
    if (!this.props.userInfo) {
      return <PleaseLogin />;
    }

    const checklistDisplays = Object.keys(this.state.data).map(location => {
      let roleInfoAtLocation = this.state.data[location];
      const roleChecklists = Object.keys(roleInfoAtLocation).map(role => {
        let roleChecklists = roleInfoAtLocation[role];
        const checklists = Object.keys(roleChecklists).map(key => {
          return roleChecklists[key];
        });
        return (
          <div>
            <h3>
              {" "}{role}{" "}
            </h3>
            <CollapseableList
              listInfo={checklists}
              onClickEdit={checklist => this.onClickEdit(checklist)}
            />
          </div>
        );
      });
      return (
        <div>
          <h1>
            {" "}{location}{" "}
          </h1>
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
        <p>
          {" "}{this.state.status}{" "}
        </p>
        {checklistDisplays}

        <Modal
          title="Edit Checklist"
          visible={this.state.isModalVisible}
          onOk={() => this.onLoginSubmit()}
          onCancel={() => this.onCancel()}
          okText="Save Changes"
          cancelText="Cancel"
        >
          <ChecklistForm
            checklistData={this.state.checklistToEdit}
            updateField={(field, value) =>
              this.updateChecklistField(field, value)}
            onSubmit={() => this.confirmSubmit()}
          />
        </Modal>
      </div>
    );
  }
}
