import React, { Component } from "react";
import { Collapse } from "antd";
import ViewSingleChecklist from "./ViewSingleChecklist.js";

/* PROPS:
    checklists: [obj], the checklist objects pulled from firebase to render
*/

export default class ListOfChecklists extends Component {
  render() {
    const renderedChecklists = this.props.checklists.map(checklist => {
      return (
        <Collapse.Panel header={checklist.title}>
          <ViewSingleChecklist checklist={checklist} />
        </Collapse.Panel>
      );
    });
    return (
      <Collapse accordion>
        {renderedChecklists}
      </Collapse>
    );
  }
}
