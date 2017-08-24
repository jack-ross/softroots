import React, { Component } from "react";
import ListOfChecklists from "./ListOfChecklists.js";

/* PROPS
    location: string, which location is being referred to (i.e. "Charlottesville, VA")
    roles: [string], which roles to loop through (pulled from role hierarchy)
    checklistDataAtLocation: the data pulled from /dailyLists/<dateKey>/location
    firebaseLocationPath: string, in format "/dailyLists/<dateKey>/<location>"
    userInfo: object, needed for user's name when submitting a comment
*/

export default class LocationListsOfChecklists extends Component {
  render() {
    // if the object pulled from firebase does not exist, tell user no
    // checklists at that location for today
    if (!this.props.checklistDataAtLocation) {
      return (
        <div>
          <h1>
            {" "}{this.props.location}{" "}
          </h1>
          <p> No checklists at this location today. </p>
          <div style={{ margin: "16px 0" }} />
        </div>
      );
    }

    // otherwise, map through the user's accessible roles and return the
    // necessary lists
    let listsByRole = this.props.roles.map(role => {
      let checklistsForRole = this.props.checklistDataAtLocation[role];
      let firebasePath = this.props.firebaseLocationPath + "/" + role + "/";
      return (
        <div>
          <h5 style={{ fontSize: "16px" }}>
            {" "}{role}{" "}
          </h5>
          <div style={{ margin: "8px 0" }} />
          {checklistsForRole &&
            <ListOfChecklists
              firebasePath={firebasePath}
              checklists={checklistsForRole}
              userInfo={this.props.userInfo}
            />}

          {!checklistsForRole && <p> None </p>}
          <div style={{ margin: "16px 0" }} />
        </div>
      );
    });

    return (
      <div>
        <h1>
          {" "}{this.props.location}{" "}
        </h1>
        <div style={{ height: "8px" }} />

        {listsByRole}
        <div style={{ height: "8px" }} />
      </div>
    );
  }
}
