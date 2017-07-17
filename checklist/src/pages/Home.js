import React, { Component } from "react";
import TopNavBar from "../components/TopNavBar.js";
import Check from "../components/Check.js";
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

export default class Home extends Component {
  render() {
    return (
      <div>
        <TopNavBar className="horizontal" tabs={tabs} currentURL="/" />
        <p> Home </p>
        <div>
        <Check/>
        </div>
        <div>
          <Sort/>
          </div>
      </div>
    );
  }
}
