import React, { Component } from "react";
import { Switch, Route } from "react-router";
import { BrowserRouter } from "react-router-dom";
import { Icon, Modal, notification } from "antd";
import Home from "./pages/Home.js";
import CreateAccount from "./pages/CreateAccount.js";
import Login from "./pages/Login.js";
import ViewChecklists from "./pages/ViewChecklists.js";
import "./App.css";

import firebase from "./configs/firebaseConfig.js";

const testUser = {
  role: "Grill"
};

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
    // if user is logged in, always have a signout button up top
    let signOut = <div />;
    if (this.state.userInfo) {
      signOut = (
        <div style={{ textAlign: "right", padding: "5%" }}>
          <Icon
            style={{ cursor: "pointer", fontSize: 30 }}
            type="logout"
            onClick={() => this.onClickSignOut()}
          />
        </div>
      );
    }
    return (
      <div className="App">
        {signOut}
        <BrowserRouter>
          <Switch>
            <Route
              exact
              path="/"
              component={() => <Home userInfo={this.state.userInfo} />}
            />
            <Route
              exact
              path="/create-account"
              component={() => <CreateAccount userInfo={this.state.userInfo} />}
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
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
