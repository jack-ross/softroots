import React, { Component } from "react";
import firebase from "../configs/firebaseConfig";
import ChecklistTable from "./ChecklistTable";
import SubtaskScaleModal from "../components/SubtaskScaleModal";

export const HistoryViewComponent = ({ checklists = [] }) => (
  <div className="ViewChecklistsPage">
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
      pivot: "date"
    };
  }

  receiveChecklists(value) {
    this.setState({
      ...this.state,
      checklists: flattenChecklists(value).reverse(),
      loadedChecklists: true
    });
  }

  componentWillMount() {
    firebase
      .database()
      .ref("/dailyLists")
      .once("value", snapshot => {
        // if no data, let the user know by updating the status
        const val = snapshot.val();
        if (val) {
          this.receiveChecklists(val);
        }
      });
  }
  render() {
    const { userInfo = {}, dateKey } = this.props;
    if (userInfo && userInfo.role === "Admin") {
    }
    return <HistoryViewComponent checklists={this.state.checklists} />;
  }
}
