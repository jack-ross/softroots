import firebase from "../configs/firebaseConfig.js";
import submitChecklistsForTheDay from "./submitChecklistsForTheDay.js";

export default function(dailyKey) {
  // first, grab all the schemas from firebase
  let checklistSchemas;
  firebase
    .database()
    .ref("/checklists")
    .once("value", snapshot => {
      checklistSchemas = snapshot.val();
    })
    .then(response => {
      // if some checklist schemas exist, submit the checklists for the day
      if (checklistSchemas) {
        firebase
          .database()
          .ref("dailyLists/" + dailyKey)
          .once("value", snapshot => {
            // if no data at that location, then put them in there
            if (!snapshot.val()) {
              submitChecklistsForTheDay(checklistSchemas, dailyKey);
            }
          });
      }
    });
}
