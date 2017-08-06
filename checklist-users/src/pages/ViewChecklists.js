import React, { Component } from "react";
import { Radio } from "antd";
import { Redirect } from "react-router-dom";
import firebase from "../configs/firebaseConfig.js";
import ListOfChecklists from "../components/ListOfChecklists.js";
import roleHierarchy from "../roles/roleHierarchy.js";

/* PROPS:
    userInfo: object; the logged in user's information pulled from firebase
*/

/* STATE:
    viewMode: string; determines whether to view just the user's role's checklists or ALL
      checklists in all roles below them in the hierarchy.  set to either "mine" or "all"
*/

// test data
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
    // create the daily key ONCE to avoid weird instances where different keys
    // are used across different parts of the app
    this.state = {
      viewMode: "mine",
      firebaseChecklists: undefined,
      status: "Loading..."
    };
  }

  componentWillMount() {
    // grab today's lists from firebase
    firebase
      .database()
      .ref("/dailyLists/" + this.props.dateKey)
      .on("value", snapshot => {
        // if no data, let the user know by updating the status
        if (!snapshot.val()) {
          this.setState({
            ...this.state,
            status: "None"
          });
        } else {
          this.setState({
            ...this.state,
            firebaseChecklists: snapshot.val(),
            status: ""
          });
        }
      });
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
    if (this.state.firebaseChecklists && this.state.viewMode === "mine") {
      let role = this.props.userInfo.role;
      let location = this.props.userInfo.location;
      let checklistsForUserRole = this.state.firebaseChecklists[location][role];
      let firebasePath =
        "/dailyLists/" + this.props.dateKey + "/" + location + "/" + role;
      // render user's role's checklists for the day if any, otherwise tell
      // them none exist
      lists = (
        <div>
          <h5>
            {" "}{this.props.userInfo.role}{" "}
          </h5>
          <div style={{ margin: "8px 0" }} />
          {checklistsForUserRole &&
            <ListOfChecklists
              firebasePath={firebasePath}
              checklists={checklistsForUserRole}
            />}

          {!checklistsForUserRole && <p> None </p>}
        </div>
      );
    } else if (this.state.firebaseChecklists && this.state.viewMode === "all") {
      // grab location and lower roles from hierarchy
      let location = this.props.userInfo.location;
      let roles = roleHierarchy[this.props.userInfo.role];

      // map through the roles, creating a list of tasks for each one in that location
      lists = roles.map(role => {
        let checklistsForRole = this.state.firebaseChecklists[location][role];
        let firebasePath =
          "/dailyLists/" + this.props.dateKey + "/" + location + "/" + role;
        return (
          <div>
            <h5>
              {" "}{role}{" "}
            </h5>
            <div style={{ margin: "8px 0" }} />
            {checklistsForRole &&
              <ListOfChecklists
                firebasePath={firebasePath}
                checklists={checklistsForRole}
              />}

            {!checklistsForRole && <p> None </p>}
            <div style={{ margin: "8px 0" }} />
          </div>
        );
      });
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
        <p>
          {" "}{this.state.status}{" "}
        </p>
        {lists}
      </div>
    );
  }
}
