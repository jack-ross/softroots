import React, { Component } from "react";
import TopNavBar from "../components/TopNavBar.js";
import Check from "../components/Check.js";
import SortableTasks from "../components/SortableTasks.js";

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

const dummyData = [
  "Clean the bathroom",
  "Prep food for tomorrow",
  "Mop the back"
];

export default class Home extends Component {
  forChild(a, b) {
    console.log(a + " " + b);
  }

  render() {
    return (
      <div>
        <TopNavBar className="horizontal" tabs={tabs} currentURL="/" />
        <p> Home </p>
        <div>
          <Check />
        </div>
        <div>
          <SortableTasks
            initialValues={dummyData}
            updateParent={(a, b) => this.forChild(a, b)}
          />
        </div>
      </div>
    );
  }
}
