export default class ChecklistValidation {
  validateChecklist(checklistObj) {
    let errorsAndWarnings = {
      errors: [],
      warnings: []
    };

    // check title and description are nonempty strings
    if (checklistObj.title === "") {
      errorsAndWarnings.errors.push("ERROR: Checklist Title is empty.");
    }
    if (checklistObj.description === "") {
      errorsAndWarnings.errors.push("ERROR: Checklist Description is empty.");
    }

    // go through the subsections and make sure everything's ok and non-empty
    if (!this.validateSubsections(checklistObj.subsections)) {
      errorsAndWarnings.errors.push(
        "ERROR: All fields in subsections are required."
      );
    }

    // throw warning (but not error) if checklist is not repeating.  if any part of them ARE filled in,
    // then make sure ALL parts are filled in (otherwise return an error message)
    if (
      checklistObj.daysToRepeat.length === 0 &&
      checklistObj.endTimes.length === 0
    ) {
      errorsAndWarnings.warnings.push(
        "WARNING: You did not specify to automatically repeat this checklist.  Please be sure this is what you want."
      );
    } else {
      // if user requested end times but not days
      if (checklistObj.daysToRepeat.length === 0) {
        errorsAndWarnings.errors.push(
          "ERROR: You specified times to repeat, but not which days."
        );
      }
      // if user requested days but not end times
      if (checklistObj.endTimes.length === 0) {
        errorsAndWarnings.errors.push(
          "ERROR: You specified days to repeat, but not end times."
        );
      }
      // make sure all the time fields are filled out
      checklistObj.endTimes.map(timeObj => {
        if (
          !this.areObjectFieldsNonEmpty(timeObj, ["hours", "minutes", "amPm"])
        ) {
          errorsAndWarnings.errors.push(
            "ERROR: Please fill out ALL fields for End Times."
          );
        }
      });
    }
    // make sure role and locations are filled out
    if (checklistObj.role === "") {
      errorsAndWarnings.errors.push("ERROR: Please select a role.");
    }
    if (checklistObj.locations.length === 0) {
      errorsAndWarnings.errors.push(
        "ERROR: Please select at least one location."
      );
    }

    return errorsAndWarnings;
  }

  validateSubsections(subsections) {
    if (subsections.length === 0) {
      return false;
    }
    let areSubsectionsNonEmpty = true;
    subsections.map(subsection => {
      // first make sure subtasks array is non-empty
      if (!this.isNonEmptyArray(subsection.subtasks)) {
        areSubsectionsNonEmpty = false;
      }

      // check the subsection title is valid
      if (subsection.title === "") {
        areSubsectionsNonEmpty = false;
      }

      // map over subtasks and make sure their fields are non-empty as well
      subsection.subtasks.map(subtask => {
        if (
          !this.areObjectFieldsNonEmpty(subtask, [
            "shortDescription",
            "longDescription"
          ])
        ) {
          areSubsectionsNonEmpty = false;
        }
      });
    });
    return areSubsectionsNonEmpty;
  }

  isNonEmptyArray(array) {
    return array.length !== 0;
  }

  areObjectFieldsNonEmpty(obj, fields) {
    let returnBool = true;
    fields.map(field => {
      if (obj[field] === "") {
        returnBool = false;
      }
    });
    return returnBool;
  }
}
