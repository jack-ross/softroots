import React, { Component } from "react";
import TopNavBar from "../components/TopNavBar.js";
import ApproveOrDenyUserList from "../components/ApproveOrDenyUserList.js";
import ChangePrivilegeList from "../components/ChangePrivilegeList.js";
import PleaseLogin from "../components/PleaseLogin.js";
import "../css/UserManagement.css";
import roleHierarchy from "../roles/roleHierarchy.js";

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

let fieldsToDisplay = ["firstName", "lastName", "role"];
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
          <ApproveOrDenyUserList userInfo={this.props.userInfo} />
          <div style={{ margin: "24px 0" }} />

          <h1> Verified Users </h1>
          <ChangePrivilegeList
            fieldsToDisplay={fields}
            arrayOfPrivileges={roles}
            firebasePath="/users/verified"
            userInfo={this.props.userInfo}
          />
        </div>
      </div>
    );
  }
}
