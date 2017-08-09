import convertChecklistSchema from "./convertChecklistSchema.js";
import getDayOfWeek from "./getDayOfWeek.js";
import createChecklistsUsingEndTimes from "./createChecklistsUsingEndTimes.js";

// this method takes in ALL the checklist schemas in firebase
// and searches through them to check which ones should repeat
// based on today's day (i.e. "Monday")

export default function(checklistSchemas, dateKey) {
  // get the day of the week (i.e. "Monday")
  let dayOfWeek = getDayOfWeek("America/New_York", dateKey);

  // object holding all the checklist copies with their new keys
  let allChecklistCopies = {};

  // go through each location
  let locations = Object.keys(checklistSchemas);
  locations.map(location => {
    // first, create those location keys and values in allChecklistCopies
    allChecklistCopies[location] = {};
    // within each location, go through each role
    let roles = Object.keys(checklistSchemas[location]);
    roles.map(role => {
      // add that role to the allChecklistCopies
      allChecklistCopies[location][role] = {};

      // within each role, go through each checklist, determine if it's
      // to be repeated today, and if so, keep it and use convertChecklistSchema
      // to update its subtasks with the isCompleted field
      let checklistKeys = Object.keys(checklistSchemas[location][role]);
      checklistKeys.map(checklistKey => {
        let checklistSchema = checklistSchemas[location][role][checklistKey];
        if (checklistSchema.daysToRepeat.includes(dayOfWeek)) {
          let checklistCopies = createChecklistsUsingEndTimes(checklistSchema);
          checklistCopies.map(checklist => {
            allChecklistCopies[location][role][
              checklist.key
            ] = convertChecklistSchema(checklist);
          });
        }
      });
    });
  });
  return allChecklistCopies;
}
