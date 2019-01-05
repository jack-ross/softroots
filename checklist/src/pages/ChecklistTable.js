import React from "react";
import moment from "moment";
import { Checkbox, Tag, Table } from "antd";
import { isMoment } from "moment";

const columns = [
  {
    title: <div style={{ marginLeft: 24 }}>Title</div>,
    width: "35%",
    dataIndex: "title",
    key: "title",
    render: title => <span>{title}</span>
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
            <span>{row.inputValue}</span>
          </div>
        );
      }
      const { completed, total } = progress,
        percentage = Math.ceil((completed / total) * 1000) / 10 + "%";
      return (
        <div>
          <Checkbox
            checked={percentage === "100%"}
            style={{ marginRight: 4 }}
          />
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
    key: "date",
    render: item => {
      const formatStr = "MMM Do, YYYY";
      if (item.date) {
        return item.date.format(formatStr);
      } else if (item.completedDate) {
        return moment(item.completedDate).format(formatStr);
      }
    },
    sorter: (a, b) => a.date && a.date.isBefore(b.date)
  }
];

export default ({ checklists, loading }) => (
  <Table
    columns={columns}
    dataSource={checklists}
    loading={loading}
    locale={{ emptyText: loading ? "" : "No results found" }}
  />
);
