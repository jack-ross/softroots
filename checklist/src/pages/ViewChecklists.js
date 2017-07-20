import React, { Component } from "react";
import TopNavBar from "../components/TopNavBar.js";
import CollapseableList from "../components/CollapseableList.js";

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

let testdata = [
  {
    title: "Closing List",
    description: "Things to be done when store is closing",
    subsections: [
      {
        title: "Back of the store",
        subtasks: ["Mop the floor", "Clean the grill"]
      },
      {
        title: "Front of the store",
        subtasks: ["Mop the front", "Change the water", "Clean tables"]
      }
    ]
  },
  {
    title: "Opening List",
    description: "Finish these before 10:30 when store opens",
    subsections: [
      {
        title: "Grill Duty",
        subtasks: ["Make sure it's hot", "Sanitize"]
      },
      {
        title: "Food Prep",
        subtasks: ["Cut chicken", "Wash lettuce", "Eat laugh love"]
      }
    ]
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
        <CollapseableList listInfo={testdata} />
      </div>
    );
  }
}
