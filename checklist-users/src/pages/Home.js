import React, { Component } from "react";
import { Button } from "antd";
import { Link, Redirect } from "react-router-dom";
import rootsLogo from "../images/roots-logo.jpg";
import "../css/Home.css";

/* PROPS
    userInfo: pulled from firebase; if logged in, redirect to /viewchecklists
*/

export default class Home extends Component {
  render() {
    if (this.props.userInfo) {
      return <Redirect to="/viewchecklists" />;
    }

    return (
      <div className="Home" style={{ height: "100%", width: "100%" }}>
        <img style={{ width: "100%" }} src={rootsLogo} />
        <Link to="/create-account">
          <Button> Sign Up </Button>
        </Link>

        <Link to="/login">
          <Button type="primary"> Log In </Button>
        </Link>
      </div>
    );
  }
}
