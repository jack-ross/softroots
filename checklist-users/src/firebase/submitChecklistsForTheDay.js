import firebase from "../configs/firebaseConfig.js";
import convertAllChecklistSchemas from "../helperFunctions/convertAllChecklistSchemas.js";

export default function(checklistSchemas, dateKey) {
  let updatedChecklists = convertAllChecklistSchemas(checklistSchemas, dateKey);
  let firebaseUpdate = {
    [dateKey]: updatedChecklists
  };
  firebase.database().ref("/dailyLists/").update(firebaseUpdate);
}
