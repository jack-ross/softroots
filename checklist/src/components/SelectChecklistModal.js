import React from "react";
import { Button, Checkbox, Modal, Select } from "antd";
import { updateUserRole, updateUserReports } from "../firebase/updateUser";
import { unique } from "../helperFunctions/unique";
import { storeLocations } from "../locations";

const ModalComponent = ({
  submit,
  visible,
  toggle,
  checklists = [],
  selectedIds,
  toggleChecklist,
  locations,
  activeLocation,
  onLocationChange,
  selectAll,
  deselectAll
}) => (
  <Modal
    title="Select checklists to include in report"
    onOk={() => submit(selectedIds) && toggle(false)}
    onCancel={() => toggle(false)}
    visible={visible}
  >
    <div style={{ marginBottom: 8, display: "flex" }}>
      <Select
        style={{ flex: 1 }}
        value={activeLocation}
        onChange={option => {
          onLocationChange(option);
        }}
      >
        {storeLocations.map(location => (
          <Select.Option value={location}>{location}</Select.Option>
        ))}
      </Select>
      <Button onClick={() => selectAll()} style={{ marginLeft: 4 }}>
        Select all
      </Button>
      <Button onClick={() => deselectAll()} style={{ marginLeft: 4 }}>
        Deselect all
      </Button>
    </div>
    <ul>
      {checklists.map(checklist => (
        <li
          key={checklist.id}
          onClick={() => toggleChecklist(checklist.id)}
          style={{ listStyle: "none", padding: "4px 8px" }}
        >
          <Checkbox
            checked={selectedIds.indexOf(checklist.id) > -1}
            style={{ marginRight: 4 }}
          />
          {checklist.title}
        </li>
      ))}
    </ul>
  </Modal>
);

export class SelectChecklistModal extends React.Component {
  state = {
    visible: false,
    selectedIds: [],
    checklists: [],
    location: null
  };

  getLocationChecklists = (location, checklists) => {
    const locationChecklists =
      checklists[location] || checklists[`Roots-${location}`] || {};
    const allChecklists = Object.keys(locationChecklists)
      .map(role =>
        storeLocations.map(checklistId => ({
          ...locationChecklists[role][checklistId],
          id: checklistId,
          role
        }))
      )
      .reduce((a, c) => a.concat(c), []);
    return allChecklists;
  };

  setChecklistState = props => {
    const { checklists, user } = props;
    try {
      const location = user.location;
      const allChecklists = this.getLocationChecklists(location, checklists);
      this.setState({
        location,
        locations: storeLocations,
        checklists: allChecklists,
        selectedIds: user.reportIds ? user.reportIds.split(",") : []
      });
    } catch (e) {}
  };

  onLocationChange = location => {
    this.setState({
      location,
      checklists: this.getLocationChecklists(location, this.props.checklists)
    });
  };

  componentWillMount() {
    const { checklists, user } = this.props;
    if (checklists && user) {
      this.setChecklistState(this.props);
    }
  }
  componentWillReceiveProps(nextProps) {
    const { checklists, user } = this.props;
    const { checklists: nextChecklists, user: nextUser } = nextProps;
    if (nextChecklists && nextUser && (!checklists || !user)) {
      this.setChecklistState(nextProps);
    }
  }
  toggleChecklist = id => {
    const { selectedIds } = this.state;
    if (selectedIds.indexOf(id) === -1) {
      this.setState({ selectedIds: selectedIds.concat(id) });
    } else {
      this.setState({ selectedIds: selectedIds.filter(i => i !== id) });
    }
  };

  selectAll = id => {
    const { selectedIds, checklists } = this.state;
    const ids = checklists.map(c => c.id);
    this.setState({ selectedIds: unique(selectedIds.concat(ids)) });
  };
  deselectAll = () => {
    const { selectedIds, checklists } = this.state;
    const ids = checklists.map(c => c.id);
    this.setState({
      selectedIds: selectedIds.filter(id => ids.indexOf(id) === -1)
    });
  };
  render() {
    const { selectedIds, checklists, location } = this.state;
    return (
      <span>
        <Button onClick={() => this.setState({ visible: true })}>
          {selectedIds.length > 0
            ? `${selectedIds.length} checklists`
            : "0 checklists"}
        </Button>
        <ModalComponent
          {...this.state}
          allSelected={selectedIds.length === checklists.length}
          toggleChecklist={id => this.toggleChecklist(id)}
          selectAll={() => this.selectAll()}
          activeLocation={location}
          onLocationChange={location => this.onLocationChange(location)}
          deselectAll={() => this.deselectAll()}
          toggle={() => this.setState({ visible: false })}
          submit={() => updateUserReports(this.props.user.uid, selectedIds)}
        />
      </span>
    );
  }
}
