import React, { Component } from "react";
import { Input, Button, notification } from "antd";
import submitComment from "../firebase/submitComment.js";
import getCurrentTime from "../helperFunctions/getCurrentTime.js";

/* STATE
    inputValue: string; the value currently in the Input
*/

/* PROPS
    sortedComments: [obj]; comments from the relevant checklist, already sorted
      in reverse chronological order by ChecklistComments component
    firebasePath: string, the path where this checklist is coming from in
      the form "/dailyLists/<YYYY-MM-DD>/<location>/<role>/<checklistKey>"
    userInfo: object, needed for user's name when submitting a comment
*/

export default class CommentChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: ""
    };
  }

  onInputChange(newValue) {
    this.setState({
      ...this.state,
      inputValue: newValue
    });
  }

  onSubmitComment() {
    // if the input is blank, throw an error, otherwise submit to firebase
    if (!this.state.inputValue) {
      notification.error({
        message: "ERROR",
        description: "No text was entered.",
        duration: 2
      });
    } else {
      // submit to firebase
      let username =
        this.props.userInfo.firstName + " " + this.props.userInfo.lastName;
      let timeStamp = getCurrentTime("America/New_York");
      let commentObject = {
        username: username,
        timeStamp: timeStamp,
        commentText: this.state.inputValue
      };
      let firebasePath = this.props.firebasePath + "/comments";
      submitComment(firebasePath, commentObject);

      // clear the input
      this.onInputChange("");
    }
  }

  render() {
    // map through the comments and render them accordingly
    let renderedComments = [];
    if (this.props.sortedComments) {
      renderedComments = this.props.sortedComments.map(comment => {
        return (
          <div>
            <p style={{ fontWeight: "bold" }}>
              {comment.username} {comment.timeStamp}
            </p>

            <p>
              {" "}{comment.commentText}{" "}
            </p>
          </div>
        );
      });
    }

    return (
      <div style={{ height: "100%", width: "100%" }}>
        <div
          className="renderedComments"
          style={{ overflow: "auto", height: "80%" }}
        >
          {renderedComments}
        </div>

        <Input
          value={this.state.inputValue}
          onChange={e => this.onInputChange(e.target.value)}
          onPressEnter={() => this.onSubmitComment()}
          placeholder="(Max length 1000 characters)"
          maxLength={1000}
        />
        <Button onClick={() => this.onSubmitComment()}> Submit </Button>
      </div>
    );
  }
}
