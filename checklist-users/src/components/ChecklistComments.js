import React, { Component } from "react";
import { Modal } from "antd";
import CommentChat from "./CommentChat.js";

/* STATE
    isModalVisible: boolean, determines whether or not to show the Modal with the CommentChat
*/

/* PROPS
    comments: obj; comments from the relevant checklist
    firebasePath: string, the path where this checklist is coming from in
      the form "/dailyLists/<YYYY-MM-DD>/<location>/<role>/<checklistKey>"
    userInfo: object, needed for user's name when submitting a comment
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
        <p onClick={() => this.switchModalVisibility()}>
          {" "}Comments ({commentArray.length}) {" "}
        </p>

        {this.state.isModalVisible &&
          <Modal
            visible={true}
            okText="OK"
            cancelText="Cancel"
            onOk={() => this.switchModalVisibility()}
            onCancel={() => this.switchModalVisibility()}
            style={{ top: "0px" }}
            footer={false}
          >
            {commentChat}
          </Modal>}
      </div>
    );
  }
}
