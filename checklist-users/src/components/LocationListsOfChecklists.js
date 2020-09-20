import React, { Component } from "react";
import { isObject } from "lodash";
import ListOfChecklists from "./ListOfChecklists.js";
import {getChecklistsFromVal} from "../helperFunctions/getChecklistsFromVal";
import {groupBy} from "lodash"

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
          <h1> {this.props.location} </h1>
          <p> No checklists at this location today. </p>
          <div style={{ margin: "16px 0" }} />
        </div>
      );
    }

    // otherwise, map through the user's accessible roles and return the
    // necessary lists
    const checklists = getChecklistsFromVal({[this.props.location]: this.props.checklistDataAtLocation}).filter(c => !!c && c.location)
      .map(c => ({...c, subCategory: c.subCategory || "Other", category: c.category || "Other"}));
    const groupedByCategory = groupBy(checklists, "category");

    let listsByCategory = Object.keys(groupedByCategory).map(category => {
      let checklistsForCategory = groupedByCategory[category] || [];
      let groupedBySubcategory = groupBy(checklistsForCategory, "subCategory")
      return (
        <div>
          <h5 style={{ fontSize: "16px" }}> {category} </h5>
          <div style={{ margin: "8px 0" }} />
          {checklistsForCategory && Object.keys(groupedBySubcategory).map(subCategory => {
            const subcategoryChecklists = groupedBySubcategory[subCategory];
            return (
              <div style={{marginLeft: 8, paddingLeft: 8, borderLeft: "1px solid #ccc"}}>
                <h5 style={{ fontSize: "16px" }}> {subCategory} </h5>
                <ListOfChecklists
                  firebaseLocationPath={this.props.firebaseLocationPath}
                  checklists={groupedBySubcategory[subCategory]}
                  userInfo={this.props.userInfo}
                />
              </div>
            )
            })
          }

          {!checklistsForCategory && <p> None </p>}
          <div style={{ margin: "16px 0" }} />
        </div>
      );
    });

    return (
      <div>
        <h1> {this.props.location} </h1>
        <div style={{ height: "8px" }} />

        {listsByCategory}
        <div style={{ height: "8px" }} />
      </div>
    );
  }
}
