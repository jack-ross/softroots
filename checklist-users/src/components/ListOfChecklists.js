import React, { Component } from "react";
import { Collapse } from "antd";
import ViewSingleChecklist from "./ViewSingleChecklist.js";

/* PROPS:
    checklists: [obj], the checklist objects pulled from firebase to render
    firebasePath: string, the path where these checklists are coming from in
      the form "/dailyLists/<YYYY-MM-DD>/<location>/<role>"
*/

export default class ListOfChecklists extends Component {
  render() {
    const checklistArray = Object.keys(this.props.checklists).map(key => {
      return this.props.checklists[key];
    });

    const renderedChecklists = checklistArray.map(checklist => {
      return (
        <Collapse.Panel header={checklist.title}>
          <ViewSingleChecklist
            checklist={checklist}
            firebasePath={this.props.firebasePath}
          />
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
