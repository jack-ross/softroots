import firebase from "../configs/firebaseConfig.js";
import { notification } from "antd";
import sortDaysOfWeek from "../helperFunctions/sortDaysOfWeek.js";

export default function submitChecklist(checklist) {
  let locationKeys = checklist.locations;

  let firebaseUpdates = {};
  // map through the locations and push to each one using the firebase object
  locationKeys.map(location => {
    // make a copy of the checklist object (because JavaScript is weird with how
    // objects work as parameters)
    let newChecklist = Object.assign({}, checklist);

    // generate the key for this checklist
    let checklistKey = firebase
      .database()
      .ref()
      .push()
      .key.toString();
    newChecklist.key = checklistKey;

    // this version of the checklist will hold an array with just the ONE location
    newChecklist.locations = [location];

    // sort the days to repeat
    newChecklist.daysToRepeat.sort(sortDaysOfWeek);

    // add to the firebase updates
    checklist.roles.forEach(role => {
      // generate the path based on location and role
      let path = "/checklists/" + location + "/" + role + "/" + checklistKey;
      firebaseUpdates[path] = newChecklist;
    });
  });

  // make the firebase call
  firebase
    .database()
    .ref()
    .update(firebaseUpdates)
    .then(response => {
      notification.success({
        message: "SUCCESS",
        description: "Your checklist has been successfully saved."
      });
    })
    .catch(error => {
      notification.error({
        message: "ERROR",
        description: error.message
      });
    });
}
