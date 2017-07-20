import { Checkbox, Button } from "antd";
import React, { Component } from "react";

/* PROPS:

checklistValues= [String] The value that are displayed to be checked
defaultCheckedValues = [Strings] the values that are checked by default

*/

/* STATE

checkedItems = [Strings] represents the currently checked items
indeterminate= Boolean used for the checkAll logic
checkAll = Boolean also for checkAll logic

*/

const CheckboxGroup = Checkbox.Group;

export default class Checklist extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      checkedItems: this.props.defaultCheckedValues,
      indeterminate: true,
      checkAll: false
    };
  }

  onChange = checkedList => {
    this.setState({
      ...this.state,
      checkedItems: checkedList,
      indeterminate:
        !!checkedList.length &&
        checkedList.length < this.props.checklistValues.length,
      checkAll: checkedList.length === this.props.checklistValues.length
    });
  };

  onCheckAllChange = e => {
    this.setState({
      checkedItems: e.target.checked ? this.props.checklistValues : [],
      indeterminate: false,
      checkAll: e.target.checked
    });
  };

  render() {
    return (
      <div>
        <div style={{}}>
          <Checkbox
            indeterminate={this.state.indeterminate}
            onChange={this.onCheckAllChange}
            checked={this.state.checkAll}
          >
            Check all
          </Checkbox>
        </div>
        <br />
        <CheckboxGroup
          options={this.props.checklistValues}
          value={this.state.checkedItems}
          onChange={this.onChange}
        />
      </div>
    );
  }
}
