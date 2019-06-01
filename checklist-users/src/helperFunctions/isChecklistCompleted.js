// this function takes in a checklist from "/dailyLists" and loops through
// the subtasks to figure out if the checklist has been completed or not

export default function(checklist) {
  try {
    let returnBoolean = true;
    let subsections = checklist.subsections;
    subsections.map(subsection => {
      let subtasks = subsection.subtasks;
      subtasks.map(subtask => {
        if (!subtask.isCompleted) {
          returnBoolean = false;
        }
      });
    });
    return returnBoolean;
  } catch (e) {
    debugger;
  }
}
