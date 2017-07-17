import React, { Component } from "react";
import TopNavBar from "../components/TopNavBar.js";
import ApproveOrDenyUserList from "../components/ApproveOrDenyUserList.js";
import ChangePrivilegeList from "../components/ChangePrivilegeList.js";

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
        <h1> Unverified Users </h1>
        <ApproveOrDenyUserList />

        <h1> Verified Users </h1>
        <ChangePrivilegeList
          fieldsToDisplay={fieldsToDisplay}
          arrayOfPrivileges={arrayOfPrivileges}
        />
      </div>
    );
  }
}
