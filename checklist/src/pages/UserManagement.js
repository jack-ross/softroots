import React, { Component } from "react";
import moment from "moment";
import queryString from "query-string";
import TopNavBar from "../components/TopNavBar.js";
import ApproveOrDenyUserList from "../components/ApproveOrDenyUserList.js";
import ChangePrivilegeList from "../components/ChangePrivilegeList.js";
import PleaseLogin from "../components/PleaseLogin.js";
import "../css/UserManagement.css";
import roleHierarchy from "../roles/roleHierarchy.js";
import ApproveOrDenyUserTable from "../components/ApproveOrDenyUserTable.js";
import ChangePrivilegeTable from "../components/ChangePrivilegeTable.js";
import firebase from "../configs/firebaseConfig.js";
import { storeLocations } from "../locations.js";
import roles from "../roles/roles.js";

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
      firebaseUsers: undefined,
      checklists: []
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
            firebaseUsers: snapshot.val()
          });
        }
      });

    firebase
      .database()
      .ref("/checklists")
      .on("value", snapshot => {
        if (snapshot.val()) {
          this.setState({
            checklists: snapshot.val()
          });
        } else {
          this.setState({
            ...this.state,
            checklists: []
          });
        }
      });

    this.setState({
      roles: roles
    });
  }

  render() {
    let { userInfo, onClickSignOut } = this.props;
    const { firebaseUsers, checklists } = this.state;
    if (process.env.NODE_ENV === "development") {
      userInfo = { role: "Admin" };
    }
    if (!userInfo && process.env.NODE_ENV !== "development") {
      return <PleaseLogin />;
    }

    const roles = roleHierarchy[userInfo.role];

    if (this.state.roles === undefined) return <p>Loading...</p>;
    let locations = storeLocations;

    if (userInfo.role !== "Admin") {
      return (
        <div>
          <TopNavBar className="horizontal" onClickSignOut={onClickSignOut} />
          <div className="userManagement">
            <h1> Must be an administrator to access </h1>
          </div>
        </div>
      );
    }

    return (
      <div>
        <TopNavBar className="horizontal" onClickSignOut={onClickSignOut} />
        <div className="userManagement">
          {firebaseUsers &&
            firebaseUsers.unverified && (
              <div>
                <h1> Waiting Approval </h1>
                <div style={{ margin: "6px" }} />
                <div className="approveDenyTable">
                  <ApproveOrDenyUserTable
                    firebaseUsers={firebaseUsers.unverified}
                    roles={roles}
                    locations={locations}
                  />
                </div>
                )
              </div>
            )}
          <div style={{ margin: "12px" }} />

          {firebaseUsers && firebaseUsers.unverified && <h1> Approved </h1>}
          <div style={{ margin: "6px" }} />

          {!firebaseUsers && <p> Loading... </p>}

          {firebaseUsers && (
            <ChangePrivilegeTable
              firebaseUsers={firebaseUsers.verified}
              checklists={checklists}
              roles={roles}
              locations={locations}
              loggedInUserUID={userInfo.uid}
            />
          )}
        </div>
      </div>
    );
  }
}
