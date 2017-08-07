import React, { Component } from "react";
import { Input, Button, Modal, notification } from "antd";
import { Link, Redirect } from "react-router-dom";
import firebase from "../configs/firebaseConfig.js";

export default class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailAddress: ""
    };
  }

  onInputChange(value) {
    this.setState({
      ...this.state,
      emailAddress: value
    });
  }

  onClickSendEmail() {
    Modal.confirm({
      title: "Send email to reset password?",
      content:
        "Make sure " + this.state.emailAddress + " is the right email address.",
      okText: "Send Email",
      cancelText: "Cancel",
      onOk: () => this.sendResetPasswordEmail(),
      onCancel: () => {}
    });
  }

  sendResetPasswordEmail() {
    firebase
      .auth()
      .sendPasswordResetEmail(this.state.emailAddress)
      .then(() => {
        // Email sent.
        notification.success({
          message: "SUCCESS",
          description: "The email was successfully sent.",
          duration: 2
        });
      })
      .catch(error => {
        notification.error({
          message: "ERROR",
          description: error.message,
          duration: 2
        });
      });
  }

  render() {
    // if user logged in, redirect them
    if (this.props.userInfo) {
      return <Redirect to="/" />;
    }

    return (
      <div style={{ padding: "10%" }}>
        <p>
          {" "}Forgot your password? Enter your email below, and we'll send you
          an email to reset your password.{" "}
        </p>

        <div style={{ height: "10px" }} />
        <Input onChange={e => this.onInputChange(e.target.value)} />
        <div style={{ height: "10px" }} />

        <Link to="/">
          <Button> Cancel </Button>
        </Link>

        <Button type="primary" onClick={() => this.onClickSendEmail()}>
          {" "}Send Email{" "}
        </Button>
      </div>
    );
  }
}
