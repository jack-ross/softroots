import React, { Component } from "react";
import { Button } from "antd";
import { Link } from "react-router-dom";
import rootsLogo from "../images/roots-logo.jpg";
import "../css/Home.css";

export default class Home extends Component {
  render() {
    return (
      <div className="Home">
        <img style={{ width: "100%" }} src={rootsLogo} />
        <Link to="/create-account">
          <Button> Sign Up </Button>
        </Link>

        <Link to="/login">
          <Button> Log In </Button>
        </Link>
      </div>
    );
  }
}
