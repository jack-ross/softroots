import { Menu, Button } from "antd";
import React from "react";
import { Redirect, Link } from "react-router-dom";
import rootsLogo from "../images/rootsLogo.jpg";
import profileIcon from "../images/profileIcon.png";
import "../css/TopNavBar.css";

/* PROPS:
    className: string; MUST be either "horizontal" or "vertical" to display properly
    tabs: [{
      name: string; name of the tab to be displayed,
      url: string; path of the url for Route Router to follow when clicked
    }]
    currentURL: string; the current URL to check against the URL we'd redirect to
*/

/* STATE:
    shouldRedirect: boolean; determines whether to redirect to a new page
    redirectURL: string; if shouldRedirect is true, redirect to this url
*/

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
  },
  {
    name: "Checklist History",
    url: "/history"
  }
];

export default class TopNavBar extends React.Component {
  constructor(props) {
    super(props);
  }

  // takes in array of tab objects (i.e. this.props.tabs) and returns array of <MenuItem> objects
  // to be displayed
  createTabsList(tabs) {
    const listTabs = tabs.map(tab => {
      return (
        // note we're assiging the url as the key to access later in the handleClick method

        <Menu.Item className="tab">
          <Link className="tab-text" to={tab.url}>
            {tab.name}
          </Link>
        </Menu.Item>
      );
    });
    return listTabs;
  }

  render() {
    // else render the navigation bar itself
    const listTabs = this.createTabsList(tabs);
    return (
      <div className="tabs">
        <Menu
          className="nav-bar"
          selectable={false}
          mode="horizontal"
          theme="dark"
        >
          <Menu.Item className="roots-logo">
            <img src={rootsLogo} height="50px" width="50px" />
          </Menu.Item>
          {listTabs}
          <div className="logout-button">
            <Link to="/profile">
              <img
                src={profileIcon}
                alt="Profile Icon"
                height="35px"
                width="35px"
              />
            </Link>
            <Button className="button" onClick={this.props.onClickSignOut}>
              <h3 className="button-text">Logout</h3>
            </Button>
          </div>
        </Menu>
      </div>
    );
  }
}
