import React from "react";
import { Button, Checkbox, Modal } from "antd";
import { updateUserRole, updateUserReports } from "../firebase/updateUser";

const ModalComponent = ({
  submit,
  visible,
  toggle,
  checklists = [],
  selectedIds,
  toggleChecklist
}) => (
  <Modal
    title="Select checklists to include in report"
    onOk={() => submit(selectedIds) && toggle(false)}
    onCancel={() => toggle(false)}
    visible={visible}
  >
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
    checklists: []
  };
  componentWillMount() {
    const { checklists, user } = this.props;
    const allChecklists = Object.keys(checklists[user.location])
      .map(role =>
        Object.keys(checklists[user.location][role]).map(checklistId => ({
          ...checklists[user.location][role][checklistId],
          id: checklistId,
          role
        }))
      )
      .reduce((a, c) => a.concat(c), []);
    this.setState({
      checklists: allChecklists,
      selectedIds: user.reportIds ? user.reportIds.split(",") : []
    });
  }
  toggleChecklist = id => {
    const { selectedIds } = this.state;
    if (selectedIds.indexOf(id) === -1) {
      this.setState({ selectedIds: selectedIds.concat(id) });
    } else {
      this.setState({ selectedIds: selectedIds.filter(i => i !== id) });
    }
  };
  render() {
    const { selectedIds, checklists } = this.state;
    return (
      <span>
        <Button onClick={() => this.setState({ visible: true })}>
          {selectedIds.length > 0
            ? `${selectedIds.length} checklists`
            : "0 checklists"}
        </Button>
        <ModalComponent
          {...this.state}
          toggleChecklist={id => this.toggleChecklist(id)}
          toggle={() => this.setState({ visible: false })}
          submit={() => updateUserReports(this.props.user.uid, selectedIds)}
        />
      </span>
    );
  }
}
