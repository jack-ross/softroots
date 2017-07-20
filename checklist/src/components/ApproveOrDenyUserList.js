import React, { Component } from "react";
import ApproveOrDenyUserListItem from "./ApproveOrDenyUserListItem.js";
import firebase from "../configs/firebaseConfig.js";

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
    visibleDescription: "First Name",
    field: "firstName"
  },
  {
    visibleDescription: "Last Name",
    field: "lastName"
  },
  {
    visibleDescription: "Email Address",
    field: "email"
  },
  {
    visibleDescription: "Role:",
    field: "role"
  },
  {
    visibleDescription: "Location",
    field: "location"
  }
];

export default class ApproveOrDenyUserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      status: "Loading..."
    };
  }

  componentWillMount() {
    let usersListener = firebase.database().ref("users/unverified");
    usersListener.on("value", snapshot => {
      let userInfo = snapshot.val();
      if (!snapshot.val()) {
        // TODO display message that no users are unverified in the system
        this.setState({
          ...this.state,
          status: "No unverified users found."
        });
        return;
      }
      let arrayOfUsers = [];
      Object.keys(userInfo).map(userID => {
        arrayOfUsers.push(userInfo[userID]);
      });
      this.setState({
        users: arrayOfUsers,
        status: ""
      });
    });
  }

  onApprove(user) {
    firebase.database().ref("/users/unverified/" + user.uid).remove();
    firebase.database().ref("/users/verified/" + user.uid).set(user);
  }

  onDeny(user) {
    console.log(user);
  }

  render() {
    let listItems = this.state.users.map(user => {
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
        <p>
          {" "}{this.state.status}{" "}
        </p>
        {listItems}
      </div>
    );
  }
}
