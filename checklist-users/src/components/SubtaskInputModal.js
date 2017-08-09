import React, { Component } from "react";
import { Input, Modal } from "antd";

/* PROPS
    subtask: object; the subtask we're updating;
    onSubmitInput: function; what happens when we submit the new input
      (should save changes to firebase and close the Modal)
    closeModal: function: changes the visibility of the Modal in the parent component
*/

/* STATE
    inputValue: string; the value currently in the Input (who'd have thunk)
*/

export default class SubtaskInputModal extends Component {
  constructor(props) {
    super(props);
    let initialValue = "";
    if (this.props.subtask.inputValue) {
      initialValue = this.props.subtask.inputValue;
    }
    this.state = {
      inputValue: initialValue
    };
  }

  onInputChange(newValue) {
    this.setState({
      ...this.state,
      inputValue: newValue
    });
  }

  onSubmitInput() {
    this.props.closeModal();
    this.props.onSubmitInput(this.state.inputValue);
  }

  render() {
    let subtask = this.props.subtask;
    return (
      <Modal
        title={subtask.shortDescription}
        okText="Submit"
        cancelText="Cancel"
        onOk={() => this.onSubmitInput()}
        onCancel={() => this.props.closeModal()}
        visible={true}
      >
        <p>
          {" "}{this.props.subtask.longDescription}{" "}
        </p>
        <Input
          value={this.state.inputValue}
          onChange={e => this.onInputChange(e.target.value)}
        />
      </Modal>
    );
  }
}
