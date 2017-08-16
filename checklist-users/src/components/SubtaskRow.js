import React, { Component } from "react";
import { Modal, Button, Icon } from "antd";
import { Row, Col } from "react-bootstrap";
import SubtaskInputModal from "./SubtaskInputModal.js";
import isPastEndTime from "../helperFunctions/isPastEndTime.js";

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
      isInputModalVisible: false
    };
  }

  displayMoreInfo(subtask) {
    Modal.info({
      title: subtask.shortDescription,
      content: subtask.longDescription,
      okText: "Got it."
    });
  }

  changeModalVisibility() {
    this.setState({
      ...this.state,
      isInputModalVisible: !this.state.isInputModalVisible
    });
  }

  render() {
    isPastEndTime(this.props.endTime, "America/New_York");
    // displayType is either "input" or "checkbox" to know which to render
    let displayType = this.props.subtask.displayType;

    // style the row so it's yellow if task not completed, green if it is,
    // and red if not completed AND late
    let style = { backgroundColor: "#f7cad5" };

    if (this.props.subtask.isCompleted) {
      style = { backgroundColor: "#bff2c3" };
    } else if (!isPastEndTime(this.props.endTime, "America/New_York")) {
      style = { backgroundColor: "#fafcb5" };
    }

    return (
      <div>
        <Row style={style} className="show-grid">
          <Col xs={10}>
            <p>
              {this.props.subtask.shortDescription}{" "}
            </p>
            {this.props.subtask.longDescription &&
              <Icon
                type="plus-circle-o"
                style={{ fontSize: "10px" }}
                onClick={() => this.displayMoreInfo(this.props.subtask)}
              />}
          </Col>

          <Col xs={2}>
            {displayType === "checkbox" &&
              <input
                type="checkbox"
                checked={this.props.subtask.isCompleted}
                onChange={e => this.props.onCheck(e.target.checked)}
              />}
            {displayType === "input" &&
              <Button
                onClick={() => this.changeModalVisibility()}
                size="small"
                icon="arrows-alt"
              />}
          </Col>
        </Row>

        {this.state.isInputModalVisible &&
          <SubtaskInputModal
            onSubmitInput={newValue => this.props.onSubmitInput(newValue)}
            subtask={this.props.subtask}
            closeModal={() => this.changeModalVisibility()}
          />}
      </div>
    );
  }
}
