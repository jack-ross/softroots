import React, { Component } from "react";
import { Collapse, Button, Modal } from "antd";
import "../css/CollapseableList.css";
const Panel = Collapse.Panel;
/* PROPS:
    listInfo: [obj]; array of list objects to be rendered with the following fields:
      title: string; title of entire Checklist (i.e. "Closing List")
      description: string; a more detailed description
      subsections: [obj] where each object has the following fields
        title: string; name of the subsection (i.e. "Back of the Store")
        subtasks: [string]; the different tasks for that subsection (i.e. "Mop the back")
    onClickEdit: function; called when Edit button is clicked
    onClickDelete: function; called when Delete button is clicked
    canEditDelete: boolean; info about the logged-in user; used to determine whether or not they have
      access to the edit/delete buttons
*/

/* STATE:
    None!
*/

export default class CollapseableList extends Component {
  displayLongDescriptionModal(subtask) {
    Modal.info({
      title: subtask.shortDescription,
      content: subtask.longDescription,
      onOk: () => {},
      okText: "Close"
    });
  }

  render() {
    //prework
    let panels = this.props.listInfo.map((list, index) => {
      // create the strings and <p>'s with the repeat times
      let endTimes = list.endTimes.map(endTime => {
        let endTimeString =
          endTime.hours + ":" + endTime.minutes + " " + endTime.amPm;
        return (
          <p>
            {" "}{endTimeString}{" "}
          </p>
        );
      });

      // create the <p>'s with the days to repeat
      let daysToRepeatString = "";
      let daysToRepeat = list.daysToRepeat.map(day => {
        daysToRepeatString += day;
        daysToRepeatString += ", ";
      });
      // splice off the last ", "
      daysToRepeatString = daysToRepeatString.substring(
        0,
        daysToRepeatString.length - 2
      );

      // create how each subsection gets rendered
      let subsectionRender = list.subsections.map(subsection => {
        let subtaskArray = subsection.subtasks.map(subtask => {
          // return statements
          return (
            <p
              onClick={() => this.displayLongDescriptionModal(subtask)}
              style={{ cursor: "pointer" }}
            >
              {" "}{subtask.shortDescription}{" "}
            </p>
          );
        });

        return (
          <div>
            <h3>
              {" "}{subsection.title}{" "}
            </h3>
            {subtaskArray}
            <div style={{ margin: "10px 0" }} />
          </div>
        );
      });

      return (
        <Panel header={list.title} key={index}>
          <h1 style={{ fontSize: "20px" }}> Description </h1>
          <p>
            {" "}{list.description}{" "}
          </p>
          <div style={{ margin: "30px 0" }} />

          <h1 style={{ fontSize: "20px" }}> Subsections </h1>
          {subsectionRender}
          <div style={{ margin: "30px 0" }} />

          <h1 style={{ fontSize: "20px" }}> Days to Repeat </h1>
          <p>
            {" "}{daysToRepeatString}{" "}
          </p>
          <div style={{ margin: "30px 0" }} />

          <h1 style={{ fontSize: "20px" }}> End Time(s) </h1>
          {endTimes}
          <div style={{ margin: "15px 0" }} />

          <div className="buttonCenter" style={{ textAlign: "center" }}>
            {this.props.canEditDelete &&
              <Button
                type="primary"
                style={{ marginRight: "10px" }}
                icon="edit"
                onClick={() => this.props.onClickEdit(list)}
              >
                {" "}Edit{" "}
              </Button>}

            <Button style={{ marginRight: "10px" }}> Ad Hoc </Button>

            {this.props.canEditDelete &&
              <Button
                style={{ marginRight: "10px" }}
                type="danger"
                icon="close-circle-o"
                onClick={() => this.props.onClickDelete(list)}
              >
                {" "}Delete{" "}
              </Button>}
          </div>
        </Panel>
      );
    });
    return (
      <Collapse>
        {panels}
      </Collapse>
    );
  }
}
