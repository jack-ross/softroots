/* PARAMETERS
    timeZone: string; the desired timezone as permitted by moment-timezone; used to find the current
      time in the relevant time zone to decide what date to return (for now, all locations are EST, or
      "America/New_York")
*/

export default function(timeZone, dayMonthYearString) {
  // grab the year, month, and day
  let yearMonthDayArray = dayMonthYearString.split("-");
  let year = parseInt(yearMonthDayArray[0], 10);
  let month = parseInt(yearMonthDayArray[1], 10);
  let day = parseInt(yearMonthDayArray[2], 10);

  // create a date object (note month's are offset by 1 the Date constructor)
  let date = new Date(year, month - 1, day);

  // figure out the day of the week and return it as a string
  let dayOfWeek = date.getDay();
  switch (dayOfWeek) {
    case 0:
      return "Sunday";
    case 1:
      return "Monday";
    case 2:
      return "Tuesday";
    case 3:
      return "Wednesday";
    case 4:
      return "Thursday";
    case 5:
      return "Friday";
    case 6:
      return "Saturday";
    default:
      return null;
  }
}
