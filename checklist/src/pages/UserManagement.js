import React, { Component } from "react";
import TopNavBar from "../components/TopNavBar.js";
import ApproveOrDenyUserList from "../components/ApproveOrDenyUserList.js";
import ChangePrivilegeList from "../components/ChangePrivilegeList.js";
import PleaseLogin from "../components/PleaseLogin.js";
import "../css/UserManagement.css";

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
const roles = [
  "GM",
  "Assistant GM",
  "Kitchen Manager",
  "Shift Manager",
  "Grill",
  "Prep",
  "Line",
  "Dish"
];

export default class UserManagement extends Component {
  render() {
    if (!this.props.userInfo) {
      return <PleaseLogin />;
    }

    return (
      <div>
        <TopNavBar className="horizontal" tabs={tabs} currentURL="/users" />
        <div className="userManagement">
          <h1> Unverified Users </h1>
          <ApproveOrDenyUserList />
          <div style={{ margin: "24px 0" }} />

          <h1> Verified Users </h1>
          <ChangePrivilegeList
            fieldsToDisplay={fields}
            arrayOfPrivileges={roles}
            firebasePath="/users/verified"
          />
        </div>
      </div>
    );
  }
}
