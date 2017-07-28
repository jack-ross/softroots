import React, { Component } from "react";
import { Switch, Route } from "react-router";
import { BrowserRouter } from "react-router-dom";
import Home from "./pages/Home.js";
import CreateAccount from "./pages/CreateAccount.js";
import Login from "./pages/Login.js";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <div className="App">
            <Switch>
              <Route exact path="/" component={() => <Home />} />
              <Route
                exact
                path="/create-account"
                component={() => <CreateAccount />}
              />
              <Route exact path="/login" component={() => <Login />} />
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
