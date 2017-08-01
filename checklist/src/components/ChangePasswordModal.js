import React, { Component } from "react";
import { Modal, Input, notification } from "antd";
import firebase from "../configs/firebaseConfig.js";

/* PROPS
    isVisible: boolean, whether or not to display this Modal
    emailToReset: string, the email whose password needs to be reset
    onChange: function, what to happen when the Input changes
    closeModal: function, called when the Modal needs to be closed
*/

export default class ChangePasswordModal extends Component {
  onClickSubmit() {
    // try to send a password reset email
    firebase
      .auth()
      .sendPasswordResetEmail(this.props.emailToReset)
      .then(response => {
        notification.success({
          message: "SUCCESS",
          description: "An email has been sent to your account."
        });
        this.props.closeModal();
      })
      .catch(error => {
        notification.error({
          message: "ERROR",
          description: error.message
        });
      });
  }

  render() {
    return (
      <Modal
        visible={this.props.isVisible}
        okText="Reset Password"
        cancelText="Cancel"
        onOk={() => this.onClickSubmit()}
        onCancel={() => this.props.closeModal()}
      >
        <h1> Reset Password? </h1>
        <p>
          {" "}Type in your email address and we'll send you the option to reset
          your password.{" "}
        </p>
        <Input
          value={this.props.emailToReset}
          onChange={e => this.props.onChange(e.target.value)}
        />
      </Modal>
    );
  }
}
