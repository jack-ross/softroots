import React, { Component } from "react";
import { Modal, Button, Icon } from "antd";
import { Row, Col } from "react-bootstrap";
import SubtaskInputModal from "./SubtaskInputModal.js";
import SubtaskScaleModal from "./SubtaskScaleModal.js";
import isPastEndTime from "../helperFunctions/isPastEndTime.js";
import updateSubtaskField from "../firebase/updateSubtaskField.js";
import getColorOfScale from "../helperFunctions/getColorOfScale.js";
import "../css/SubtaskRow.css";

/* PROPS:
    onCheck: function to call when an item is checked/unchecked
    onSubmitInput: function to call when an input is updated
    subtask: object with the following fields
      shortDescription: description to be displayed initially
      longDescription: more detailed description to be displayed in a Modal when the task is clicked on
      isCompleted: boolean, whether the subtask should be checked or not
    endTime: when the subtask (and list as a whole) needs to be completed by
*/

export default class SubtaskRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isInputModalVisible: false,
      isScaleModalVisible: false
    };
  }

  displayMoreInfo(subtask) {
    Modal.info({
      title: subtask.shortDescription,
      content: subtask.longDescription,
      okText: "OK"
    });
  }

  changeModalVisibility(modal) {
    let newState = this.state;
    newState[modal] = !newState[modal];
    this.setState(newState);
  }

  render() {
    isPastEndTime(this.props.endTime, "America/New_York");
    // displayType is either "input" or "checkbox" or "scale" to know which to render
    let displayType = this.props.subtask.displayType;

    // style the row so it's yellow if task not completed, green if it is,
    // and red if not completed AND late
    let style = { backgroundColor: "#f7cad5" };

    if (this.props.subtask.isCompleted) {
      style = { backgroundColor: "#bff2c3" };
    } else if (!isPastEndTime(this.props.endTime, "America/New_York")) {
      style = { backgroundColor: "#fafcb5" };
    }

    // if it's a scale, we want the button to change color based on what's currently been
    // selected.  also want to display the currently selected value on the button
    // rather than the "select" icon from antd
    let scaleButtonStyle = {};
    let scaleIcon = "select";
    let scaleText = "";
    if (this.props.subtask.scaleValue) {
      let scaleColor = getColorOfScale(this.props.subtask.scaleValue);
      scaleButtonStyle.backgroundColor = scaleColor;
      scaleIcon = "";
      scaleText = this.props.subtask.scaleValue;
    }

    return (
      <div>
        <Row style={style} className="show-grid">
          <Col xs={10}>
            <div className="shortDescription">
              <p>{this.props.subtask.shortDescription} </p>
            </div>

            {this.props.subtask.longDescription && (
              <div className="longDescription">
                <Icon
                  type="plus-circle-o"
                  style={{ fontSize: "10px" }}
                  onClick={() => this.displayMoreInfo(this.props.subtask)}
                />
              </div>
            )}
          </Col>

          <Col xs={2}>
            {displayType === "checkbox" && (
              <input
                type="checkbox"
                checked={this.props.subtask.isCompleted}
                onChange={e => this.props.onCheck(e.target.checked)}
              />
            )}
            {displayType === "input" && (
              <Button
                onClick={() =>
                  this.changeModalVisibility("isInputModalVisible")}
                size="small"
                icon="arrows-alt"
              />
            )}
            {displayType === "scale" && (
              <Button
                size="small"
                icon={scaleIcon}
                onClick={() =>
                  this.changeModalVisibility("isScaleModalVisible")}
                style={scaleButtonStyle}
              >
                {scaleText}
              </Button>
            )}
          </Col>
        </Row>

        {this.state.isInputModalVisible && (
          <SubtaskInputModal
            onSubmitInput={newValue =>
              this.props.onChangeSubtaskField("inputValue", newValue)}
            subtask={this.props.subtask}
            closeModal={() => this.changeModalVisibility("isInputModalVisible")}
          />
        )}

        {this.state.isScaleModalVisible && (
          <SubtaskScaleModal
            onSubmitScaleValue={newValue =>
              this.props.onChangeSubtaskField("scaleValue", newValue)}
            subtask={this.props.subtask}
            closeModal={() => this.changeModalVisibility("isScaleModalVisible")}
          />
        )}
      </div>
    );
  }
}
