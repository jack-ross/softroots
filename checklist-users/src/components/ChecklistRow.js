import React, { Component } from "react";
import { Modal } from "antd";
import { Row, Col } from "react-bootstrap";

/* PROPS:
    onCheck: function to call when an item is checked/unchecked
    subtask: object with the following fields
      shortDescription: description to be displayed initially
      longDescription: more detailed description to be displayed in a Modal when the task is clicked on
*/

export default class ChecklistRow extends Component {
  displayMoreInfo(subtask) {
    Modal.info({
      title: subtask.shortDescription,
      content: subtask.longDescription,
      okText: "Got it."
    });
  }

  render() {
    return (
      <Row className="show-grid">
        <Col xs={10}>
          <p onClick={() => this.displayMoreInfo(this.props.subtask)}>
            {this.props.subtask.shortDescription}{" "}
          </p>
        </Col>

        <Col xs={2}>
          <input
            type="checkbox"
            onChange={e => this.props.onCheck(e.target.checked)}
          />
        </Col>
      </Row>
    );
  }
}
