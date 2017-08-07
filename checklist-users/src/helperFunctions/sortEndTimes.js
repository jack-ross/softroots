import convertEndTimeToMilitaryTime from "./convertEndTimeToMilitaryTime.js";

export default function(endTime1, endTime2) {
  let militaryTime1 = convertEndTimeToMilitaryTime(endTime1);
  let militaryTime2 = convertEndTimeToMilitaryTime(endTime2);
  // first compare based on the hours
  if (militaryTime1.hours < militaryTime2.hours) {
    return -1;
  }
  if (militaryTime1.hours > militaryTime2.hours) {
    return 1;
  }

  // if hours are same, compare based on the minutes
  if (militaryTime1.minutes < militaryTime2.minutes) {
    return -1;
  }
  if (militaryTime1.minutes > militaryTime2.minutes) {
    return 1;
  }

  // minutes and hours the same, return 0
  return 0;
}
