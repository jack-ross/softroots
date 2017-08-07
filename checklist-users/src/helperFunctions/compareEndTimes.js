import convertEndTimeToMilitaryTime from "./convertEndTimeToMilitaryTime.js";

export default function compareEndTimes(endTime1, endTime2) {
  let militaryTime1 = convertEndTimeToMilitaryTime(endTime1);
  let militaryTime2 = convertEndTimeToMilitaryTime(endTime2);

  console.log(militaryTime1);
  console.log(militaryTime2);
}
