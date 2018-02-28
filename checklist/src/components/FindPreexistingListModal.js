import React, { Component } from "react";
import { Modal, Button, Radio, notification } from "antd";
import DropdownSelection from "./DropdownSelection.js";

/* PROPS
    checklists: object, the data pulled from "/checklists/" on firebase
    locations: [string], the possible locations to search for
    roles: [string], the possible roles to search for
    onClickSelect: function(checklist); what to do with the checklist that's been
      selected
    onCancel: function that's called when cancel button is called
    isVisible: boolean; determines whether or not the Modal is visible

*/

/* STATE
    isSearchClicked: boolean; determines whether or not to render the Dropdown with the
      search results
    selectedRole: string, the role that's been selected to filter by
    selectedLocation: string, the location that's been selected to filter by
    selectedChecklist: obj; the checklist that's been selected from the search results
*/

export default class FindPreexistingListModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSearchClicked: false,
      selectedLocation: "",
      selectedRole: "",
      selectedChecklist: undefined
    };
  }

  onChange(field, value) {
    this.setState({
      ...this.state,
      [field]: value
    });
  }

  onClickSelect() {
    // make sure they've chosen a checklist
    if (!this.state.selectedChecklist) {
      notification.error({
        message: "ERROR",
        description: "Please select a checklist."
      });
      return;
    }

    // if so, update the parent state and close the Modal
    let checklist = this.state.selectedChecklist;
    delete checklist.key;
    this.props.onClickSelect(checklist);
  }

  render() {
    // styling for the radio buttons
    const radioStyle = {
      display: "block",
      height: "30px",
      lineHeight: "30px"
    };
    
    // render the checklist radio buttons based on the selected role and location
    let radioButtons = [];
    if (this.state.isSearchClicked) {
      let location = this.state.selectedLocation;
      let role = this.state.selectedRole;

      // check if any checklists exist at location, then check at role
      // (first check necessary in case no checklists at that location,
      // causes second check to look for undefined[role] )
      if (
        !this.props.checklists[location] ||
        !this.props.checklists[location][role]
      ) {
        radioButtons = <p> No such checklists exist. </p>;
      } else {
        Object.keys(this.props.checklists[location][role]).map(key => {
          let checklist = this.props.checklists[location][role][key];
          let radioButton = (
            <Radio style={radioStyle} value={checklist}>
              {" "}{checklist.title}{" "}
            </Radio>
          );
          radioButtons.push(radioButton);
        });
      }
    }

    return (
      <Modal
        visible={this.props.isVisible}
        okText="Select Checklist"
        cancelText="Cancel"
        onOk={() => this.onClickSelect()}
        onCancel={() => this.props.onCancel()}
      >
        <p> Select a location and a role to filter by. </p>
        <DropdownSelection
          promptText="Choose location."
          selectedValue={this.state.selectedLocation}
          dropdownValues={this.props.locations}
          onClickField={location => this.onChange("selectedLocation", location)}
        />
        {this.state.selectedLocation !== "" && 
          <div>
          <DropdownSelection
            promptText="Choose role."
            selectedValue={this.state.selectedRole}
            dropdownValues={Object.keys(this.props.roles[this.state.selectedLocation])}
            onClickField={role => this.onChange("selectedRole", role)}
          />
          <Button
            icon="search"
            onClick={() => this.onChange("isSearchClicked", true)}
          >
            {" "}Search{" "}
          </Button>
          </div>
        }

        <div>
          <Radio.Group
            onChange={e => this.onChange("selectedChecklist", e.target.value)}
          >
            {radioButtons}
          </Radio.Group>
        </div>
      </Modal>
    );
  }
}
