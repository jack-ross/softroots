// this function takes in a value (integer 1-5) and returns a string
// representing the CSS color associated with that value

const colors = {
  required: "#AE0000",
  completed: "#AE0000",
}

export default function(value) {
  switch (value) {
    case 1:
      return "#ef7b75";
      break;
    case 2:
      return "#dd8a82";
      break;
    case 3:
      return "#d8b168";
      break;
    case 4:
      return "#e0da86";
      break;
    case 5:
      return "#b4f4b0";
      break;
    default:
      return "";
  }
}
