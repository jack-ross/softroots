import React, { Component } from "react";
import ApproveOrDenyUserListItem from "./ApproveOrDenyUserListItem.js";
import firebase from "../configs/firebaseConfig.js";
import roleHierarchy from "../roles/roleHierarchy.js";

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
    visibleDescription: "Role",
    field: "role"
  },
  {
    visibleDescription: "Location",
    field: "location"
  }
];

/* PROPS
    userInfo: obj; the userInfo that's passed down from firebase; used to determine
      position in role hierarchy and display users accordingly
*/

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
      let usersInfo = snapshot.val();
      if (!snapshot.val()) {
        this.setState({
          ...this.state,
          users: [],
          status: "No unverified users found."
        });
        return;
      }
      let arrayOfUsers = [];
      Object.keys(usersInfo).map(userID => {
        arrayOfUsers.push(usersInfo[userID]);
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
    // TODO delete from firebase auth
  }

  render() {
    // use role hierarchy & logged-in user to determine which users to display
    let rolesUserCanSee = roleHierarchy[this.props.userInfo.role];

    let listItems = this.state.users.map(user => {
      // only return users whose roles are in rolesUserCanSee
      if (!rolesUserCanSee.includes(user.role)) {
        return <div />;
      }

      // if user is not an admin, only return users in logged-in user's location
      if (this.props.userInfo.role !== "Admin") {
        if (user.location !== this.props.userInfo.location) {
          return <div />;
        }
      }

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
