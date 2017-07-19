import React, { Component } from "react";
import TopNavBar from "../components/TopNavBar.js";
import DynamicInput from "../components/DynamicInput.js";
import DynamicHeaders from "../components/DynamicHeaders.js";
import DraggableInputs from "../components/DraggableInputs.js";
import NewDynamicHeaders from "../components/NewDynamicHeaders.js";

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

const testFields = [
  {
    field: "shortDescription",
    prompt: "Short Description:"
  },
  {
    field: "longDescription",
    prompt: "Please enter a more detailed description here:"
  }
];

const testData = [
  {
    shortDescription: "Do the laundry",
    longDescription: "Open the hatch, throw in a laundry pod."
  },
  {
    shortDescription: "Clean the grill",
    longDescription: "Throw some alcohol on there and start a fire"
  }
];

export default class CreateOrEditChecklist extends Component {
  render() {
    return (
      <div>
        <TopNavBar
          className="horizontal"
          tabs={tabs}
          currentURL="/createchecklist"
        />
        <p> Create or Edit! </p>
        <NewDynamicHeaders fields={testFields} />
      </div>
    );
  }
}
