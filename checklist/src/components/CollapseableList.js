import React, { Component } from "react";
import { Collapse, Button } from "antd";
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
*/

/* STATE:
    None!
*/

export default class CollapseableList extends Component {
  render() {
    //prework
    let panels = this.props.listInfo.map((list, index) => {
      let subsectionRender = list.subsections.map(subsection => {
        let subtaskArray = subsection.subtasks.map(subtask => {
          // return statements
          return (
            <p>
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
            <div style={{ margin: "15px 0" }} />
          </div>
        );
      });

      return (
        <Panel header={list.title} key={index}>
          <h2> Description </h2>
          <p>
            {" "}{list.description}{" "}
          </p>
          <div style={{ margin: "20px 0" }} />
          {subsectionRender}
          <Button onClick={() => this.props.onClickEdit(list)}> Edit </Button>
          <Button> Ad Hoc </Button>
          <Button
            type="danger"
            icon="close-circle-o"
            onClick={() => this.props.onClickDelete(list)}
          >
            {" "}Delete{" "}
          </Button>
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
