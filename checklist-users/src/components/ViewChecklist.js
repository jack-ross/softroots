import React, { Component } from "react";
import { Modal } from "antd";

export default class ViewChecklist extends Component {
  displayMoreInfo(subtask) {
    Modal.info({
      title: subtask.shortDescription,
      content: subtask.longDescription,
      okText: "Got it."
    });
  }

  render() {
    const subsections = this.props.checklist.subsections.map(subsection => {
      const subtasks = subsection.subtasks.map(subtask => {
        return (
          <div>
            <input type="checkbox" />{" "}
            <p onClick={() => this.displayMoreInfo(subtask)}>
              {subtask.shortDescription}{" "}
            </p>
          </div>
        );
      });
      return (
        <div>
          <h4>
            {" "}{subsection.title}{" "}
          </h4>
          {subtasks}
        </div>
      );
    });
    return (
      <div>
        <h2>
          {" "}{this.props.checklist.title}{" "}
        </h2>
        <h3>
          {" "}{this.props.checklist.description}{" "}
        </h3>
        {subsections}
      </div>
    );
  }
}
