import { notification } from "antd";

export default function loginValidation(loginInfo) {
  let errors = [];
  if (loginInfo.email === "") {
    errors.push("Email field was empty.");
  }
  if (loginInfo.password === "") {
    errors.push("Password field was empty.");
  }

  if (errors.length === 0) {
    return true;
  }

  errors.map(error => {
    notification.error({
      message: "ERROR",
      description: error,
      duration: 2
    });
  });

  return false;
}
