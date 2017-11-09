import React, { Component } from "react";
import TopNavBar from "../components/TopNavBar.js";
import ApproveOrDenyUserList from "../components/ApproveOrDenyUserList.js";
import ChangePrivilegeList from "../components/ChangePrivilegeList.js";
import PleaseLogin from "../components/PleaseLogin.js";
import "../css/UserManagement.css";
import roleHierarchy from "../roles/roleHierarchy.js";
import ApproveOrDenyUserTable from "../components/ApproveOrDenyUserTable.js";
import ChangePrivilegeTable from "../components/ChangePrivilegeTable.js";
import firebase from "../configs/firebaseConfig.js";

const tabs = [
  {
    name: "Home",
    url: "/home"
  },
  {
    name: "Create",
    url: "/createchecklist"
  },
  {
    name: "View",
    url: "/viewchecklists"
  },
  {
    name: "Manage",
    url: "/users"
  }
];

const fields = [
  {
    field: "firstName",
    visibleDescription: "First Name"
  },
  {
    field: "lastName",
    visibleDescription: "Last Name"
  },
  {
    field: "email",
    visibleDescription: "Email Address"
  },
  {
    field: "role",
    visibleDescription: "Role"
  },
  {
    field: "location",
    visibleDescription: "Location"
  }
];

export default class UserManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firebaseUsers: undefined
    };
  }

  componentWillMount() {
    firebase
      .database()
      .ref("/users")
      .on("value", snapshot => {
        // if snapshot exists, store in the state
        if (snapshot.val()) {
          this.setState({
            ...this.state,
            firebaseUsers: snapshot.val()
          });
        }
      });
  }

  render() {
    if (!this.props.userInfo) {
      return <PleaseLogin />;
    }

    const roles = roleHierarchy[this.props.userInfo.role];
    let locations = ["Charlottesville, VA", "Newark, DE"];
    if (this.props.userInfo.role !== "Admin") {
      locations = [this.props.userInfo.location];
    }

    return (
      <div>
        <TopNavBar className="horizontal" tabs={tabs} currentURL="/users" />
        <div className="userManagement">
          <h1> Waiting Approval </h1>
          <div style={{ margin: "6px" }} />

          {!this.state.firebaseUsers && <p> Loading... </p>}

          {this.state.firebaseUsers && (
            <div className="approveDenyTable">
              <ApproveOrDenyUserTable
                firebaseUsers={this.state.firebaseUsers.unverified}
                roles={roles}
                locations={locations}
              />
            </div>
          )}
          <div style={{ margin: "12px" }} />

          <h1> Approved </h1>
          <div style={{ margin: "6px" }} />

          {!this.state.firebaseUsers && <p> Loading... </p>}

          {this.state.firebaseUsers && (
            <ChangePrivilegeTable
              firebaseUsers={this.state.firebaseUsers.verified}
              roles={roles}
              locations={locations}
              loggedInUserUID={this.props.userInfo.uid}
            />
          )}
        </div>
      </div>
    );
  }
}
