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

export default class TopNavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shouldRedirect: false,
      redirectUrl: "/"
    };
  }

  // takes in array of tab objects (i.e. this.props.tabs) and returns array of <MenuItem> objects
  // to be displayed
  createTabsList(tabs) {
    const listTabs = tabs.map(tab => {
      return (
        // note we're assiging the url as the key to access later in the handleClick method
        <Menu.Item className="tab" key={tab.url}>
          {tab.name}
        </Menu.Item>
      );
    });
    return listTabs;
  }

  // gets called when a tab is clicked on
  handleTabClick(e) {
    // if the new URL is not the current URL, set state to redirect upon re-rendering
    const newURL = e.key;
    if (!(newURL === this.props.currentURL)) {
      this.setState({
        shouldRedirect: true,
        redirectUrl: newURL
      });
    }
  }

  render() {
    // redirects to new URL if necessary
    if (this.state.shouldRedirect) {
      return <Redirect push to={this.state.redirectUrl} />;
    }

    // else render the navigation bar itself
    const listTabs = this.createTabsList(this.props.tabs);
    return (
      <div className="tabs">
        <Menu
          className="nav-bar"
          selectable={false}
          mode="horizontal"
          theme="dark"
          onClick={e => this.handleTabClick(e)}
        >
          <Menu.Item className="roots-logo" key="/home">
            <img src={rootsLogo} height="50px" width="50px" />
          </Menu.Item>
          {listTabs}
          <Menu.Item className="logout-button">
            <Link to="/profile">
              <img
                src={profileIcon}
                alt="Profile Icon"
                height="35px"
                width="35px"
              />
            </Link>
            <Button
              className="button"
              onClick={() => this.props.onClickSignOut()}
            >
              <h3 className="button-text">Logout</h3>
            </Button>
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}
