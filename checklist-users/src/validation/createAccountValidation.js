import { notification } from "antd";

export default function createAccountValidation(userInfo) {
  let errors = [];

  // make sure all of the inputs are filled in
  Object.keys(userInfo).map(key => {
    switch (key) {
      case "firstName":
        if (userInfo[key] === "") {
          errors.push("First name is required.");
        }
        break;
      case "lastName":
        if (userInfo[key] === "") {
          errors.push("Last name is required.");
        }
        break;
      case "email":
        if (userInfo[key] === "") {
          errors.push("Email is required.");
        }
        break;
      case "password":
        if (userInfo[key] === "") {
          errors.push("Password is required.");
        }
        break;
      case "passwordRepeated":
        if (userInfo[key] === "") {
          errors.push("Repeated Password is required.");
        }
        break;
      case "location":
        if (userInfo[key] === "") {
          errors.push("Location is required.");
        }
        break;
      case "role":
        if (userInfo[key] === "") {
          errors.push("Role is required.");
        }
        break;
      default:
        errors.push(
          "There was an unexpected error in processing your request."
        );
    }
  });

  // make sure the two password inputs are equal
  if (userInfo.password !== userInfo.passwordRepeated) {
    errors.push("The two passwords do not match.");
  }

  // if no errors, return true
  if (errors.length === 0) {
    return true;
  }

  // else, display error notifications and return false
  errors.map(error => {
    notification.error({
      message: "ERROR",
      description: error,
      duration: 2
    });
  });

  return false;
}
