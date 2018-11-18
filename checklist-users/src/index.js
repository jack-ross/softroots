import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import LogRocket from "logrocket";

LogRocket.init("ybcdrn/softroots");

ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();
