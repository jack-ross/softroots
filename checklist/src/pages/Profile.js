import React, { Component } from "react";
import TopNavBar from "../components/TopNavBar.js";
import PleaseLogin from "../components/PleaseLogin.js";
import { Input, Button, Modal, notification } from "antd";
import firebase from "../configs/firebaseConfig.js";

/* PROPS
    userInfo: object, logged-in user's info from firebase
*/

const tabs = [
  {
    name: "Home",
    url: "/home"
  },
  {
    name: "Create a Checklist",
    url: "/createchecklist"
  },
  {
    name: "View Current Checklists",
    url: "/viewchecklists"
  },
  {
    name: "Manage Users",
    url: "/users"
  }
];

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newEmail: "",
      newPassword: "",
      newPasswordRepeated: ""
    };
  }

  onInputChange(field, value) {
    this.setState({
      ...this.state,
      [field]: value
    });
  }

  onClickChangeEmail() {
    Modal.confirm({
      title:
        "Are you sure you want to change your email to " +
        this.state.newEmail +
        "?",
      content: "This can be changed at a later date.",
      okText: "Change Email",
      cancelText: "Cancel",
      onOk: () => this.changeEmail(),
      onCancel: () => {}
    });
  }

  changeEmail() {
    let user = firebase.auth().currentUser;
    user
      .updateEmail(this.state.newEmail)
      .then(() => {
        notification.success({
          message: "SUCCESS",
          description: "Your email was successfully updated!"
        });
      })
      .catch(error => {
        notification.error({
          message: "ERROR",
          description: error.message
        });
      });
  }

  onClickChangePassword() {
    // first make sure the two passwords match
    if (this.state.newPassword !== this.state.newPasswordRepeated) {
      notification.error({
        message: "ERROR",
        description: "The two passwords do not match."
      });
    } else {
      Modal.confirm({
        title: "Are you sure you want to change your password?",
        content: "This can be changed at a later date.",
        okText: "Change Password",
        cancelText: "Cancel",
        onOk: () => this.changePassword(),
        onCancel: () => {}
      });
    }
  }

  changePassword() {
    let user = firebase.auth().currentUser;
    user
      .updatePassword(this.state.newPassword)
      .then(() => {
        notification.success({
          message: "SUCCESS",
          description: "Password updated successfully."
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
    // if user not logged in, prompt them to do so
    if (!this.props.userInfo) {
      return <PleaseLogin />;
    }

    return (
      <div>
        <TopNavBar className="horizontal" tabs={tabs} />
        <div style={{ textAlign: "center" }}>
          <h1> User Profile </h1>
          <h3> Name </h3>
          <p>
            {" "}{this.props.userInfo.firstName +
              " " +
              this.props.userInfo.lastName}{" "}
          </p>
          <div style={{ margin: "12px" }} />

          <h3> Location </h3>
          <p>
            {" "}{this.props.userInfo.location}{" "}
          </p>
          <div style={{ margin: "12px" }} />

          <h3> Role </h3>
          <p>
            {" "}{this.props.userInfo.role}{" "}
          </p>
          <div style={{ margin: "24px" }} />
        </div>

        <div style={{ textAlign: "center" }}>
          <h1> Change Email and Password </h1>

          <h3> Enter New Email: </h3>
          <div>
            <Input
              style={{ width: 250 }}
              onChange={e => this.onInputChange("newEmail", e.target.value)}
              placeholder="New Email (max 100 characters)"
              maxLength={100}
            />
          </div>
          <div style={{ margin: "12px" }} />

          <Button
            icon="mail "
            type="primary"
            onClick={() => this.onClickChangeEmail()}
          >
            {" "}Change Email{" "}
          </Button>
          <div style={{ margin: "24px" }} />

          <div>
            <h3> Enter New Password: </h3>
            <Input
              style={{ width: 250 }}
              type="password"
              onChange={e => this.onInputChange("newPassword", e.target.value)}
              placeholder="Password (between 6-100 characters)"
              maxLength={100}
            />
            <div style={{ margin: "12px" }} />

            <h3> Enter New Password Again: </h3>
            <Input
              style={{ width: 250 }}
              type="password"
              onChange={e =>
                this.onInputChange("newPasswordRepeated", e.target.value)}
              placeholder="Password (between 6-100 characters)"
              maxLength={100}
            />
            <div style={{ margin: "12px" }} />
          </div>

          <Button
            icon="lock"
            type="primary"
            onClick={() => this.onClickChangePassword()}
          >
            {" "}Change Password{" "}
          </Button>
        </div>
      </div>
    );
  }
}
