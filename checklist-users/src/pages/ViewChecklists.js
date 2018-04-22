import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Radio } from "antd";
import { Redirect } from "react-router-dom";
import firebase from "../configs/firebaseConfig.js";
import LocationListsOfChecklists from "../components/LocationListsOfChecklists.js";
import roleHierarchy from "../roles/roleHierarchy.js";
import "../css/ViewChecklists.css";
import { storeLocations } from "../helperFunctions/locations.js";
import { roles } from "../helperFunctions/roles.js";

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
      viewMode: "me",
      firebaseChecklists: {},
      loadedChecklists: false
    };
  }

  componentDidMount() {
    this.setState({
      ...this.state,
      roles: roles
    });
    // grab today's lists from firebase
    firebase
      .database()
      .ref("/dailyLists/" + this.props.dateKey)
      .on("value", snapshot => {
        // if no data, let the user know by updating the status
        if (snapshot.val()) {
          this.setState({
            ...this.state,
            firebaseChecklists: snapshot.val(),
            loadedChecklists: true
          });
          console.log(snapshot.val());
        } else {
          this.setState({
            ...this.state
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
    if (this.state.roles === undefined) return <p>Loading...</p>;
    if (this.state.loadedChecklists === false)
      return <p>Loading... checklists for {this.props.dateKey}</p>;

    let listsByLocations = <div />;
    // grab the relevant roles as an array, whether it's just the user's singular
    // role OR all the roles below them in the hierarchy based on the viewMode
    let roles = [];
    if (this.state.viewMode === "me") {
      roles = [this.props.userInfo.role];
    } else if (this.state.viewMode === "crew") {
      roles = roleHierarchy[this.props.userInfo.role];
    }

    // if user is an Admin, show all locations; otherwise, just the user's location
    let locations = [];
    if (this.props.userInfo.role === "Admin") {
      locations = storeLocations;
    } else {
      locations = [this.props.userInfo.location];
    }

    console.log(locations);

    // map over those locations and get the lists from each one
    listsByLocations = locations.map(location => {
      let checklistDataAtLocation = this.state.firebaseChecklists[location];
      console.log("checklistDataAtLocation");
      console.log(this.state.firebaseChecklists);
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

    return (
      <div className="ViewChecklistsPage">
        <div style={{ margin: "10px" }} />
        <div style={{ textAlign: "center" }}>
          <Radio.Group
            value={this.state.viewMode}
            onChange={e => this.onChangeToggle(e.target.value)}
          >
            <Radio.Button value="me">Me</Radio.Button>
            <Radio.Button value="crew">Crew</Radio.Button>
          </Radio.Group>
          <div style={{ margin: "10px 0" }} />
        </div>

        {listsByLocations}
      </div>
    );
  }
}
