import firebase from "../configs/firebaseConfig";
import { notification } from "antd";

export default function(firebasePath, commentObj) {
  firebase.database().ref(firebasePath).push(commentObj).catch(error => {
    notification.error({
      message: "ERROR",
      description: error.message
    });
  });
}
