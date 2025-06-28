import React from "react";
import "./LoadingScreen.css";

export default function LoadingScreen() {
  return (
    <div className="loading-screen">
      <img src="/popcorntimelogo.png" alt="Popcorn Time Logo" className="loading-logo" />
      <div className="spinner"></div>
      <h1 className="loading-text">Loading...</h1>
    </div>
  );
}
