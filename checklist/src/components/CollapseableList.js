import React, { Component } from "react";
import { Collapse, Button } from "antd";
const Panel = Collapse.Panel;
/* PROPS:
    listInfo: [obj]; array of list objects to be rendered with the following fields:
      title: string; title of entire Checklist (i.e. "Closing List")
      description: string; a more detailed description
      subsections: [obj] where each object has the following fields
        title: string; name of the subsection (i.e. "Back of the Store")
        subtasks: [string]; the different tasks for that subsection (i.e. "Mop the back")
*/

/* STATE:
    None!
*/

export default class CollapseableList extends Component {
  callback(key) {
    console.log(key);
  }

  render() {
    //prework
    let panels = this.props.listInfo.map((list, index) => {
      let subsectionRender = list.subsections.map(subsection => {
        let subtaskArray = subsection.subtasks.map(subtask => {
          // return statements
          return (
            <p>
              {" "}{subtask}{" "}
            </p>
          );
        });

        return (
          <div>
            <h3>
              {" "}{subsection.title}{" "}
            </h3>
            {subtaskArray}
          </div>
        );
      });

      return (
        <Panel header={list.title} key={index}>
          <h2> Description </h2>
          <p>
            {" "}{list.description}{" "}
          </p>
          {subsectionRender}
          <Button> Edit </Button>
          <Button> Ad Hoc </Button>
        </Panel>
      );
    });
    return (
      <Collapse defaultActiveKey={["0"]} onChange={key => this.callback(key)}>
        {panels}
      </Collapse>
    );
  }
}
