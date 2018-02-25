// takes in the checklist schema object and returns a cleaned up version where
// each subtask has an isCompleted field for that day

export default function(checklist, checklistKey) {
  let subsections = checklist.subsections;
  let convertedSubsections = subsections.map(subsection => {
    let convertedSubtasks = subsection.subtasks.map(subtask => {
      subtask.isCompleted = false;
      return subtask;
    });
    subsection.subtasks = convertedSubtasks;
    return subsection;
  });
  checklist.subsections = convertedSubsections;
  checklist.isMarkedCompleted = false;
  checklist.templateKey = checklistKey;
  return checklist;
}
