import firebase from "../configs/firebaseConfig.js";
import convertAllChecklistSchemas from "../helperFunctions/convertAllChecklistSchemas.js";
import createKeyFromDate from "../helperFunctions/createKeyFromDate.js";

export default function(allChecklists, dateKey) {
  let updatedChecklists = convertAllChecklistSchemas(allChecklists, dateKey);
  let firebaseUpdate = {
    [dateKey]: updatedChecklists
  };
  firebase.database().ref("/dailyLists/").update(firebaseUpdate);
}
