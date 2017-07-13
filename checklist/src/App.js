import React, { Component } from "react";
import { Switch, Route } from "react-router";
import { BrowserRouter } from "react-router-dom";
import TopNavBar from "./components/TopNavBar.js";
import DropdownSelection from "./components/DropdownSelection.js";

import CreateOrEditChecklist from "./pages/CreateOrEditChecklist.js";
import Home from "./pages/Home.js";
import UserManagement from "./pages/UserManagement.js";
import ViewChecklists from "./pages/ViewChecklists.js";

import "./App.css";

const tabs = [
  {
    name: "Home",
    url: "/"
  },
  {
    name: "Create a Checklist",
    url: "/createchecklist"
  },
  {
    name: "View Current Checklists",
    url: "/viewchecklists"
  },
  {
    name: "Manage Users",
    url: "/users"
  }
];

class App extends Component {
  onClick(value) {
    console.log(value);
  }

  /*
  render() {
    return (
      <div className="App">
        <TopNavBar className={""} tabs={""} currentURL="/" />
        <DropdownSelection
          defaultText="Choose a player"
          dropdownValues={["link", "mario", "zelda"]}
          onClickField={value => this.onClick(value)}
        />
      </div>
    );
  }
  */

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route
              exact
              path="/createchecklist"
              component={CreateOrEditChecklist}
            />
            <Route exact path="/viewchecklists" component={ViewChecklists} />
            <Route exact path="/users" component={UserManagement} />
            <Route
              render={function() {
                return <p>Not Found</p>;
              }}
            />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
