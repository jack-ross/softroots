import firebase from "../configs/firebaseConfig.js";
import createKeyFromDate from "../helperFunctions/createKeyFromDate.js";
import submitChecklistsForTheDay from "./submitChecklistsForTheDay.js";
import convertAllChecklistSchemas from "../helperFunctions/convertAllChecklistSchemas.js";

export default function() {
  // first, grab all the schemas from firebase
  let checklistSchemas;
  firebase
    .database()
    .ref("/checklists")
    .once("value", snapshot => {
      checklistSchemas = snapshot.val();
    })
    .then(response => {
      // next, check if today's list exist in firebase
      let dailyKey = createKeyFromDate("America/New_York");
      firebase
        .database()
        .ref("dailyLists/" + dailyKey)
        .once("value", snapshot => {
          // if no data at that location, then put them in there
          if (!snapshot.val()) {
            submitChecklistsForTheDay(checklistSchemas);
          }
        });
    });
}
