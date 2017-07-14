import React, { Component } from "react";
import TopNavBar from "../components/TopNavBar.js";
import DynamicInput from "../components/DynamicInput";

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

const testData = ["mike", "stephen", "ashwin"];

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
        <DynamicInput defaultValues={testData} />
      </div>
    );
  }
}
