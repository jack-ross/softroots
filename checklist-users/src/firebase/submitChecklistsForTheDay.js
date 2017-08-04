import firebase from "../configs/firebaseConfig.js";
import convertAllChecklistSchemas from "../helperFunctions/convertAllChecklistSchemas.js";
import createKeyFromDate from "../helperFunctions/createKeyFromDate.js";

export default function(allChecklists) {
  let updatedChecklists = convertAllChecklistSchemas(allChecklists);
  let dateKey = createKeyFromDate("America/New_York");
  let firebaseUpdate = {
    [dateKey]: updatedChecklists
  };
  firebase.database().ref("/dailyLists/").update(firebaseUpdate);
}
