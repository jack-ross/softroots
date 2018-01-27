import React, { Component } from "react";
import moment from "moment";
import { Select, DatePicker } from "antd";
import firebase from "../configs/firebaseConfig";
import ChecklistTable from "./ChecklistTable";
import SubtaskScaleModal from "../components/SubtaskScaleModal";
const RangePicker = DatePicker.RangePicker;

const Filters = ({
  filters = {},
  onFilterChange,
  locations = [],
  roles = []
}) => (
  <div style={{ paddingTop: 24, paddingBottom: 12 }}>
    <RangePicker
      key="picker"
      style={{ marginRight: 12 }}
      value={filters.range}
      onChange={range => onFilterChange({ range })}
    />
    <Select
      key="role-select"
      placeholder="Role"
      style={{ width: 200, marginRight: 12 }}
      value={filters.role}
      onChange={role => onFilterChange({ role })}
    >
      {roles.map(r => (
        <Select.Option key={r} value={r}>
          {r}
        </Select.Option>
      ))}
    </Select>
    <Select
      key="location-select"
      style={{ width: 200 }}
      placeholder="Location"
      value={filters.location}
      onChange={location => onFilterChange({ location })}
    >
      {locations.map(l => (
        <Select.Option key={l} value={l}>
          {l}
        </Select.Option>
      ))}
    </Select>
  </div>
);

export const HistoryViewComponent = ({
  checklists = [],
  roles,
  locations,
  onFilterChange,
  filters
}) => (
  <div className="ViewChecklistsPage">
    <Filters
      filters={filters}
      onFilterChange={onFilterChange}
      roles={roles}
      locations={locations}
    />
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
    .map(date =>
      flattenEntry(firebaseLists[date]).map(e => ({
        ...e,
        date: moment(date, "YYYY-MM-DD")
      }))
    )
    .reduce((acc, list) => acc.concat(list), []);

const filterChecklists = (checklists, filters) => {
  let filteredChecklists = checklists;
  if (filters.range) {
    const [start, end] = filters.range;
    filteredChecklists = checklists.filter(
      checklist =>
        checklist.date &&
        !checklist.date.isBefore(start) &&
        !checklist.date.isAfter(end)
    );
  }
  if (filters.role) {
    filteredChecklists = filteredChecklists.filter(
      checklist => checklist.role === filters.role
    );
  }
  if (filters.location) {
    filteredChecklists = filteredChecklists.filter(
      checklist => checklist.location.indexOf(filters.location) > -1
    );
  }
  return filteredChecklists;
};

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
    const checklists = flattenChecklists(value).reverse(),
      locations = Object.keys(
        checklists
          .map(c => c.location)
          .reduce((acc, l) => acc.concat(l), [])
          .reduce(
            (acc, c) => ({
              ...acc,
              [c]: true
            }),
            {}
          )
      ),
      roles = Object.keys(
        checklists.reduce(
          (acc, c) => ({
            ...acc,
            [c.role]: true
          }),
          {}
        )
      );

    this.setState({
      ...this.state,
      checklists,
      locations,
      roles,
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
    const { filters, checklists, roles, locations } = this.state;
    const filteredChecklists = filterChecklists(checklists, filters);
    if (
      process.env.NODE_ENV === "development" ||
      (userInfo && userInfo.role === "Admin")
    ) {
      return (
        <HistoryViewComponent
          checklists={filteredChecklists}
          filters={filters}
          roles={roles}
          locations={locations}
          onFilterChange={filters => this.onFilterChange(filters)}
        />
      );
    } else {
      return <span>You must be an admin to see this page</span>;
    }
  }
}
