// takes in a timezone (i.e. America/New_York) and returns a string
// of the current time formatted with AM/PM; example return is "9:15 PM"

let moment = require("moment-timezone");

export default function(timeZone) {
  // grab the current ISO in format "2013-11-18T11:55:00-05:00"
  let dateISOString = moment().tz(timeZone).format();
  let dateTimeArray = dateISOString.split("T");
  let timeString = dateTimeArray[1].slice(0, 5);

  // figure out if AM or PM
  let hour = parseInt(timeString.split(":")[0], 10);
  let minutes = timeString.split(":")[1];
  let amOrPm = " AM";
  if (hour > 11) {
    amOrPm = " PM";
    if (hour !== 12) {
      hour -= 12;
    }
  }

  // if 00:00 AM, set to 12:00 AM
  if (hour === 0) {
    hour = 12;
  }

  let finalTimeString = hour + ":" + minutes + amOrPm;
  return finalTimeString;
}
