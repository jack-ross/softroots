import React, { Component } from "react";
import { Modal, Button, Input } from "antd";
import { Row, Col } from "react-bootstrap";
import SubtaskInputModal from "./SubtaskInputModal.js";

/* PROPS:
    onCheck: function to call when an item is checked/unchecked
    onSubmitInput: function to call when an input is updated
    subtask: object with the following fields
      shortDescription: description to be displayed initially
      longDescription: more detailed description to be displayed in a Modal when the task is clicked on
      isCompleted: boolean, whether the subtask should be checked or not
*/

export default class ChecklistRow extends Component {
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
    // displayType is either "input" or "checkbox" to know which to render
    let displayType = this.props.subtask.displayType;

    // style the row so it's red if task not completed, green if it is
    let style = { backgroundColor: "#f7cad5" };
    if (this.props.subtask.isCompleted) {
      style = { backgroundColor: "#bff2c3" };
    }

    return (
      <div>
        <Row style={style} className="show-grid">
          <Col xs={10}>
            <p onClick={() => this.displayMoreInfo(this.props.subtask)}>
              {this.props.subtask.shortDescription}{" "}
            </p>
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
