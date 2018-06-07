import React, { Component } from "react";
import { Grid } from "react-bootstrap";
import SignaturePad from "react-signature-pad";
import "../css/signature.css";
import { Modal, notification } from "antd";
import SubtaskRow from "./SubtaskRow.js";
import firebase from "../configs/firebaseConfig.js";
import ChecklistComments from "./ChecklistComments.js";
import updateSubtaskField from "../firebase/updateSubtaskField.js";

/* PROPS
    checklist: object, the standard checklist object used throughout this project
    firebasePath: string, the path where these checklists are coming from in
      the form "/dailyLists/<YYYY-MM-DD>/<location>/<role>"
    userInfo: object, needed for user's name when submitting a comment
*/

export default class ViewSingleChecklist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signatureVisible: false
    };
  }
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

    firebase
      .database()
      .ref(firebasePath)
      .set(isChecked)
      .catch(error => {
        notification.error({
          message: "ERROR",
          description: error.message
        });
      });
  }

  openSignature() {
    this.setState({
      signatureVisible: true
    });
  }

  handleSignatureCancel() {
    this.setState({
      signatureVisible: false
    });
  }
  handleSignatureOk() {
    this.setState({
      signatureVisible: false
    });
    const signature = this.refs.signature;
    if (!signature.isEmpty()) this.markComplete(true, signature.toDataURL());
  }

  onMarkChecklistAsCompleted(isChecked) {
    if (isChecked && this.props.checklist.requiresSignature) {
      this.openSignature();
    } else {
      this.markComplete(isChecked);
    }
  }

  markComplete(isChecked, url = null) {
    let checkedPath =
      this.props.firebasePath +
      "/" +
      this.props.checklist.key +
      "/isMarkedCompleted";

    firebase
      .database()
      .ref(checkedPath)
      .set(isChecked)
      .catch(error => {
        notification.error({
          message: "ERROR",
          description: error.message
        });
      });

    if (!url) return;

    let imgPath =
      this.props.firebasePath + "/" + this.props.checklist.key + "/signature";

    firebase
      .database()
      .ref(imgPath)
      .set(url)
      .catch(error => {
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
    console.log(this.state);
    const subsections = this.props.checklist.subsections.map(
      (subsection, subsectionIndex) => {
        const subtasks = subsection.subtasks.map((subtask, subtaskIndex) => {
          let subtaskFirebasePath =
            this.props.firebasePath +
            "/" +
            this.props.checklist.key +
            "/subsections/" +
            subsectionIndex +
            "/subtasks/" +
            subtaskIndex;

          return (
            <Grid>
              <SubtaskRow
                subtask={subtask}
                onCheck={isChecked =>
                  this.onCheck(
                    subtask,
                    isChecked,
                    subsectionIndex,
                    subtaskIndex
                  )
                }
                onSubmitInput={newValue =>
                  this.onSubmitInput(
                    subtask,
                    newValue,
                    subsectionIndex,
                    subtaskIndex
                  )
                }
                onChangeSubtaskField={(field, newValue) =>
                  updateSubtaskField(
                    subtask,
                    field,
                    newValue,
                    subsectionIndex,
                    subtaskIndex,
                    this.props.firebasePath,
                    this.props.checklist.key
                  )
                }
                endTime={this.props.checklist.endTime}
                firebasePath={subtaskFirebasePath}
                userInfo={this.props.userInfo}
              />
            </Grid>
          );
        });
        return (
          <div>
            <h6> {subsection.title} </h6>
            {subtasks}
            <div style={{ margin: "8px 0" }} />
          </div>
        );
      }
    );
    return (
      <div>
        <h5> {this.props.checklist.description} </h5>
        <div style={{ margin: "8px 0" }} />

        <ChecklistComments
          comments={this.props.checklist.comments}
          firebasePath={
            this.props.firebasePath + "/" + this.props.checklist.key
          }
          userInfo={this.props.userInfo}
          type="checklist"
        />
        <div style={{ margin: "8px 0" }} />

        {subsections}
        <div style={{ margin: "8px 0" }} />

        <p> Complete? </p>
        <input
          checked={this.props.checklist.isMarkedCompleted}
          type="checkbox"
          onChange={e => this.onMarkChecklistAsCompleted(e.target.checked)}
        />
        {this.props.checklist.signature && (
          <img
            src={this.props.checklist.signature}
            style={{ height: 200, width: 400 }}
          />
        )}
        <Modal
          title="Sign verifying completion"
          visible={this.state.signatureVisible}
          onOk={() => this.handleSignatureOk()}
          onCancel={() => this.handleSignatureCancel()}
        >
          <div style={{ height: 400 }}>
            <SignaturePad ref="signature" />
          </div>
        </Modal>
      </div>
    );
  }
}
