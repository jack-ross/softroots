import firebase from "../configs/firebaseConfig.js";

export default function submitChecklist(checklist) {
  let locationKeys = checklist.locations;

  // create a unique key that will be reused across locations and put it in the state as well
  let checklistKey = firebase.database().ref().push().key.toString();
  checklist.key = checklistKey;

  // finally, at each location in firebase, update that checklist with the key
  locationKeys.map(locationKey => {
    let path =
      "/checklists/" + locationKey + "/" + checklist.role + "/" + checklistKey;
    firebase.database().ref(path).set(checklist);
  });
}
