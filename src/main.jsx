import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import LeftSidebar from "./components/leftSidebar.jsx";
import RightSidebar from "./components/rightSidebar.jsx";
import CustomHeader from "./components/customHeader.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CustomHeader />
    <LeftSidebar/>
    <RightSidebar />
    <App />
  </React.StrictMode>
);
