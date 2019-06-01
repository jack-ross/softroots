// takes in an endTime object with hours, minutes, and amPM fields and converts to military
// time object with just hours and minutes.  used in compareEndTimes to sort time easier

export default function(endTimeObject = {}) {
  let amPm = endTimeObject.amPm;
  let hours = parseInt(endTimeObject.hours, 10);
  let minutes = parseInt(endTimeObject.minutes, 10);

  if (amPm === "AM") {
    // for AM case, just need to convert 12 to 0, otherwise we're good
    if (hours === 12) {
      hours = 0;
    }
  } else {
    // for PM case, add 12 to any hour figure EXCEPT 12 PM
    if (!(hours === 12)) {
      hours += 12;
    }
  }

  let militaryTimeObject = {
    hours: hours,
    minutes: minutes
  };
  return militaryTimeObject;
}
