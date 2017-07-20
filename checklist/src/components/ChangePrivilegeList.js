import React, { Component } from "react";
import { Button } from "antd";
import ChangePrivilegeListItem from "./ChangePrivilegeListItem.js";

/* PROPS:
    firebasePath: string; the url the data is being pulled from to display (i.e. /users)
    fieldsToDisplay: [string]; array of the fields to be displayed (i.e. ["name", "privilege"])
    arrayOfPrivileges: [string]; array of the possible strings "privilege" could be set to
      (i.e. ["intern", "admin"])
      IMPORTANT: this file makes the assumption the field we wish to edit is called "privilege"
*/

/* STATE:
    firebaseData: object; the data that is pulled from this.props.firebasePath; makes the fundamental
      assumption each object has a "key" value corresponding to that object's key in Firebase
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

const testData = [
  {
    name: "Mike",
    birthday: "july 4",
    privilege: "grill"
  },
  {
    name: "Kevin",
    birthday: "oct 9",
    privilege: "admin"
  }
];

class ChangePrivilegeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firebaseData: testData
    };
  }

  componentWillMount() {
    /*
    database.ref(this.props.firebasePath).on("value", snapshot => {
      if (snapshot.val() === null) {
        this.setState({
          ...this.state
        });
      } else {
        this.setState({
          firebaseData: snapshot.val()
        });
      }
    });
    */
  }

  onDelete(objectToDelete) {
    console.log("You called delete!!");
    // database.ref(this.props.firebasePath + "/" + objectToDelete.key).remove();
  }

  onChangeField(newValue, objectToEdit) {
    console.log("You changed privilege to " + newValue);
    /*
    database
      .ref(this.props.firebasePath + "/" + objectToEdit.key + "/privilege")
      .set(newValue);
    */
  }

  render() {
    // if the firebase data hasn't loaded/is null, just render "Nothing to display"
    if (Object.keys(this.state.firebaseData).length === 0) {
      return <p> Nothing to display </p>;
    }

    // otherwise, create the list objects to be rendered (prints the field names, the field values, the
    // dropdown box of potential privileges, the save privilege button, and the delete button
    let constListObjects = Object.keys(this.state.firebaseData).map(key => {
      return this.state.firebaseData[key];
    });
    const listObjects = constListObjects
      .sort((a, b) => {
        return a.name > b.name;
      })
      .map(dataObject => {
        return (
          <ChangePrivilegeListItem
            onDelete={() => this.onDelete(dataObject)}
            onSubmit={(value, obj) => this.onChangeField(value, obj)}
            fieldsToDisplay={this.props.fieldsToDisplay}
            databaseObject={dataObject}
            fieldToChange={"privilege"}
            possibleValues={this.props.arrayOfPrivileges}
          />
        );
      });

    // render those list objects
    return (
      <div>
        {listObjects}
      </div>
    );
  }
}

export default ChangePrivilegeList;
