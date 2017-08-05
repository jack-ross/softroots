import convertChecklistSchema from "./convertChecklistSchema.js";
import getDayOfWeek from "./getDayOfWeek.js";

// this method takes in ALL the checklist schemas in firebase
// and searches through them to check which ones should repeat
// based on today's day (i.e. "Monday")

export default function(allChecklists) {
  // get the day of the week (i.e. "Monday")
  let dayOfWeek = getDayOfWeek("America/New_York");

  // go through each location
  let locations = Object.keys(allChecklists);
  locations.map(location => {
    // within each location, go through each role
    let roles = Object.keys(allChecklists[location]);
    roles.map(role => {
      // within each role, go through each checklist, determine if it's
      // to be repeated today, and if so, keep it and use convertChecklistSchema
      // to update its subtasks with the isCompleted field
      let checklistKeys = Object.keys(allChecklists[location][role]);
      checklistKeys.map(checklistKey => {
        let checklist = allChecklists[location][role][checklistKey];
        if (checklist.daysToRepeat.includes(dayOfWeek)) {
          allChecklists[location][role][checklistKey] = convertChecklistSchema(
            checklist
          );
        } else {
          allChecklists[location][role][checklistKey] = null;
        }
      });
    });
  });
  return allChecklists;
}
