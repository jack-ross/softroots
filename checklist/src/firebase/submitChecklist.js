import firebase from "../configs/firebaseConfig.js";

export default function submitChecklist(checklist) {
  let locationKeys = [];
  // for now, the locations are hardcoded in for Roots
  checklist.locations.map(location => {
    switch (location) {
      case "Charlottesville, VA":
        locationKeys.push("charlottesville_va");
        break;
      case "Newark, DE":
        locationKeys.push("newark_de");
        break;
    }
  });

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
