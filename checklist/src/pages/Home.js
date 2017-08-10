import React, { Component } from "react";
import TopNavBar from "../components/TopNavBar.js";
import PleaseLogin from "../components/PleaseLogin.js";
import background from "../images/checklist.jpg";
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

export default class Home extends Component {
  render() {
    if (!this.props.userInfo) {
      return <PleaseLogin />;
    }

    return (
      <div>
        <TopNavBar className="horizontal" tabs={tabs} currentURL="/home" />
        <div className="checkImage">
          {" "}<img src={background} alt="Background" />{" "}
        </div>
      </div>
    );
  }
}
