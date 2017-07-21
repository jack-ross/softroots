import React, { Component } from "react";

export default class PleaseLogin extends Component {
  render() {
    return (
      <div>
        <p>
          {" "}You cannot access this page without
          <a href="/"> logging in. </a>
        </p>
      </div>
    );
  }
}
