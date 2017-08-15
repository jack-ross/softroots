import React, { Component } from "react";
import { Select, Button, Modal, notification } from "antd";
import updateUserRole from "../firebase/updateUserRole.js";

/* PROPS
    roles: [string], array of possible roles for the dropdown to display
    user: obj, the user object whose role will be changed in firebase
*/

export default class ChangePrivilegeDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newRole: undefined
    };
  }

  onChangeValue(value) {
    this.setState({
      ...this.state,
      newRole: value
    });
  }

  onClickButton() {
    let newRole = this.state.newRole;
    if (!newRole) {
      notification.error({
        message: "ERROR",
        description: "No role selected yet",
        duration: 2
      });
    } else {
      Modal.confirm({
        title: "Change Role?",
        content:
          "Do you want to change " +
          this.props.user.firstName +
          " to the " +
          newRole +
          " role?",
        okText: "Change Role",
        cancelText: "Cancel",
        onOk: () => updateUserRole(this.props.user.uid, newRole),
        onCancel: () => {}
      });
    }
  }

  render() {
    const roles = this.props.roles.map(role => {
      return (
        <Select.Option key={role} value={role}>
          {role}
        </Select.Option>
      );
    });
    return (
      <div>
        <Select
          onChange={val => this.onChangeValue(val)}
          style={{ width: "150px" }}
          placeholder="Select Privilege"
        >
          {roles}
        </Select>
        <Button onClick={() => this.onClickButton()}> Save </Button>
      </div>
    );
  }
}
