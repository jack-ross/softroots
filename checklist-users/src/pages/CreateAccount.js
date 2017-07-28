import React, { Component } from "react";
import DropdownSelection from "../components/DropdownSelection.js";
import { Input, Button } from "antd";
import createAccountValidation from "../validation/createAccountValidation.js";
import { Link } from "react-router-dom";
import "../css/CreateAccount.css";

// arrays for the dropdowns when creating an account
const locations = ["Charlottesville", "Newark"];
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
    createAccountValidation(this.state);
  }

  render() {
    console.log(this.state);
    return (
      <div className="CreateAccount">
        <h3> First Name </h3>
        <Input onChange={e => this.onChange(e.target.value, "firstName")} />
        <div style={{ margin: "12px 0" }} />

        <h3> Last Name </h3>
        <Input onChange={e => this.onChange(e.target.value, "lastName")} />
        <div style={{ margin: "12px 0" }} />

        <h3> Email </h3>
        <Input onChange={e => this.onChange(e.target.value, "email")} />
        <div style={{ margin: "12px 0" }} />

        <h3> Password </h3>
        <Input
          type="password"
          onChange={e => this.onChange(e.target.value, "password")}
        />
        <div style={{ margin: "12px 0" }} />

        <h3> Repeat Password </h3>
        <Input
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

        <h3> Roles </h3>
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
          {" "}Submit{" "}
        </Button>
      </div>
    );
  }
}
