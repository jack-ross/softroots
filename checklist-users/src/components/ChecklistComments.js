import React, { Component } from "react";
import { Modal, Icon } from "antd";
import CommentChat from "./CommentChat.js";
import "../css/ChecklistComments.css";

/* STATE
    isModalVisible: boolean, determines whether or not to show the Modal with the CommentChat
*/

/* PROPS
    comments: obj; comments from the relevant checklist
    firebasePath: string, the path where this checklist is coming from in
      the form "/dailyLists/<YYYY-MM-DD>/<location>/<role>/<checklistKey>"
      or could go futher to a subtask for subtask specific chat
    userInfo: object, needed for user's name when submitting a comment
    type: string; either "checklist" or "subtask" depending on which kind of chat this is
    longDescription: string (optional), if it's a subtask and there's a longer description
      to be displayed in this modal
    shortDescription: string (optional), if it's a subtask and there's a short description
      to be displayed as the modal's title
*/

export default class ChecklistComments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false
    };
  }

  switchModalVisibility() {
    this.setState({
      ...this.state,
      isModalVisible: !this.state.isModalVisible
    });
  }

  render() {
    // take the comments object, store in an array
    let commentArray = [];
    if (this.props.comments) {
      commentArray = Object.keys(this.props.comments).map(key => {
        return this.props.comments[key];
      });
    }

    // create the CommentChat component for the Modal
    let commentChat = (
      <CommentChat
        sortedComments={commentArray}
        firebasePath={this.props.firebasePath}
        userInfo={this.props.userInfo}
      />
    );

    return (
      <div>
        {this.props.type === "checklist" && (
          <p onClick={() => this.switchModalVisibility()}>
            {" "}
            Comments ({commentArray.length}) {" "}
          </p>
        )}

        {this.props.type === "subtask" && (
          <div className="SubtaskChatIcon">
            <Icon
              type="message"
              style={{ fontSize: "15px" }}
              onClick={() => this.switchModalVisibility()}
            />
          </div>
        )}

        {this.state.isModalVisible && (
          <Modal
            visible={true}
            okText="OK"
            cancelText="Cancel"
            onOk={() => this.switchModalVisibility()}
            onCancel={() => this.switchModalVisibility()}
            style={{ top: "0px" }}
            footer={false}
            title={this.props.shortDescription}
          >
            <p style={{ fontWeight: "bold", fontSize: 14 }}>
              {" "}
              {this.props.longDescription}{" "}
            </p>

            <div style={{ margin: "10px" }} />

            {commentChat}
          </Modal>
        )}
      </div>
    );
  }
}
