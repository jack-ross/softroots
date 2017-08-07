import firebase from "../configs/firebaseConfig.js";
import convertChecklistSchema from "./convertChecklistSchema.js";

export default function(checklistSchema) {
  // map through the checklists's endTimes and create copies of original checklist
  let arrayOfChecklists = checklistSchema.endTimes.map(endTime => {
    let checklistCopy = Object.assign({}, checklistSchema);
    // use firebase to create a new key for this checklist
    let key = firebase.database().ref().push().key;
    checklistCopy.key = key;

    // remove all the endTimes and just store the one endTime object in a new
    // endTime field
    delete checklistCopy.endTimes;
    checklistCopy.endTime = endTime;
    return checklistCopy;
  });
  return arrayOfChecklists;
}
