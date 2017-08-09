// this function takes an endTime object and timeZone string and returns true if current time of day
// is past and false otherwise
import convertEndTimeToMilitaryTime from "./convertEndTimeToMilitaryTime.js";
let moment = require("moment-timezone");

export default function(endTime, timeZone) {
  // get the current time in requested time zone
  let currentDateString = moment.tz(timeZone).format();
  let currentTimeString = currentDateString.split("T")[1];
  currentTimeString = currentTimeString.split("-")[0];
  let currentTimeArray = currentTimeString.split(":");
  let currentMilitaryTime = {
    hours: currentTimeArray[0],
    minutes: currentTimeArray[1]
  };

  // convert the end time to military time
  let endTimeMilitary = convertEndTimeToMilitaryTime(endTime);

  // first compare based on the hours
  if (currentMilitaryTime.hours < endTimeMilitary.hours) {
    return false;
  }
  if (currentMilitaryTime.hours > endTimeMilitary.hours) {
    return true;
  }

  // if hours are same, compare based on the minutes
  if (currentMilitaryTime.minutes < endTimeMilitary.minutes) {
    return false;
  }
  if (currentMilitaryTime.minutes > endTimeMilitary.minutes) {
    return true;
  }

  // minutes and hours the same, return true
  return true;
}
