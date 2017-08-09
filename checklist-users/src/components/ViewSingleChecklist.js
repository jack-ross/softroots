import React, { Component } from "react";
import { Grid } from "react-bootstrap";
import { notification } from "antd";
import ChecklistRow from "./ChecklistRow.js";
import firebase from "../configs/firebaseConfig.js";

/* PROPS
    checklist: object, the standard checklist object used throughout this project
    firebasePath: string, the path where these checklists are coming from in
      the form "/dailyLists/<YYYY-MM-DD>/<location>/<role>"
*/

export default class ViewSingleChecklist extends Component {
  onCheck(subtask, isChecked, subsectionIndex, subtaskIndex) {
    let firebasePath =
      this.props.firebasePath +
      "/" +
      this.props.checklist.key +
      "/subsections/" +
      subsectionIndex +
      "/subtasks/" +
      subtaskIndex +
      "/isCompleted";
    firebase.database().ref(firebasePath).set(isChecked).catch(error => {
      notification.error({
        message: "ERROR",
        description: error.message
      });
    });
  }

  onSubmitInput(subtask, newValue, subsectionIndex, subtaskIndex) {
    let firebasePath =
      this.props.firebasePath +
      "/" +
      this.props.checklist.key +
      "/subsections/" +
      subsectionIndex +
      "/subtasks/" +
      subtaskIndex;
    let inputValuePath = firebasePath + "/inputValue";
    let isCompletedPath = firebasePath + "/isCompleted";
    let firebaseUpdates = {};
    firebaseUpdates[inputValuePath] = newValue;
    if (newValue === "") {
      firebaseUpdates[isCompletedPath] = false;
    } else {
      firebaseUpdates[isCompletedPath] = true;
    }
    firebase
      .database()
      .ref()
      .update(firebaseUpdates)
      .then(response => {
        notification.success({
          message: "SUCCESS",
          description: "Submission saved successfully.",
          duration: 2
        });
      })
      .catch(error => {
        notification.error({
          message: "ERROR",
          description: error.message
        });
      });
  }

  render() {
    const subsections = this.props.checklist.subsections.map(
      (subsection, subsectionIndex) => {
        const subtasks = subsection.subtasks.map((subtask, subtaskIndex) => {
          return (
            <Grid>
              <ChecklistRow
                subtask={subtask}
                onCheck={isChecked =>
                  this.onCheck(
                    subtask,
                    isChecked,
                    subsectionIndex,
                    subtaskIndex
                  )}
                onSubmitInput={newValue =>
                  this.onSubmitInput(
                    subtask,
                    newValue,
                    subsectionIndex,
                    subtaskIndex
                  )}
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
            <div style={{ margin: "8px 0" }} />
          </div>
        );
      }
    );
    return (
      <div>
        <h5>
          {" "}{this.props.checklist.description}{" "}
        </h5>
        <div style={{ margin: "8px 0" }} />
        {subsections}
      </div>
    );
  }
}
