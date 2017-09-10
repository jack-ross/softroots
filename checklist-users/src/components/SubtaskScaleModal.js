import React, { Component } from "react";
import { Modal, Radio } from "antd";
import getColorOfScale from "../helperFunctions/getColorOfScale.js";

/* PROPS
    subtask: object, the subtask we're updating
    onSubmitScaleValue: function, what happens when we submit the new scale
    closeModal: function: changes visibility of the Modal
*/

/* STATE
    scaleValue: integer, between 1 and 5 (could be undefined)
*/

export default class SubtaskScaleModal extends Component {
  constructor(props) {
    super(props);
    let initialValue = undefined;
    if (this.props.subtask.scaleValue) {
      initialValue = this.props.subtask.scaleValue;
    }
    this.state = {
      scaleValue: initialValue
    };
  }

  onSelectScale(value) {
    this.setState({
      ...this.state,
      scaleValue: value
    });
  }

  onSubmitScaleValue() {
    this.props.closeModal();
    this.props.onSubmitScaleValue(this.state.scaleValue);
  }

  getBackgroundColor(value) {
    // this method takes the value of a Radio.Button and
    // compares it to the currently selected value.  It returns
    // a color to display if either 1) no value has been selected
    // yet, or 2) if the currently selected value matches the
    // button's value
    if (!this.state.scaleValue || this.state.scaleValue === value) {
      return getColorOfScale(value);
    }
    return "";
  }

  render() {
    let subtask = this.props.subtask;
    return (
      <Modal
        title={subtask.shortDescription}
        okText="Submit"
        cancelText="Cancel"
        onOk={() => this.onSubmitScaleValue()}
        onCancel={() => this.props.closeModal()}
        visible={true}
      >
        <div style={{ textAlign: "center" }}>
          <Radio.Group onChange={e => this.onSelectScale(e.target.value)}>
            <Radio.Button
              value={1}
              style={{ backgroundColor: this.getBackgroundColor(1) }}
            >
              {" "}
              1{" "}
            </Radio.Button>
            <Radio.Button
              value={2}
              style={{ backgroundColor: this.getBackgroundColor(2) }}
            >
              {" "}
              2{" "}
            </Radio.Button>
            <Radio.Button
              value={3}
              style={{ backgroundColor: this.getBackgroundColor(3) }}
            >
              {" "}
              3{" "}
            </Radio.Button>
            <Radio.Button
              value={4}
              style={{ backgroundColor: this.getBackgroundColor(4) }}
            >
              {" "}
              4{" "}
            </Radio.Button>
            <Radio.Button
              value={5}
              style={{ backgroundColor: this.getBackgroundColor(5) }}
            >
              {" "}
              5{" "}
            </Radio.Button>
          </Radio.Group>
        </div>
      </Modal>
    );
  }
}
