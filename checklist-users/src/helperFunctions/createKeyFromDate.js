let moment = require("moment-timezone");

/* PARAMETERS
    timeZone: string; the desired timezone as permitted by moment-timezone; used to find the current
      time in the relevant time zone to decide what date to return (for now, all locations are EST, or
      "America/New_York")
*/

export default function(timeZone) {
  let dateISOString = moment().tz(timeZone).format();
  let dayMonthYearString = dateISOString.substring(0, 10); // formatted as YYYY-MM-DD
  return dayMonthYearString;
}
