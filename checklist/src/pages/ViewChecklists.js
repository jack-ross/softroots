import React, { Component } from "react";
import TopNavBar from "../components/TopNavBar.js";
import CollapseableList from "../components/CollapseableList.js";

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

let testdata = [
  {
    title: "Hello",
    description: "Hello1"
  }
];
export default class ViewChecklists extends Component {
  render() {
    return (
      <div>
        <TopNavBar
          className="horizontal"
          tabs={tabs}
          currentURL="/viewchecklists"
        />
        <p> View Checklists! </p>
        <CollapseableList listInfo={testdata} />
      </div>
    );
  }
}
