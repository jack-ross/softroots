export default function convertLocationForFirebasePath(location) {
  switch (location) {
    case "Charlottesville, VA":
      return "charlottesville_va";
    case "Newark, DE":
      return "newark_de";
    default:
      return location;
  }
}
