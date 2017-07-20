import React, { Component } from "react";
import { Menu, Dropdown, Button, Icon } from "antd";

/* PROPS:
    defaultText: string; what's initially displayed (i.e. "Change Privilege")
    dropdownValues: [string]; the values for the dropdown
    onClickField: function; what happens when one of the values is clicked on the dropdown
      (i.e. update the state of the parent class)
*/

/* STATE:
    valueToShow: string; defaults to this.props.defaultText, but changes when a value is selected
      from the dropdown
*/

export default class DropdownSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      valueToShow: this.props.defaultText
    };
  }

  onClickField(e) {
    // set the state so the new shown value is what was clicked on
    this.setState({
      ...this.state,
      valueToShow: e.key
    });
    // call the parent's function
    this.props.onClickField(e.key);
  }

  render() {
    // map through the possible values to create the dropbox (all AntDesign stuff)
    const dropboxItems = this.props.dropdownValues.map(value => {
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

    // render the button
    return (
      <Dropdown overlay={possibleValueMenu}>
        <Button>
          {this.state.valueToShow} <Icon type="down" />
        </Button>
      </Dropdown>
    );
  }
}
