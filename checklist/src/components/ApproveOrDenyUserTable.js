import React, { Component } from "react";
import { Table, Button, Modal, notification } from "antd";
import firebase from "../configs/firebaseConfig.js";

/* PROPS
    roles: [string], which roles may be displayed
    locations: [string], which locations may be displayed
    firebaseUsers: object, the objects pulled from /users/unverified
*/

const columns = [
  {
    title: "First Name",
    dataIndex: "firstName",
    key: "firstName",
    sorter: (a, b) => {
      return a.firstName.localeCompare(b.firstName);
    }
  },
  {
    title: "Last Name",
    dataIndex: "lastName",
    key: "lastName",
    sorter: (a, b) => {
      return a.lastName.localeCompare(b.lastName);
    }
  },
  {
    title: "Email Address",
    dataIndex: "email",
    key: "email",
    sorter: (a, b) => {
      return a.email.localeCompare(b.email);
    }
  },
  {
    title: "Location",
    dataIndex: "location",
    key: "location",
    sorter: (a, b) => {
      return a.location.localeCompare(b.location);
    }
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
    sorter: (a, b) => {
      return a.role.localeCompare(b.role);
    }
  }
];

export default class ApproveOrDenyUserTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: []
    };
  }

  onClickApproveUsers() {
    if (this.state.selectedRowKeys.length === 0) {
      notification.error({
        message: "ERROR",
        description: "No users were selected.",
        duration: 2
      });
    } else {
      Modal.confirm({
        title: "Approve Users?",
        content: "Make sure they're valid employees!",
        okText: "Approve Users",
        cancelText: "Cancel",
        onOk: () => this.approveUsers(),
        onCancel: () => {}
      });
    }
  }

  approveUsers() {
    // create the necessary updates for firebase
    let userKeys = this.state.selectedRowKeys;
    let firebaseUpdates = {};
    userKeys.map(userKey => {
      let firebaseVerifiedPath = "/users/verified/" + userKey;
      let firebaseUnverifiedPath = "/users/unverified/" + userKey;
      // make a copy of the user and remove the "key" field
      let userCopy = Object.assign({}, this.props.firebaseUsers[userKey]);
      delete userCopy.key;
      firebaseUpdates[firebaseVerifiedPath] = userCopy;
      firebaseUpdates[firebaseUnverifiedPath] = null;
    });

    // make the firebase call
    firebase
      .database()
      .ref()
      .update(firebaseUpdates)
      .then(response => {
        // let the user know it was successful
        notification.success({
          message: "SUCCESS",
          description: "User(s) approved."
        });
        // clear the selected user keys from the state
        this.setState({
          ...this.state,
          selectedRowKeys: []
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
    // render a loading screen if the firebase data has not been loaded in yet
    if (!this.props.firebaseUsers) {
      return <p> None </p>;
    }

    // otherwise, take the firebase users, make an array out of them, and
    // render them in a table
    let usersArray = [];
    Object.keys(this.props.firebaseUsers).map(key => {
      let userObj = this.props.firebaseUsers[key];
      // only show users from the role hiearchy and approved locations
      if (
        this.props.roles.includes(userObj.role) &&
        this.props.locations.includes(userObj.location)
      ) {
        userObj.key = userObj.uid;
        usersArray.push(userObj);
      }
    });

    // if there were no users the logged-in user has access to, render None
    if (usersArray.length === 0) {
      return <p> None </p>;
    }

    // rowSelection object indicates the need for row selection
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          ...this.state,
          selectedRowKeys: selectedRowKeys
        });
      }
    };

    return (
      <div>
        <Table
          columns={columns}
          dataSource={usersArray}
          rowSelection={rowSelection}
          pagination={false}
        />
        <div style={{ margin: "12px" }} />

        <Button
          onClick={() => this.onClickApproveUsers()}
          icon="check-circle-o"
          type="primary"
        >
          {" "}Approve Selected Users{" "}
        </Button>
        <div style={{ margin: "24px" }} />
      </div>
    );
  }
}
