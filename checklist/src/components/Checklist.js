import { Checkbox } from "antd";
import React, { Component } from "react";

/* PROPS:

checklistValues= [String] The value that are displayed to be checked
checkedValues = [Strings] the values that are checked by default
onCheck = function; called to update parent component when an item is checked

*/

/* STATE

indeterminate= Boolean used for the checkAll logic
checkAll = Boolean also for checkAll logic

*/

const CheckboxGroup = Checkbox.Group;

export default class Checklist extends Component {
  constructor(props) {
    super(props);

    this.state = {
      indeterminate: true,
      checkAll: false
    };
  }

  onChange = checkedList => {
    this.setState({
      ...this.state,
      indeterminate:
        !!checkedList.length &&
        checkedList.length < this.props.checklistValues.length,
      checkAll: checkedList.length === this.props.checklistValues.length
    });
    this.props.onCheck(checkedList);
  };

  onCheckAllChange = e => {
    let checkedItems = [];
    if (e.target.checked) {
      checkedItems = this.props.checklistValues;
    }
    this.setState({
      indeterminate: false,
      checkAll: e.target.checked
    });
    this.props.onCheck(checkedItems);
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
          value={this.props.checkedValues}
          onChange={this.onChange}
        />
      </div>
    );
  }
}
