import React, { Component } from "react";
import { Menu, Dropdown, Icon, Button, Modal, Card } from "antd";

/* PROPS:
    onDelete: function to call when the delete button is clicked
    onSubmit: function to call when the submit button is clicked
    fieldsToDisplay: [obj]; array of objects representing the fields and their prompts, as such
      field: "name",
      visibleDescription: "User's Name:"
    databaseObject: object; the object pulled from Firebase by parent component
    fieldToChange: string; the field to be changed by Dropdown box (i.e. privilege)
    possibleValues: [string]; the array of possible values for above field to be displayed in the Dropdown box
*/

/* STATE:
    newValue: string; the string currently selected by the Dropdown box
*/

class ChangePrivilegeListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newValue: ""
    };
  }

  onClickField(e) {
    this.setState({
      ...this.state,
      newValue: e.key
    });
  }

  showConfirmChange(newValue) {
    Modal.confirm({
      title: "Do you want to save these changes?",
      content: "This can be undone at a later date.",
      okText: "Save Changes",
      cancelText: "Cancel",
      onOk: () => this.props.onSubmit(newValue, this.props.databaseObject),
      onCancel() {}
    });
  }

  showConfirmDelete() {
    Modal.confirm({
      title: "Do you want to delete this user?",
      content: "This CANNOT be undone.",
      okText: "Delete User",
      cancelText: "Cancel",
      onOk: () => this.props.onDelete(),
      onCancel() {}
    });
  }

  render() {
    // map through the fields and display them and their values
    const fieldsAndValues = this.props.fieldsToDisplay.map(fieldObj => {
      return (
        <div>
          <h3 className="userField">
            {" "}{fieldObj.visibleDescription}{" "}
          </h3>
          <p className="userObject">
            {" "}{this.props.databaseObject[fieldObj.field]}{" "}
          </p>
        </div>
      );
    });

    // map through the possible values to create the dropbox (all AntDesign stuff)
    const dropboxItems = this.props.possibleValues.map(value => {
      return (
        <Menu.Item key={value}>
          {value}
        </Menu.Item>
      );
    });

    // puts those values in a Menu container for AntDesign's Dropbox
    const possibleValueMenu = (
      <Menu onClick={e => this.onClickField(e)}>
        {dropboxItems}
      </Menu>
    );

    // the text to display in Dropdown box
    let dropdownTextToDisplay = "Change " + this.props.fieldToChange + ":";
    if (this.state.newValue !== "") {
      dropdownTextToDisplay = this.state.newValue;
    }

    // finally, render everything!
    return (
      <Card className="wholeUser">
        <div className="userProfile">
          {this.props.databaseObject.profilePic != null &&
            <div className="userPictureContainer">
              <img
                className="userPicture"
                src={this.props.databaseObject.profilePic}
                alt="userPicture"
              />
            </div>}
          <div className="userFieldContainer">
            {fieldsAndValues}
          </div>
          <div style={{ margin: "12px 0" }} />
        </div>

        <Dropdown overlay={possibleValueMenu}>
          <Button>
            {dropdownTextToDisplay} <Icon type="down" />
          </Button>
        </Dropdown>

        <Button onClick={() => this.showConfirmChange(this.state.newValue)}>
          Save Changes
        </Button>

        <Button
          type="danger"
          icon="close-circle-o"
          onClick={() => this.showConfirmDelete()}
        >
          Remove User
        </Button>
      </Card>
    );
  }
}

export default ChangePrivilegeListItem;
