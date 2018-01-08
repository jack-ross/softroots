import firebase from "../configs/firebaseConfig.js";
import { notification } from "antd";

export default function deleteChecklist(checklist) {
  // create the paths to delete from
  let locationKeys = checklist.location;

  // object storing firebase paths to delete
  let firebaseUpdates = {};
  locationKeys.map(locationKey => {
    let path =
      "/checklists/" + locationKey + "/" + checklist.role + "/" + checklist.key;
    firebaseUpdates[path] = null;
  });

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
