import React, { Component } from "react";
import { Button } from "antd";
import { Link, Redirect } from "react-router-dom";
import loginBackground from "../images/newLoginBackground.jpg";
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
      <div
        className="Home"
        style={{
          height: "100%",
          width: "100%",
          backgroundImage: "url(" + loginBackground + ")",
          backgroundSize: "100% 100%"
        }}
      >
        <div style={{ height: "40%" }} />
        <h1 style={{ fontSize: "30px", color: "white" }}> ListTalk </h1>
        <Link to="/create-account">
          <Button> Sign Up </Button>
        </Link>

        <Link to="/login">
          <Button type="primary"> Log In </Button>
        </Link>

        <Link to="/forgotpassword">
          <p style={{ color: "white" }}> Forgot your password? </p>
        </Link>
      </div>
    );
  }
}
