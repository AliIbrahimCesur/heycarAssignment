import logo from "./logo.svg";
import "./App.css";
import bbrand from "../src/Assets/icons/bbrand.png";
import filter from "../src/Assets/icons/filter.png";
import React, { useState } from "react";
import Navbar from "./pages/Navbar";
import MainPage from "./pages/MainPage";

const App = () => {
  return (
    <div className="App">
      <Navbar />
      <MainPage />
    </div>
  );
};

export default App;
