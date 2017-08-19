import React, { Component } from "react";
import { Table, Modal, Button } from "antd";
import ChangePrivilegeDropdown from "./ChangePrivilegeDropdown.js";

/* PROPS
    roles: [string], the roles that can be seen
    locations: [locations], the locations that can be seen
    loggedInUserUID: string, the logged-in user's id to filter them out
    firebaseUsers: object, the users pulled from /users/verified in firebase
*/

export default class ChangePrivilegeTable extends Component {
  render() {
    // if there was no data passed in, render None
    if (!this.props.firebaseUsers) {
      return <p> None </p>;
    }

    // take the firebaseUsers, make an array, and filter out users based
    // on location and role privileges of the logged-in user
    let usersArray = [];
    Object.keys(this.props.firebaseUsers).map(key => {
      let userObj = this.props.firebaseUsers[key];
      if (
        this.props.roles.includes(userObj.role) &&
        this.props.locations.includes(userObj.location) &&
        this.props.loggedInUserUID !== userObj.uid
      ) {
        userObj.key = userObj.uid;
        usersArray.push(userObj);
      }
    });

    // create the columns for the table
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
      },
      {
        title: "Change Role",
        dataIndex: "changeRole",
        key: "changeRole",
        render: (text, record) =>
          <ChangePrivilegeDropdown user={record} roles={this.props.roles} />
      }
    ];

    // if no users met that criteria, just render None
    if (usersArray.length === 0) {
      return <p> None </p>;
    }

    return (
      <div>
        <Table dataSource={usersArray} columns={columns} />
      </div>
    );
  }
}
