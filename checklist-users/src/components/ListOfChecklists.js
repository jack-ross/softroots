import React, { Component } from "react";
import { isObject } from "lodash";
import { Collapse } from "antd";
import ViewSingleChecklist from "./ViewSingleChecklist.js";
import createEndTimeString from "../helperFunctions/createEndTimeString.js";
import sortEndTimes from "../helperFunctions/sortEndTimes.js";
import isChecklistCompleted from "../helperFunctions/isChecklistCompleted.js";
import isPastEndTime from "../helperFunctions/isPastEndTime.js";
import {Button} from "react-bootstrap";

/* PROPS:
    checklists: [obj], the checklist objects pulled from firebase to render
    firebasePath: string, the path where these checklists are coming from in
      the form "/dailyLists/<YYYY-MM-DD>/<location>/<role>"
    userInfo: object, needed for user's name when submitting a comment
*/

export default class ListOfChecklists extends Component {
  render() {
    const hideOptional = !this.state || !this.state.showOptional
    // create an array of the checklists
    let checklistArray = Object.keys(this.props.checklists)
      .map(key => {
        return this.props.checklists[key];
      })
      .filter(checklist => isObject(checklist));
    const optionalCount = checklistArray.filter(c => !c.required).length;

    // sort them based on their end times
    checklistArray.sort(function(a, b) {
      return sortEndTimes(a.endTime, b.endTime);
    });

    // the CSS color constants
    const red = "red";
    const green = "green";
    const darkOrange = "#bf833b";
    const blue = "blue";

    // render each checklist as a Collapse from antd, where the inner panel
    // displays the checklist itself as a ViewSingleChecklist component.
    // the color of the text in the header is determined by whether or not
    // the checklist is completed and if it's late
    const renderedChecklists = checklistArray.filter((c) => !hideOptional || c.required)
      .map(checklist => {
        const days = checklist.daysToRepeat.map(d => d.slice(0, 3)).join(" ")

      let headerWithEndTime =
        <div style={{display: "flex", justifyContent: "space-between"}}>
          <div>{checklist.title + " (" + createEndTimeString(checklist.endTime) + ")"}</div>

        </div>

      // determine the header color
      let areSubtasksCompleted = isChecklistCompleted(checklist);
      let isMarkedCompleted = checklist.isMarkedCompleted;
      let isLate = isPastEndTime(checklist.endTime, "America/New_York");

      let headerStyle = { color: darkOrange };

      if (areSubtasksCompleted && isMarkedCompleted) {
        headerStyle.color = green;
      } else if (isMarkedCompleted) {
        headerStyle.color = blue;
      } else if (isLate) {
        headerStyle.color = red;
      }

      headerWithEndTime = <p style={headerStyle}> {headerWithEndTime} </p>;

      return (
        <Collapse.Panel header={headerWithEndTime}>
          <ViewSingleChecklist
            checklist={checklist}
            firebasePath={this.props.firebaseLocationPath + "/" + checklist.role}
            userInfo={this.props.userInfo}
          />
        </Collapse.Panel>
      );
    });

    return <div>
      {renderedChecklists.length > 0 && <Collapse accordion>{renderedChecklists}</Collapse>}
      {optionalCount > 0 &&
        <div style={{paddingTop: 8}}>
          {
            (hideOptional ?
                <Button onClick={() => this.setState({showOptional: true})}>Show optional ({optionalCount})</Button>
                :
                <Button onClick={() => this.setState({showOptional: false})}>Hide optional</Button>
            )
          }
        </div>
      }


    </div>
  }
}
