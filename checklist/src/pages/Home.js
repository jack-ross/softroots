import React, { Component } from "react";
import TopNavBar from "../components/TopNavBar.js";
import Checklist from "../components/Checklist.js";
import Sort from "../components/Sort.js";

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

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];
const checkedItems = ["Monday", "Thursday"];

export default class Home extends Component {
  render() {
    return (
      <div>
        <TopNavBar className="horizontal" tabs={tabs} currentURL="/" />
        <p> Home </p>
        <div>
          <Checklist
            checklistValues={daysOfWeek}
            defaultCheckedValues={checkedItems}
          />
        </div>
        <div>
          <Sort />
        </div>
      </div>
    );
  }
}
