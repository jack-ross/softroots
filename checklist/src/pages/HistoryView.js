import React, { Component } from "react";
import moment from "moment";
import TopNavBar from "../components/TopNavBar.js";
import { Input, Select, DatePicker } from "antd";
import firebase from "../configs/firebaseConfig";
import ChecklistTable from "./ChecklistTable";
const RangePicker = DatePicker.RangePicker;

const Label = ({ children }) => (
  <div style={{ fontWeight: 500, color: "#777", paddingBottom: 4 }}>
    {children}
  </div>
);

const Filters = ({
  filters = {},
  onFilterChange,
  locations = [],
  roles = []
}) => (
  <div
    style={{
      paddingTop: 24,
      paddingBottom: 12,
      display: "flex",
      justifyContent: "flex-start"
    }}
  >
    <span style={{ display: "inline-block", marginRight: 12 }}>
      <Label>Title</Label>
      <Input
        key="input"
        value={filters.title}
        onChange={e => onFilterChange({ title: e.target.value })}
      />
    </span>
    <span>
      <Label>Date range</Label>
      <RangePicker
        key="picker"
        style={{ marginRight: 12 }}
        value={filters.range}
        allowClear={true}
        onChange={range => onFilterChange({ range })}
      />
    </span>
    <span>
      <Label>Role</Label>
      <Select
        key="role-select"
        placeholder="Role"
        style={{ width: 200, marginRight: 12 }}
        value={filters.role}
        allowClear={true}
        onChange={role => onFilterChange({ role })}
      >
        {roles.map(r => (
          <Select.Option key={r} value={r}>
            {r}
          </Select.Option>
        ))}
      </Select>
    </span>
    <span>
      <Label>Location</Label>
      <Select
        key="location-select"
        style={{ width: 200 }}
        placeholder="Location"
        allowClear={true}
        value={filters.location}
        onChange={location => onFilterChange({ location })}
      >
        {locations.map(l => (
          <Select.Option key={l} value={l}>
            {l}
          </Select.Option>
        ))}
      </Select>
    </span>
  </div>
);

export const HistoryViewComponent = ({
  checklists = [],
  roles,
  locations,
  onFilterChange,
  filters
}) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      alignItems: "stretch"
    }}
  >
    <TopNavBar key="top" className="horizontal" onClickSignOut={() => null} />
    <div style={{ flex: 1 }}>
      <div style={{ height: "100%", maxWidth: 1200, margin: "0 auto" }}>
        <Filters
          filters={filters}
          onFilterChange={onFilterChange}
          roles={roles}
          locations={locations}
        />
        <ChecklistTable checklists={checklists} />
      </div>
    </div>
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
  tasks.map((task, index) => {
    return {
      key: k + "-" + index,
      title: task.shortDescription,
      progress: task.isCompleted,
      inputValue: task.inputValue,
      locations: []
    };
  });

const subsectionsToChildren = (checklist, k) =>
  checklist.subsections.map((subsection, index) => {
    return {
      key: k + index,
      title: subsection.title,
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

const getDate = (date, entry) => {
  return moment(date, "YYYY-MM-DD");
};

const flattenChecklists = firebaseLists =>
  Object.keys(firebaseLists)
    .map(date =>
      flattenEntry(firebaseLists[date]).map(e => ({
        ...e,
        date: getDate(date, firebaseLists[date])
      }))
    )
    .reduce((acc, list) => acc.concat(list), []);

const filterChecklists = (checklists, filters) => {
  let filteredChecklists = checklists;
  if (filters.range && filters.range.length) {
    const [start, end] = filters.range;
    filteredChecklists = checklists.filter(
      checklist =>
        checklist.date &&
        !checklist.date.isBefore(start) &&
        !checklist.date.isAfter(end)
    );
  }
  if (filters.title && filters.title.length) {
    filteredChecklists = filteredChecklists.filter(
      checklist => checklist.title.toLowerCase().indexOf(filters.title) > -1
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

export default class HistoryView extends React.Component {
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
