// this method is already deprecated.  despite being one of the cooler problems to solve, after
// further consultation, once a checklist has been created for multiple locations, each one will
// now be edited as a single entity rather than across multiple locations

import createDisjointArrays from "../helperFunctions/createDisjointArrays.js";
import firebase from "../configs/firebaseConfig.js";
import { notification } from "antd";
import sortDaysOfWeek from "../helperFunctions/sortDaysOfWeek.js";

export default function submitEditedChecklist(
  checklist,
  initialLocations,
  initialRole
) {
  // first, clean up locations to the proper strings (i.e. charlottesville_va)
  // still hardcoded in for Roots
  let locationKeys = checklist.locations;

  // sort the checklist's days of the week
  checklist.daysToRepeat.sort(sortDaysOfWeek);

  // first, use helper function to create three disjoint arrays: original locations
  // no longer relevant, overlap between original locations and new locations, and finally
  // the new locations not originally present
  let disjointLocationArrays = createDisjointArrays(
    initialLocations,
    locationKeys
  );

  let exclusiveInitialLocations = disjointLocationArrays.disjointFirstArray;
  let exclusiveNewLocations = disjointLocationArrays.disjointSecondArray;
  let overlapLocations = disjointLocationArrays.overlap;

  let currentRole = checklist.role;

  // this object will keep track of ALL the updates that will need to be performed
  // using firebase's update() method; the keys are the firebase paths and the values
  // are either the checklist (if data is being stored at that path) or null (if deleting
  // data from that path)
  let firebaseUpdates = {};

  // for exclusively old locations, go to that location and the initial role and
  // delete checklist
  exclusiveInitialLocations.map(location => {
    let path =
      "/checklists/" + location + "/" + initialRole + "/" + checklist.key;
    firebaseUpdates[path] = null;
  });

  // for exclusively new locations, go to that location and the current role and add
  // the checklist
  exclusiveNewLocations.map(location => {
    let path =
      "/checklists/" + location + "/" + currentRole + "/" + checklist.key;
    firebaseUpdates[path] = checklist;
  });

  // finally, for overlapping locations, compare the intitial role with current role;
  // if both the same, simply update the checklist at that spot in firebase.  else, delete
  // from original path and update in new path based on the change in role
  overlapLocations.map(location => {
    if (currentRole === initialRole) {
      let path =
        "/checklists/" + location + "/" + currentRole + "/" + checklist.key;
      firebaseUpdates[path] = checklist;
    } else {
      let pathToDelete =
        "/checklists/" + location + "/" + initialRole + "/" + checklist.key;
      firebaseUpdates[pathToDelete] = null;
      let pathToUpdate =
        "/checklists/" + location + "/" + currentRole + "/" + checklist.key;
      firebaseUpdates[pathToUpdate] = checklist;
    }
  });

  // make all the firebase calls
  firebase
    .database()
    .ref()
    .update(firebaseUpdates)
    .then(response => {
      notification.success({
        message: "Changes Saved",
        description: "Your changes were successfully saved."
      });
    })
    .catch(error => {
      notification.error({
        message: "ERROR",
        description: "Firebase error: " + error
      });
    });
}
