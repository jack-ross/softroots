import React, { Component } from "react";
import ApproveOrDenyUserListItem from "./ApproveOrDenyUserListItem.js";

const testData = [
  {
    name: "Mike",
    email: "mdc8wa@virginia.edu",
    role: "grill"
  },
  {
    name: "Stephen",
    email: "steve@love.com",
    role: "gm"
  }
];

const fieldInfo = [
  {
    visibleDescription: "Name",
    field: "name"
  },
  {
    visibleDescription: "Email Address",
    field: "email"
  },
  {
    visibleDescription: "Role:",
    field: "role"
  }
];

export default class ApproveOrDenyUserList extends Component {
  onApprove(user) {
    console.log(user);
  }

  onDeny(user) {
    console.log(user);
  }

  render() {
    let listItems = testData.map(user => {
      return (
        <div key={user.name}>
          <ApproveOrDenyUserListItem
            fields={fieldInfo}
            userInfo={user}
            onApprove={user => this.onApprove(user)}
            onDeny={user => this.onDeny(user)}
          />
        </div>
      );
    });
    return (
      <div>
        {listItems}
      </div>
    );
  }
}
