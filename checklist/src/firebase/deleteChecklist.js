import firebase from "../configs/firebaseConfig.js";
import { notification } from "antd";

export default function deleteChecklist(checklist) {
  // create the paths to delete from
  console.log("attempting to delete checklist:");
  console.log(checklist);

  // object storing firebase paths to delete
  let firebaseUpdates = {};
  firebaseUpdates[checklist.path] = null;
  
  firebase
    .database()
    .ref()
    .update(firebaseUpdates)
    .then(response => {
      notification.success({
        message: "Success",
        description: "The checklist was successfully deleted."
      });
    })
    .catch(error => {
      notification.error({
        message: "ERROR",
        description: "Firebase error: " + error
      });
    });
}
