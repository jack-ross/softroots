import React, { Component } from "react";
import { Select, DatePicker } from "antd";
import firebase from "../configs/firebaseConfig";
import ChecklistTable from "./ChecklistTable";
import SubtaskScaleModal from "../components/SubtaskScaleModal";
const RangePicker = DatePicker.RangePicker;

const Filters = ({ filters, onFilterChange }) => (
  <div style={{ paddingTop: 24, paddingBottom: 12 }}>
    <RangePicker
      key="picker"
      style={{ marginRight: 12 }}
      onChange={range => onFilterChange({ range })}
    />
    <Select
      key="role-select"
      placeholder="Role"
      style={{ width: 200, marginRight: 12 }}
      onChange={role => onFilterChange({ role })}
    />
    <Select
      key="location-select"
      style={{ width: 200 }}
      placeholder="Location"
      onChange={location => onFilterChange({ location })}
    />
  </div>
);

export const HistoryViewComponent = ({
  checklists = [],
  onFilterChange,
  filters
}) => (
  <div className="ViewChecklistsPage">
    <Filters filters={filters} onFilterChange={onFilterChange} />
    <ChecklistTable checklists={checklists} />
  </div>
);

const getSubsectionProgress = section => {
  let total = 0;
  let completed = 0;
  section.subtasks.map(task => {
    total++;
    if (task.isCompleted) {
      completed++;
    }
  });
  return { completed, total };
};

const subtasksToChildren = (tasks, k) =>
  tasks.map((task, index) => ({
    key: k + "-" + index,
    description: task.shortDescription,
    progress: task.isCompleted,
    inputValue: task.inputValue,
    locations: []
  }));

const subsectionsToChildren = (checklist, k) =>
  checklist.subsections.map((subsection, index) => {
    return {
      key: k + index,
      description: subsection.title,
      progress: getSubsectionProgress(subsection),
      role: null,
      locations: [],
      date: null,
      children: subtasksToChildren(subsection.subtasks, k + index)
    };
  });

const getChecklistProgress = checklist => {
  let total = 0;
  let completed = 0;
  checklist.subsections.map(section =>
    section.subtasks.map(task => {
      total++;
      if (task.isCompleted) {
        completed++;
      }
    })
  );
  return { completed, total };
};

const flattenEntry = entry => {
  let checklists = [];
  const locations = Object.keys(entry);
  Object.values(entry).forEach(location => {
    Object.values(location).forEach(role => {
      checklists = checklists.concat(
        Object.keys(role).map(k => ({
          ...role[k],
          key: k,
          progress: getChecklistProgress(role[k]),
          children: subsectionsToChildren(role[k], k)
        }))
      );
    });
  });
  return checklists;
};

const flattenChecklists = firebaseLists =>
  Object.keys(firebaseLists)
    .map(date => flattenEntry(firebaseLists[date]).map(m => ({ ...m, date })))
    .reduce((acc, list) => acc.concat(list), []);

export class HistoryView extends React.Component {
  constructor() {
    super();
    this.state = {
      checklists: [],
      filters: {
        dateRange: null,
        role: null,
        location: null
      }
    };
  }

  receiveChecklists(value) {
    this.setState({
      ...this.state,
      checklists: flattenChecklists(value).reverse(),
      loadedChecklists: true
    });
  }

  onFilterChange(change) {
    this.setState({ filters: { ...this.state.filters, ...change } });
  }

  componentWillMount() {
    firebase
      .database()
      .ref("/dailyLists")
      .on("value", snapshot => {
        // if no data, let the user know by updating the status
        const val = snapshot.val();
        if (val) {
          this.receiveChecklists(val);
        }
      });
  }
  render() {
    const { userInfo = {}, dateKey } = this.props;
    if (
      process.env.NODE_ENV === "development" ||
      (userInfo && userInfo.role === "Admin")
    ) {
      return (
        <HistoryViewComponent
          checklists={this.state.checklists}
          filters={this.state.filters}
          onFilterChange={filters => this.onFilterChange(filters)}
        />
      );
    } else {
      return <span>You must be an admin to see this page</span>;
    }
  }
}
