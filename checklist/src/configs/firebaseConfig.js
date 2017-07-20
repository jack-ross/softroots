import * as firebase from "firebase";

let config = {
  apiKey: "AIzaSyB0wD3AO99WXoD8vUCvcSSfzJD0bWLik5k",
  authDomain: "softroots-47db8.firebaseapp.com",
  databaseURL: "https://softroots-47db8.firebaseio.com",
  projectId: "softroots-47db8",
  storageBucket: "softroots-47db8.appspot.com",
  messagingSenderId: "980329113855"
};

export default firebase.initializeApp(config);
