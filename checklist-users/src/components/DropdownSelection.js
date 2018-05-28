import React, { Component } from "react";
import { Menu, Dropdown, Button, Icon } from "antd";

/* PROPS:
    promptText: string; what's initially displayed (i.e. "Change Privilege")
    selectedValue: string; the value that has been selected and is now displayed
    dropdownValues: [string]; the values for the dropdown
    onClickField: function; what happens when one of the values is clicked on the dropdown
      (i.e. update the state of the parent class)
*/

export default class DropdownSelection extends Component {
  onClickField(e) {
    this.props.onClickField(e.key);
  }

  render() {
    console.log(this.props);
    // map through the possible values to create the dropbox (all AntDesign stuff)
    const dropboxItems = this.props.dropdownValues.map(value => {
      return <Menu.Item key={value}>{value}</Menu.Item>;
    });

    // puts those values in a Menu container for AntDesign's Dropbox
    const possibleValueMenu = (
      <Menu onClick={e => this.onClickField(e)}>{dropboxItems}</Menu>
    );

    // render the button
    let valueToShow = this.props.promptText;
    if (this.props.selectedValue !== "") {
      valueToShow = this.props.selectedValue;
    }
    return (
      <Dropdown overlay={possibleValueMenu}>
        <Button>
          {valueToShow} <Icon type="down" />
        </Button>
      </Dropdown>
    );
  }
}
