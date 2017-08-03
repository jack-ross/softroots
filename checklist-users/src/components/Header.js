import React, { Component } from "react";
import { Icon, Dropdown, Menu } from "antd";
import { Link } from "react-router-dom";
import rootsImage from "../images/rootsImage.jpg";
import settingsGear from "../images/settingsGear.png";
import "../css/Header.css";

export default class Header extends Component {
  render() {
    const settingsOptions = (
      <Menu>
        <Menu.Item>
          <p onClick={() => this.props.onClickSignOut()}> Sign Out </p>
        </Menu.Item>

        <Menu.Item>
          <Link to="/profile"> Profile Settings </Link>
        </Menu.Item>
      </Menu>
    );
    return (
      <div className="Header">
        <div className="rootsIcon">
          <img
            style={{ borderRadius: "100%" }}
            height="30px"
            width="30px"
            src={rootsImage}
          />
        </div>

        <div className="listTalkTitle">
          <p> ListTalk </p>
        </div>

        <div className="settingsIcon">
          <Dropdown overlay={settingsOptions} trigger={["click"]}>
            <img src={settingsGear} height="30px" width="30px" />
          </Dropdown>
        </div>
      </div>
    );
  }
}
