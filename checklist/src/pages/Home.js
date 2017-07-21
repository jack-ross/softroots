import React, { Component } from "react";
import TopNavBar from "../components/TopNavBar.js";
import Checklist from "../components/Checklist.js";
import PleaseLogin from "../components/PleaseLogin.js";
import background from "../images/softroots.jpg";

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
    if (!this.props.userInfo) {
      return <PleaseLogin />;
    }
    let name = <p />;
    if (this.props.userInfo) {
      name = (
        <p>
          {" "}{this.props.userInfo.firstName} {this.props.userInfo.lastName}{" "}
        </p>
      );
    }
    return (
      <div>
        <TopNavBar className="horizontal" tabs={tabs} currentURL="/home" />
        {name}
        <div className="albertoPic">
          <img src={background} />
        </div>
      </div>
    );
  }
}
