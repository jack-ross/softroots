// this function will update a specific field of that day's subtask
// and also update the isCompleted field accordingly

import firebase from "../configs/firebaseConfig.js";
import { notification } from "antd";

export default function(
  subtask,
  field,
  newValue,
  subsectionIndex,
  subtaskIndex,
  firebasePath,
  key
) {
  let updatedFirebasePath =
    firebasePath +
    "/" +
    key +
    "/subsections/" +
    subsectionIndex +
    "/subtasks/" +
    subtaskIndex;
  let fieldPath = updatedFirebasePath + "/" + field;
  let isCompletedPath = updatedFirebasePath + "/isCompleted";
  let firebaseUpdates = {};
  firebaseUpdates[fieldPath] = newValue;
  if (!newValue) {
    // happens if newValue is "", undefined, etc (could depend on certain situations)
    firebaseUpdates[isCompletedPath] = false;
  } else {
    firebaseUpdates[isCompletedPath] = true;
  }

  firebase
    .database()
    .ref()
    .update(firebaseUpdates)
    .then(response => {
      notification.success({
        message: "SUCCESS",
        description: "Submission saved successfully.",
        duration: 2
      });
    })
    .catch(error => {
      notification.error({
        message: "ERROR",
        description: error.message
      });
    });
}
