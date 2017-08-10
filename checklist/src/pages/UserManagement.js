import React, { Component } from "react";
import TopNavBar from "../components/TopNavBar.js";
import ApproveOrDenyUserList from "../components/ApproveOrDenyUserList.js";
import ChangePrivilegeList from "../components/ChangePrivilegeList.js";
import PleaseLogin from "../components/PleaseLogin.js";
import "../css/UserManagement.css";
import roleHierarchy from "../roles/roleHierarchy.js";
import ApproveOrDenyUserTable from "../components/ApproveOrDenyUserTable.js";
import firebase from "../configs/firebaseConfig.js";

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

const fields = [
  {
    field: "firstName",
    visibleDescription: "First Name"
  },
  {
    field: "lastName",
    visibleDescription: "Last Name"
  },
  {
    field: "email",
    visibleDescription: "Email Address"
  },
  {
    field: "role",
    visibleDescription: "Role"
  },
  {
    field: "location",
    visibleDescription: "Location"
  }
];

export default class UserManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firebaseUsers: undefined
    };
  }

  componentWillMount() {
    firebase.database().ref("/users").on("value", snapshot => {
      // if snapshot exists, store in the state
      if (snapshot.val()) {
        this.setState({
          ...this.state,
          firebaseUsers: snapshot.val()
        });
      }
    });
  }

  render() {
    if (!this.props.userInfo) {
      return <PleaseLogin />;
    }

    const roles = roleHierarchy[this.props.userInfo.role];

    return (
      <div>
        <TopNavBar className="horizontal" tabs={tabs} currentURL="/users" />
        <div className="userManagement">
          <h1> Unverified Users </h1>
          {!this.state.firebaseUsers && <p> Loading... </p>}
          {this.state.firebaseUsers &&
            <div className="approveDenyTable">
              <ApproveOrDenyUserTable
                firebaseUsers={this.state.firebaseUsers.unverified}
              />
            </div>}
          <div style={{ margin: "12px" }} />

          <h1> Verified Users </h1>
          {!this.state.firebaseUsers && <p> Loading... </p>}
          {this.state.firebaseUsers &&
            <ChangePrivilegeList
              fieldsToDisplay={fields}
              arrayOfPrivileges={roles}
              firebasePath="/users/verified"
              userInfo={this.props.userInfo}
            />}
        </div>
      </div>
    );
  }
}
