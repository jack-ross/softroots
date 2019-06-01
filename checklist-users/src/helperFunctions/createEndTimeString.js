// this function takes in an endTime object with hours, minutes, and amPm fields and converts
// it to the format "9:15 PM" for example

export default function(endTime = {}) {
  let hours = endTime.hours;
  let minutes = endTime.minutes;
  let amPm = endTime.amPm;
  return hours + ":" + minutes + " " + amPm;
}
