import React, { Component } from "react";
import { Collapse, Button } from "antd";
const Panel = Collapse.Panel;
/* PROPS:
    listInfo: [obj]; array of list objects to be rendered with the following fields:
      title: string
      description: string
*/
/* STATE:
    None!
*/
export default class CollapseableList extends Component {
  callback(key) {
    console.log(key);
  }
  render() {
    let panels = this.props.listInfo.map((list, index) => {
      let header = list.title;
      return (
        <Panel header={header} key={index}>
          <p>
            {" "}{list.description}{" "}
          </p>
          <Button> Edit </Button>
          <Button> Ad Hoc </Button>
        </Panel>
      );
    });
    return (
      <Collapse defaultActiveKey={["1"]} onChange={key => this.callback(key)}>
        {panels}
      </Collapse>
    );
  }
}
