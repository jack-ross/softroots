import React, { Component } from "react";
import { Collapse } from "antd";
import ViewSingleChecklist from "./ViewSingleChecklist.js";
import createEndTimeString from "../helperFunctions/createEndTimeString.js";
import sortEndTimes from "../helperFunctions/sortEndTimes.js";

/* PROPS:
    checklists: [obj], the checklist objects pulled from firebase to render
    firebasePath: string, the path where these checklists are coming from in
      the form "/dailyLists/<YYYY-MM-DD>/<location>/<role>"
*/

export default class ListOfChecklists extends Component {
  render() {
    let checklistArray = Object.keys(this.props.checklists).map(key => {
      return this.props.checklists[key];
    });

    checklistArray.sort(function(a, b) {
      return sortEndTimes(a.endTime, b.endTime);
    });
    const renderedChecklists = checklistArray.map(checklist => {
      let headerWithEndTime =
        checklist.title +
        " (due by " +
        createEndTimeString(checklist.endTime) +
        ")";
      return (
        <Collapse.Panel header={headerWithEndTime}>
          <ViewSingleChecklist
            checklist={checklist}
            firebasePath={this.props.firebasePath}
          />
        </Collapse.Panel>
      );
    });
    return (
      <Collapse accordion>
        {renderedChecklists}
      </Collapse>
    );
  }
}
