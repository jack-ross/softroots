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
    name: "Create Checklist",
    url: "/createchecklist"
  },
  {
    name: "View Checklist",
    url: "/viewchecklists"
  },
  {
    name: "Manage",
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
        <TopNavBar
          className="horizontal"
          tabs={tabs}
          onClickSignOut={this.props.onClickSignOut}
        />
        <h1 className="welcome-message">
          Welcome, {this.props.userInfo.firstName}!
        </h1>
        <div className="checkImage">
          <img src={background} alt="Background" />
        </div>
      </div>
    );
  }
}
