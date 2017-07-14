import React, { Component } from "react";
import TopNavBar from "../components/TopNavBar.js";
import ApproveOrDenyUserList from "../components/ApproveOrDenyUserList.js";

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

export default class UserManagement extends Component {
  render() {
    return (
      <div>
        <TopNavBar className="horizontal" tabs={tabs} currentURL="/users" />
        <h1> Unverified Users </h1>
        <ApproveOrDenyUserList />

        <h1> Verified Users </h1>
      </div>
    );
  }
}
