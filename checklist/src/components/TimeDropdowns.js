import React, { Component } from "react";
import { Button } from "antd";
import DropdownSelection from "./DropdownSelection.js";

/* PROPS
    timeData: [obj]; array of objects, each of which rep's a time with following fields:
      hours: int (1-12);
      minutes: int (0, 15, 30, 45)
      amPm: string (either "AM" or "PM")
    onChange: function, used to update the state of the parent component
*/

export default class TimeDropdowns extends Component {
  updateField(index, field, value) {
    let data = this.props.timeData;
    data[index][field] = value;
    this.props.onChange(data);
  }

  addTime() {
    let blankTime = {
      hours: "",
      minutes: "",
      amPm: ""
    };
    let data = this.props.timeData;
    data.push(blankTime);
    this.props.onChange(data);
  }

  removeTime(index) {
    let data = this.props.timeData;
    data.splice(index, 1);
    this.props.onChange(data);
  }

  render() {
    let dropdowns = this.props.timeData.map((timeObj, index) => {
      return (
        <div>
          <DropdownSelection
            promptText="Select Hours"
            selectedValue={timeObj.hours}
            dropdownValues={[
              "1",
              "2",
              "3",
              "4",
              "5",
              "6",
              "7",
              "8",
              "9",
              "10",
              "11",
              "12"
            ]}
            onClickField={val => this.updateField(index, "hours", val)}
          />
          <DropdownSelection
            promptText="Select Minutes"
            selectedValue={timeObj.minutes}
            dropdownValues={["0", "15", "30", "45"]}
            onClickField={val => this.updateField(index, "minutes", val)}
          />
          <DropdownSelection
            promptText="Select AM/PM"
            selectedValue={timeObj.amPm}
            dropdownValues={["AM", "PM"]}
            onClickField={val => this.updateField(index, "amPm", val)}
          />
          <Button onClick={() => this.removeTime(index)}> Remove </Button>
        </div>
      );
    });

    return (
      <div>
        {dropdowns}
        <Button onClick={() => this.addTime()}> Add Time </Button>
      </div>
    );
  }
}
