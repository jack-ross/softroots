import React, { Component } from "react";
import { Switch, Route } from "react-router";
import { BrowserRouter } from "react-router-dom";
import { Modal, notification } from "antd";

import Header from "./components/Header.js";

// pages for routing
import Home from "./pages/Home.js";
import CreateAccount from "./pages/CreateAccount.js";
import Login from "./pages/Login.js";
import ViewChecklists from "./pages/ViewChecklists.js";
import Profile from "./pages/Profile.js";

import "./App.css";

import firebase from "./configs/firebaseConfig.js";

// functions for day of the week and Date Key for firebase
import checkAndUpdateDailyLists from "./firebase/checkAndUpdateDailyLists.js";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: undefined
    };
  }

  componentWillMount() {
    // check if the user is logged in and update state accordingly
    let auth = firebase.auth();
    auth.onAuthStateChanged(user => {
      if (user) {
        firebase
          .database()
          .ref("/users/verified/" + user.uid)
          .once("value", snapshot => {
            this.setState({
              ...this.state,
              userInfo: snapshot.val()
            });
          });
      } else {
        this.setState({
          ...this.state,
          userInfo: undefined
        });
      }
    });

    // also, update daily lists if needed
    checkAndUpdateDailyLists();
  }

  onClickSignOut() {
    Modal.confirm({
      title: "Sign Out?",
      content: "Are you sure you want to sign out?",
      okText: "Sign Out",
      cancelText: "Cancel",
      onOk: () => this.signOut(),
      onCancel: () => {}
    });
  }

  signOut() {
    firebase
      .auth()
      .signOut()
      .then(() => {
        notification.success({
          message: "Success",
          description: "User successfully logged out.",
          duration: 2
        });
      })
      .catch(error => {
        notification.error({
          message: "ERROR",
          description: error
        });
      });
  }

  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <div style={{ height: "100%", width: "100%" }}>
            {this.state.userInfo &&
              <Header onClickSignOut={() => this.onClickSignOut()} />}
            <Switch>
              <Route
                exact
                path="/"
                component={() => <Home userInfo={this.state.userInfo} />}
              />
              <Route
                exact
                path="/create-account"
                component={() =>
                  <CreateAccount userInfo={this.state.userInfo} />}
              />
              <Route
                exact
                path="/login"
                component={() => <Login userInfo={this.state.userInfo} />}
              />
              <Route
                exact
                path="/viewchecklists"
                component={() =>
                  <ViewChecklists userInfo={this.state.userInfo} />}
              />
              <Route
                exact
                path="/profile"
                component={() => <Profile userInfo={this.state.userInfo} />}
              />
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
