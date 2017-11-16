import { Checkbox, Button } from "antd";
import React, { Component } from "react";
import "../css/ChecklistForm.css";
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
            checkAll: true
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

    onCheckAllChange = () => {
        if (this.state.checkAll) {
            this.props.onCheck(this.props.checklistValues);
        } else {
            this.props.onCheck([]);
        }
        this.setState({ checkAll: !this.state.checkAll });
    };

    render() {
        return (
            <div className="checkboxes">
                <Button
                    className="checklist-button"
                    onClick={this.onCheckAllChange}
                >
                    All
                </Button>
                <CheckboxGroup
                    options={this.props.checklistValues}
                    value={this.props.checkedValues}
                    onChange={this.onChange}
                />
            </div>
        );
    }
}
