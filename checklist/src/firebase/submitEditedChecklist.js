import createDisjointArrays from "../helperFunctions/createDisjointArrays.js";

export default function submitEditedChecklist(
  checklist,
  initialLocations,
  initialRole
) {
  // first, use helper function to create three disjoint arrays: original locations
  // no longer relevant, overlap between original locations and new locations, and finally
  // the new locations not originally present
  let disjointLocationArrays = createDisjointArrays(
    checklist.locations,
    initialLocations
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
    let path = "/" + location + "/" + initialRole + "/" + checklist.key;
    firebaseUpdates[path] = null;
  });

  // for exclusively new locations, go to that location and the current role and add
  // the checklist
  exclusiveNewLocations.map(location => {
    let path = "/" + location + "/" + currentRole + "/" + checklist.key;
    firebaseUpdates[path] = checklist;
  });

  // finally, for overlapping locations, compare the intitial role with current role;
  // if both the same, simply update the checklist at that spot in firebase.  else, delete
  // from original path and update in new path based on the change in role
  overlapLocations.map(location => {
    if (currentRole === initialRole) {
      let path = "/" + location + "/" + currentRole + "/" + checklist.key;
      firebaseUpdates[path] = checklist;
    } else {
      let pathToDelete =
        "/" + location + "/" + initialRole + "/" + checklist.key;
      firebaseUpdates[pathToDelete] = null;
      let pathToUpdate =
        "/" + location + "/" + initialRole + "/" + checklist.key;
      firebaseUpdates[pathToUpdate] = checklist;
    }
  });

  // make all the firebase calls
  console.log(firebaseUpdates);
}
