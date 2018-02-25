import firebase from "../configs/firebaseConfig.js";
import { notification } from "antd";

// this function uses a user's UID to update their role in firebase

export const updateUserRole = (userUID, newRole) => {
  let firebasePath = "/users/verified/" + userUID + "/role/";
  firebase
    .database()
    .ref(firebasePath)
    .set(newRole)
    .then(response => {
      notification.success({
        message: "SUCCESS",
        description: "User's role updated."
      });
    });
};

export const updateUserReports = (userUID, checklistIds) => {
  let firebasePath = "/users/verified/" + userUID + "/reportIds/";
  firebase
    .database()
    .ref(firebasePath)
    .set(checklistIds.join(","))
    .then(response => {
      notification.success({
        message: "SUCCESS",
        description: "User's checklist reports updated."
      });
    });
};
