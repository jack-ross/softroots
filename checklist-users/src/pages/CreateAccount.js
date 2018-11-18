import React, { Component } from "react";
import DropdownSelection from "../components/DropdownSelection.js";
import { Input, Button, Modal, notification } from "antd";
import createAccountValidation from "../validation/createAccountValidation.js";
import { Link } from "react-router-dom";
import firebase from "../configs/firebaseConfig.js";
import "../css/CreateAccount.css";

// arrays for the dropdowns when creating an account
const locations = ["Charlottesville", "Newark", "CV2", "Richmond", "Pitt"];
const roles = [
  "GM",
  "Assistant GM",
  "Kitchen Manager",
  "Shift Manager",
  "Grill",
  "Prep",
  "Line",
  "Dish"
];

export default class CreateAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      passwordRepeated: "",
      location: "",
      role: ""
    };
  }

  onChange(value, field) {
    this.setState({
      ...this.state,
      [field]: value
    });
  }

  onClickSubmit() {
    if (createAccountValidation(this.state)) {
      let email = this.state.email;
      let password = this.state.password;
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(user => {
          Modal.info({
            title: "Account Created",
            content:
              "Please wait for an admin to verify your account before logging in again.",
            okText: "Ok",
            onOk: () => {
              window.location = "/";
            }
          });
          let uid = user.uid;
          let userInfo = this.state;
          userInfo.uid = uid;
          delete userInfo.password;
          delete userInfo.passwordRepeated;
          firebase
            .database()
            .ref("users/unverified/" + uid)
            .set(userInfo);
        })
        .catch(function(error) {
          notification.error({
            title: "ERROR",
            description: error.message
          });
        });
    }
  }

  render() {
    return (
      <div className="CreateAccount">
        <h3> First Name </h3>
        <Input
          placeholder="(max 100 characters)"
          maxLength={100}
          onChange={e => this.onChange(e.target.value, "firstName")}
        />
        <div style={{ margin: "12px 0" }} />

        <h3> Last Name </h3>
        <Input
          placeholder="(max 100 characters)"
          maxLength={100}
          onChange={e => this.onChange(e.target.value, "lastName")}
        />
        <div style={{ margin: "12px 0" }} />

        <h3> Email </h3>
        <Input
          placeholder="(max 100 characters)"
          maxLength={100}
          onChange={e => this.onChange(e.target.value, "email")}
        />
        <div style={{ margin: "12px 0" }} />

        <h3> Password </h3>
        <Input
          placeholder="(between 6-100 characters)"
          maxLength={100}
          type="password"
          onChange={e => this.onChange(e.target.value, "password")}
        />
        <div style={{ margin: "12px 0" }} />

        <h3> Repeat Password </h3>
        <Input
          placeholder="(between 6-100 characters)"
          maxLength={100}
          type="password"
          onChange={e => this.onChange(e.target.value, "passwordRepeated")}
        />
        <div style={{ margin: "12px 0" }} />

        <h3> Location </h3>
        <DropdownSelection
          promptText="Select Location"
          selectedValue={this.state.location}
          dropdownValues={locations}
          onClickField={val => this.onChange(val, "location")}
        />
        <div style={{ margin: "12px 0" }} />

        <h3> Role </h3>
        <DropdownSelection
          promptText="Select Role"
          selectedValue={this.state.role}
          dropdownValues={roles}
          onClickField={val => this.onChange(val, "role")}
        />
        <div style={{ margin: "12px 0" }} />

        <Link to="/">
          <Button> Cancel </Button>
        </Link>
        <Button type="primary" onClick={() => this.onClickSubmit()}>
          {" "}
          Submit{" "}
        </Button>
      </div>
    );
  }
}
