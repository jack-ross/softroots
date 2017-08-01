import React, { Component } from "react";
import { Button } from "antd";
import { Link } from "react-router-dom";
import profileIcon from "../images/profileIcon.png";
import rootsLogo from "../images/rootsLogo.jpg";
import "../css/Header.css";

/* PROPS
    onClickSignOut: function to be called when the sign out button is clicked
    userFirstName: string; name to be displayed (i.e. "Michael")
*/

export default class Header extends Component {
  render() {
    return (
      <div className="headerContainer">
        <div className="rootsLogo">
          <img src={rootsLogo} height="80px" width="80px" />
        </div>

        <div className="title">
          <h1> ListTalk </h1>
        </div>

        <div className="profileAndSignOut">
          <div className="profile">
            <Link to="/profile">
              <img src={profileIcon} height="50px" width="50px" />
            </Link>

            <p style={{ fontWeight: "bold" }}>
              {" "}Welcome {this.props.userFirstName}{" "}
            </p>
          </div>

          <div className="signOutButton">
            <Button onClick={() => this.props.onClickSignOut()}>
              {" "}Sign Out{" "}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
