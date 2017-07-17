import React, { Component } from "react";
import TopNavBar from "../components/TopNavBar.js";
import DynamicInput from "../components/DynamicInput.js";
import DynamicHeaders from "../components/DynamicHeaders.js";

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

export default class CreateOrEditChecklist extends Component {
  render() {
    return (
      <div>
        <TopNavBar
          className="horizontal"
          tabs={tabs}
          currentURL="/createchecklist"
        />
        <p> Create or Edit! </p>
        <DynamicHeaders />
      </div>
    );
  }
}
