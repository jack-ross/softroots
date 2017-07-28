import React, { Component } from "react";
import { Radio } from "antd";
import { Redirect } from "react-router-dom";
import ListOfChecklists from "../components/ListOfChecklists.js";

/* PROPS:
    userInfo: object; the logged in user's information pulled from firebase
*/

/* STATE:
    viewMode: string; determines whether to view just the user's role's checklists or ALL
      checklists in all roles below them in the hierarchy.  set to either "mine" or "all"
*/

let grillData = require("../test/grillLists.json");
grillData = Object.keys(grillData).map(key => {
  return grillData[key];
});

let lineData = require("../test/lineLists.json");
lineData = Object.keys(lineData).map(key => {
  return lineData[key];
});

export default class ViewChecklists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewMode: "mine"
    };
  }

  onChangeToggle(value) {
    this.setState({
      ...this.state,
      viewMode: value
    });
  }

  render() {
    // if user is not logged in, redirect them to the home page
    if (!this.props.userInfo) {
      return <Redirect to="/" />;
    }
    let lists = <div />;
    if (this.state.viewMode === "mine") {
      lists = (
        <div>
          <h5>
            {" "}{this.props.userInfo.role}{" "}
          </h5>
          <div style={{ margin: "8px 0" }} />
          <ListOfChecklists checklists={grillData} />
        </div>
      );
    } else if (this.state.viewMode === "all") {
      lists = (
        <div>
          <h5> Grill </h5>
          <div style={{ margin: "8px 0" }} />
          <ListOfChecklists checklists={grillData} />
          <div style={{ margin: "16px 0" }} />

          <h5> Line </h5>
          <div style={{ margin: "8px 0" }} />
          <ListOfChecklists checklists={grillData} />
        </div>
      );
    }

    return (
      <div style={{ paddingLeft: "10%", paddingRight: "10%" }}>
        <div style={{ textAlign: "center" }}>
          <Radio.Group
            value={this.state.viewMode}
            onChange={e => this.onChangeToggle(e.target.value)}
          >
            <Radio.Button value="mine">My Role</Radio.Button>
            <Radio.Button value="all">All Roles</Radio.Button>
          </Radio.Group>
          <div style={{ margin: "8px 0" }} />
        </div>
        {lists}
      </div>
    );
  }
}
