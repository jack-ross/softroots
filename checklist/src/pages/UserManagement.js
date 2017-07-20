import React, { Component } from "react";
import TopNavBar from "../components/TopNavBar.js";
import ApproveOrDenyUserList from "../components/ApproveOrDenyUserList.js";
import ChangePrivilegeList from "../components/ChangePrivilegeList.js";
import "../css/UserManagement.css";

const tabs = [
  {
    name: "Home",
    url: "/"
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

let fieldsToDisplay = ["name", "privilege"];
let arrayOfPrivileges = ["admin", "grill", "gm"];

export default class UserManagement extends Component {
  render() {
    return (
      <div>
        <TopNavBar className="horizontal" tabs={tabs} currentURL="/users" />
        <div className="userManagement">
          <h1> Unverified Users </h1>
          <ApproveOrDenyUserList />
          <div style={{ margin: "24px 0" }} />

          <h1> Verified Users </h1>
          <ChangePrivilegeList
            fieldsToDisplay={fieldsToDisplay}
            arrayOfPrivileges={arrayOfPrivileges}
          />
        </div>
      </div>
    );
  }
}
