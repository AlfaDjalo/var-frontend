import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

import "../styles/HomePage.css";

function HomePage() {
  const { state } = useApp();
  const navigate = useNavigate();

  const datasetName = state.data?.datasetName;
  const varMethod = state.var?.method;
  const positions = state.portfolio?.positions || {};

  // Simple portfolio summary: if no positions, show default
  const portfolioSummary =
    Object.keys(positions).length > 0 ? `${Object.keys(positions).length} positions` : "User portfolio";

  const varRan = !!state.var?.result;
  const readyToRun = datasetName && varMethod && Object.keys(positions).length > 0;

  return (
    <div className="home-container">
      <h1>VaR Dashboard</h1>

      <div className="steps-container">
        <button
          className="step-btn"
          onClick={() => navigate("/load-data")}
          aria-label="Load Data"
        >
          Load Data
          <div className="step-status">{datasetName || "Not loaded"}</div>
        </button>

        <button
          className="step-btn"
          onClick={() => navigate("/settings")}
          aria-label="VaR Settings"
        >
          VaR Settings
          <div className="step-status">
            {varMethod ? varMethod.charAt(0).toUpperCase() + varMethod.slice(1) : "Not set"}
          </div>
        </button>

        <button
          className="step-btn"
          onClick={() => navigate("/portfolio")}
          aria-label="Portfolio"
        >
          Portfolio
          <div className="step-status">{portfolioSummary}</div>
        </button>
      </div>

      <div className="run-var-section">
        <button
          className="run-var-btn"
          disabled={!readyToRun}
          aria-disabled={!readyToRun}
          onClick={() => navigate("/results")}
        >
          Run VaR
        </button>
        <div className="run-status">
          {varRan ? "VaR calculation completed" : "VaR not run yet"}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
