import React from "react";
import { Checkbox, Tag, Table } from "antd";
/* {"daysToRepeat":["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
"description":"Making sure everything was fine with deployment",
"endTime":{"amPm":"AM","hours":"5","minutes":"00"},
"key":"-Kr8yEXndUF2QUvlx2Bw",
"locations":["Roots-Charlottesville"],
"role":"GM",
"subsections":[{"subtasks":[{"displayType":"checkbox","isCompleted":true,"longDescription":"Gotta keep testing","shortDescription":"Test 1"}, */

const columns = [
  {
    title: <div style={{ marginLeft: 24 }}>Description</div>,
    width: "35%",
    dataIndex: "description",
    key: "description"
  },
  {
    title: "",
    dataIndex: "progress",
    key: "progress",
    render: (progress, row) => {
      if (typeof progress === "boolean") {
        return (
          <div>
            <Checkbox checked={progress} />
            {row.displayType === "input" && <span>{row.inputValue}</span>}
          </div>
        );
      }
      const { completed, total } = progress,
        percentage = Math.ceil(completed / total * 1000) / 10 + "%";
      return (
        <div>
          <Checkbox checked={percentage === "100%"} />{" "}
          {`(${completed}/${total})`}
        </div>
      );
    }
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role"
  },
  {
    title: "Locations",
    dataIndex: "locations",
    render: locations =>
      locations &&
      locations.map(location => <Tag key={location}>{location}</Tag>)
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date"
  }
];

export default ({ checklists }) => (
  <Table columns={columns} dataSource={checklists} />
);
