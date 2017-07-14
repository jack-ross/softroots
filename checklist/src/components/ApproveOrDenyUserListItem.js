import React, { Component } from "react";
import { Button, Modal } from "antd";

/* PROPS:
  fields: [obj]; array of objects containing two fields:
    visibleDescription: string; how the field is described on-screen
    field: the field to reference of the user object from firebase
  userInfo: object (presumably from firebase)
  onApprove: function; called when approve button is clicked
  onDeny: function; called when deny button is clicked
*/

/* STATE:
  None!
*/

export default class ApproveOrDenyUserListItem extends Component {
  showConfirmApprove(contract) {
    Modal.confirm({
      title: "Approve User?",
      content: "Make sure they're a valid employee!",
      okText: "Approve",
      cancelText: "Cancel",
      onOk: () => this.props.onApprove(contract),
      onCancel() {}
    });
  }

  showConfirmDelete(contract) {
    Modal.confirm({
      title: "Delete User?",
      content: "This action cannot be undone.",
      okText: "Delete",
      cancelText: "Cancel",
      onOk: () => this.props.onDeny(contract),
      onCancel() {}
    });
  }

  render() {
    let user = this.props.userInfo;

    // map through the fields to render the relevant info from user
    let userInfoRender = this.props.fields.map(fieldObj => {
      return (
        <div key={fieldObj.field}>
          <h3>
            {" "}{fieldObj.visibleDescription}{" "}
          </h3>
          <p>
            {" "}{user[fieldObj.field]}{" "}
          </p>
        </div>
      );
    });

    return (
      <div>
        {userInfoRender}
        <Button
          type="primary"
          icon="check-circle-o"
          onClick={() => this.showConfirmApprove(user)}
        >
          Approve
        </Button>
        <Button
          icon="close-circle-o"
          onClick={() => this.showConfirmDelete(user)}
        >
          Delete
        </Button>
        <div style={{ margin: "20px 0" }} />
      </div>
    );
  }
}
