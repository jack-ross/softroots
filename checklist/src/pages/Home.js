import React, { Component } from "react";
import TopNavBar from "../components/TopNavBar.js";
import Checklist from "../components/Checklist.js";
import PleaseLogin from "../components/PleaseLogin.js";
import background from "../images/checklist.jpg";
import Header from "../components/Header.js";
import "../css/Home.css";

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
  forChild(a, b) {
    console.log(a + " " + b);
  }

  render() {
    if (!this.props.userInfo) {
      return <PleaseLogin />;
    }

    return (
      <div>
        <TopNavBar className="horizontal" tabs={tabs} currentURL="/home" />
        <div className="checklist" style={{ textAlign: "center" }}>
          <img src={background} />
        </div>
      </div>
    );
  }
}
