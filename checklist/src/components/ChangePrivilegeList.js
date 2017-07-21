import React, { Component } from "react";
import { Button } from "antd";
import ChangePrivilegeListItem from "./ChangePrivilegeListItem.js";
import firebase from "../configs/firebaseConfig";

/* PROPS:
    firebasePath: string; the url the data is being pulled from to display (i.e. /users)
    fieldsToDisplay: [obj]; array of objects representing the fields and their prompts, as such
      field: "name",
      visibleDescription: "User's Name:"
    arrayOfPrivileges: [string]; array of the possible strings "privilege" could be set to
      (i.e. ["intern", "admin"])
      IMPORTANT: this file makes the assumption the field we wish to edit is called "privilege"
*/

/* STATE:
    firebaseData: object; the data that is pulled from this.props.firebasePath; makes the fundamental
      assumption each object has a "uid" value corresponding to that object's key in Firebase
      EXAMPLE: {
                {
                  name: "mike",
                  birthday: "july 4",
                  key: "1234"
                },
                {
                  name: "kevin",
                  birthday: "oct 9",
                  key: "4321"
                }
              };
*/

class ChangePrivilegeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firebaseData: [],
      status: "Loading..."
    };
  }

  componentWillMount() {
    firebase.database().ref(this.props.firebasePath).on("value", snapshot => {
      if (!snapshot.val()) {
        this.setState({
          ...this.state,
          firebaseData: [],
          status: "No verified users found."
        });
        return;
      }

      let users = snapshot.val();
      let arrayOfUsers = Object.keys(users).map(userID => {
        return users[userID];
      });
      this.setState({
        firebaseData: arrayOfUsers,
        status: ""
      });
    });
  }

  onDelete(objectToDelete) {
    console.log("You called delete!!");
    /*
    firebase
      .database()
      .ref(this.props.firebasePath + "/" + objectToDelete.uid)
      .remove();
    */
  }

  onChangeField(newValue, objectToEdit) {
    console.log("You changed privilege to " + newValue);
    firebase
      .database()
      .ref(this.props.firebasePath + "/" + objectToEdit.uid + "/role")
      .set(newValue);
  }

  render() {
    // map through the firebase data and create the ListItems to be rendered
    const listObjects = this.state.firebaseData
      .sort((a, b) => {
        return a.location > b.location;
      })
      .map(dataObject => {
        return (
          <ChangePrivilegeListItem
            onDelete={() => this.onDelete(dataObject)}
            onSubmit={(value, obj) => this.onChangeField(value, obj)}
            fieldsToDisplay={this.props.fieldsToDisplay}
            databaseObject={dataObject}
            fieldToChange={"role"}
            possibleValues={this.props.arrayOfPrivileges}
          />
        );
      });

    // render those list objects
    return (
      <div>
        <p>
          {" "}{this.state.status}{" "}
        </p>
        {listObjects}
      </div>
    );
  }
}

export default ChangePrivilegeList;
