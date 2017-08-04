import React, { Component } from "react";
import { Input, Button, notification } from "antd";
import { Link, Redirect } from "react-router-dom";
import loginValidation from "../validation/loginValidation.js";
import firebase from "../configs/firebaseConfig.js";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {
        email: "",
        password: ""
      }
    };
  }

  onClickSubmit() {
    // TODO verify input, then try firebase login
    if (loginValidation(this.state.userInfo)) {
      firebase
        .auth()
        .signInWithEmailAndPassword(
          this.state.userInfo.email,
          this.state.userInfo.password
        )
        .then(response => {
          notification.success({
            message: "SUCCESS",
            description: "User logged in.",
            duration: 2
          });
        })
        .catch(error => {
          // if login is unsuccessful, display firebase error message
          var errorMessage = error.message;
          notification.error({
            message: "ERROR",
            description: errorMessage,
            duration: 3
          });
        });
    }
  }

  onChange(field, value) {
    let userInfo = this.state.userInfo;
    userInfo[field] = value;
    this.setState({
      ...this.state,
      userInfo: userInfo
    });
  }

  render() {
    // if already logged in, redirect to view checklists page
    if (this.props.userInfo) {
      return <Redirect to="/" />;
    }
    return (
      <div style={{ padding: "10%" }}>
        <h4> Email: </h4>
        <Input onChange={e => this.onChange("email", e.target.value)} />
        <div style={{ margin: "12px 0" }} />

        <h4> Password: </h4>
        <Input
          type="password"
          onChange={e => this.onChange("password", e.target.value)}
        />
        <div style={{ margin: "12px 0" }} />

        <Link to="/">
          <Button> Cancel </Button>
        </Link>
        <Button type="primary" onClick={() => this.onClickSubmit()}>
          {" "}Login{" "}
        </Button>
      </div>
    );
  }
}
