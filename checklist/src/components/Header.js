import React, { Component } from "react";
import { Button } from "antd";
import "../css/Header.css";

/* PROPS
    onClickSignOut: function to be called when the sign out button is clicked
    userFirstName: string; name to be displayed (i.e. "Michael")
*/

export default class Header extends Component {
  render() {
    return (
      <div className="header">
        <div className="firstName">
          <p>
            {" "}Welcome {this.props.userFirstName}{" "}
          </p>
        </div>
        <div className="signOutButton">
          <Button onClick={() => this.props.onClickSignOut()}>
            {" "}Sign Out{" "}
          </Button>
        </div>
      </div>
    );
  }
}
