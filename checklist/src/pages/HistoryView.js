import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import queryString from "query-string";
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

const getNestedLocation = location => {
  if (!location) {
    return null;
  }
  if (typeof location === "string") {
    return [location];
  }
  if (typeof location[0] === "string") {
    return location;
  }
  return getNestedLocation(location[0]);
};

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
  checklist.subsections
    ? checklist.subsections.map((subsection, index) => {
        return {
          key: k + index,
          title: subsection.title,
          progress: getSubsectionProgress(subsection),
          completedDate: subsection.completedDate,
          role: null,
          locations: [],
          date: null,
          children: subtasksToChildren(subsection.subtasks, k + index)
        };
      })
    : [];

const getChecklistProgress = checklist => {
  if (!checklist.subsections) {
    return [];
  }
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
        Object.keys(role)
          .map(k => ({
            ...role[k],
            location: getNestedLocation(role[k].location),
            key: k,
            progress: getChecklistProgress(role[k]),
            children: subsectionsToChildren(role[k], k)
          }))
          .filter(role => !!role.location)
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
      checklist =>
        checklist.title.toLowerCase().indexOf(filters.title.toLowerCase()) > -1
    );
  }
  if (filters.listIds) {
    const ids = filters.listIds;
    filteredChecklists = filteredChecklists.filter(
      checklist => ids.indexOf(checklist.templateKey) > -1
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

export const HistoryViewComponent = ({
  checklists = [],
  roles,
  locations,
  onFilterChange,
  filters,
  isAdmin,
  status
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
        {isAdmin && (
          <Filters
            filters={filters}
            onFilterChange={onFilterChange}
            roles={roles}
            locations={locations}
          />
        )}
        {status !== "error" && (
          <ChecklistTable
            checklists={checklists}
            loading={status === "loading"}
          />
        )}
        {status === "error" && (
          <div style={{ padding: "48px 64px" }}>"Error fetching data"</div>
        )}
      </div>
    </div>
  </div>
);

const connectViewState = Component =>
  class HistoryViewState extends React.Component {
    constructor() {
      super();
      this.state = {
        checklists: []
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
        checklists,
        locations,
        roles
      });
    }

    onFilterChange(change) {
      this.setParams({ ...this.getParams().filters, ...change });
    }

    setParams = change => {
      const { history } = this.props;
      const query = queryString.parse(history.location.search);
      Object.keys(change).forEach(key => {
        if (key === "range") {
          const dateStr = change[key].map(d => d.toString()).join(",");
          query["range"] = dateStr;
        } else {
          query[key] = change[key];
        }
      });
      history.replace({
        ...history.location,
        search: queryString.stringify(query)
      });
    };

    getParams = () => {
      const { history } = this.props;
      const search = queryString.parse(history.location.search);
      if (search.range) {
        search.range = search.range.split(",").map(s => moment(s));
      }
      if (search.listIds) {
        search.listIds = search.listIds.split(",");
      }
      return search;
    };

    componentWillMount() {
      const db = firebase.database();
      const url = db.app.options_.databaseUrl;
      this.setState({ status: "loading" });
      firebase
        .database()
        .ref("/dailyLists")
        .orderByKey()
        .on("value", snapshot => {
          // if no data, let the user know by updating the status
          const val = snapshot.val();
          if (val) {
            try {
              this.receiveChecklists(val);
              this.setState({ status: "success" });
            } catch (e) {
              alert("Error ingesting checklists. Please contact developer.");
              this.setState({
                status: "error"
              });
            }
          } else {
            this.setState({
              status: "error"
            });
          }
        });
    }
    render() {
      const { userInfo = {}, dateKey, history, location } = this.props;
      const { checklists, roles, locations, status } = this.state;
      const filters = this.getParams();
      const filteredChecklists = filterChecklists(checklists, filters);
      const isAdmin =
        process.env.NODE_ENV === "development" ||
        (userInfo && userInfo.role === "Admin");
      if (!isAdmin && Object.keys(filters).length === 0) {
        return <span>You must be an admin to see this page</span>;
      } else {
        return (
          <Component
            checklists={filteredChecklists}
            isAdmin={isAdmin}
            roles={roles}
            locations={locations}
            onFilterChange={filters => this.onFilterChange(filters)}
            filters={this.getParams()}
            status={status}
          />
        );
      }
    }
  };

export const HistoryView = withRouter(connectViewState(HistoryViewComponent));
