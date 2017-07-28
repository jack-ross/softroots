import React, { Component } from "react";
import { Modal } from "antd";
import { Grid } from "react-bootstrap";
import ChecklistRow from "./ChecklistRow.js";

/* PROPS
    checklist: object, the standard checklist object used throughout this project
*/

export default class ViewSingleChecklist extends Component {
  onCheck(subtask, isChecked) {
    if (isChecked) {
      console.log(subtask.shortDescription + " is completed");
    } else {
      console.log(subtask.shortDescription + " is NOT completed");
    }
  }

  render() {
    const subsections = this.props.checklist.subsections.map(subsection => {
      const subtasks = subsection.subtasks.map(subtask => {
        return (
          <Grid>
            <ChecklistRow
              subtask={subtask}
              onCheck={isChecked => this.onCheck(subtask, isChecked)}
            />
          </Grid>
        );
      });
      return (
        <div>
          <h6>
            {" "}{subsection.title}{" "}
          </h6>
          {subtasks}
        </div>
      );
    });
    return (
      <div>
        <h4>
          {" "}{this.props.checklist.title}{" "}
        </h4>
        <div style={{ margin: "8px 0" }} />

        <h5>
          {" "}{this.props.checklist.description}{" "}
        </h5>
        <div style={{ margin: "8px 0" }} />
        {subsections}
      </div>
    );
  }
}
