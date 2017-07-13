import { Checkbox, Button } from 'antd';
import React, { Component } from 'react';

const CheckboxGroup = Checkbox.Group;

const plainOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const defaultCheckedList = ['Apple', 'Orange'];

class Check extends React.Component {
  state = {
    checkedList: defaultCheckedList,
    indeterminate: true,
    checkAll: false,
  };
  render() {
    return (
      <div>
        <div style={{ borderBottom: '2px solid #E9E9E9' }}>
          <Checkbox
            indeterminate={this.state.indeterminate}
            onChange={this.onCheckAllChange}
            checked={this.state.checkAll}
          >
            Check all
          </Checkbox>
        </div>
        <br />
        <CheckboxGroup options={plainOptions} value={this.state.checkedList} onChange={this.onChange} />
      </div>
    );
  }
  onChange = (checkedList) => {
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && (checkedList.length < plainOptions.length),
      checkAll: checkedList.length === plainOptions.length,
    });
  }
  onCheckAllChange = (e) => {
    this.setState({
      checkedList: e.target.checked ? plainOptions : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  }
}


export default Check;