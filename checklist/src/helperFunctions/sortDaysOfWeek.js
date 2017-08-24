// sorting function for an array holding the days of the week.  converts the days to numbers
// and sorts from there.  assumes Monday is beginning of the week
export default function(day1, day2) {
  let day1AsNumber = convertDayToNumber(day1);
  let day2AsNumber = convertDayToNumber(day2);
  return day1AsNumber - day2AsNumber;
}

function convertDayToNumber(day) {
  switch (day) {
    case "Monday":
      return 0;
    case "Tuesday":
      return 1;
    case "Wednesday":
      return 2;
    case "Thursday":
      return 3;
    case "Friday":
      return 4;
    case "Saturday":
      return 5;
    case "Sunday":
      return 6;
  }
}
