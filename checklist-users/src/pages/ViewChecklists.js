import React, { Component } from "react";
import { Radio } from "antd";
import { Redirect } from "react-router-dom";
import firebase from "../configs/firebaseConfig.js";
import LocationListsOfChecklists from "../components/LocationListsOfChecklists.js";
import roleHierarchy from "../roles/roleHierarchy.js";

/* PROPS:
    userInfo: object; the logged in user's information pulled from firebase
*/

/* STATE:
    viewMode: string; determines whether to view just the user's role's checklists or ALL
      checklists in all roles below them in the hierarchy.  set to either "mine" or "all"
*/

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

    let listsByLocations = <div />;
    if (this.state.firebaseChecklists) {
      // grab the relevant roles as an array, whether it's just the user's singular
      // role OR all the roles below them in the hierarchy based on the viewMode
      let roles = [];
      if (this.state.viewMode === "mine") {
        roles = [this.props.userInfo.role];
      } else if (this.state.viewMode === "all") {
        roles = roleHierarchy[this.props.userInfo.role];
      }

      // if user is an Admin, show all locations; otherwise, just the user's location
      let locations = [];
      if (this.props.userInfo.role === "Admin") {
        locations = ["Charlottesville, VA", "Newark, DE"];
      } else {
        locations = [this.props.userInfo.location];
      }

      // map over those locations and get the lists from each one
      listsByLocations = locations.map(location => {
        let checklistDataAtLocation = this.state.firebaseChecklists[location];
        let firebasePath =
          "/dailyLists/" + this.props.dateKey + "/" + location + "/";
        // render user's role's checklists for the day if any, otherwise tell
        // them none exist
        return (
          <LocationListsOfChecklists
            location={location}
            roles={roles}
            checklistDataAtLocation={checklistDataAtLocation}
            firebaseLocationPath={firebasePath}
            userInfo={this.props.userInfo}
          />
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
          <div style={{ margin: "10px 0" }} />
        </div>
        <p>
          {" "}{this.state.status}{" "}
        </p>
        {listsByLocations}
      </div>
    );
  }
}
