import React from "react";
import { Checkbox, Tag, Table } from "antd";

const columns = [
  {
    title: <div style={{ marginLeft: 24 }}>Description</div>,
    width: "35%",
    dataIndex: "description",
    key: "description",
    render: description => <span>{description}</span>
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
    title: "Location",
    dataIndex: "location",
    render: locations =>
      locations &&
      locations.map(location => <Tag key={location}>{location}</Tag>)
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    render: date => date && date.format("MMM Do, YYYY"),
    sorter: (a, b) => a.date && a.date.isBefore(b.date)
  }
];

export default ({ checklists }) => (
  <Table columns={columns} dataSource={checklists} />
);
