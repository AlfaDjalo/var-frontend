// src/components/VaRSummary.jsx
import React from "react";

const VaRSummary = ({
  portfolioValue,
  varDollars,
  varPercent,
  volatilityPercent,
}) => {
  return (
    <div>
      <h3>VaR Summary</h3>
      <p><strong>Portfolio value:</strong> ${portfolioValue.toFixed(2)}</p>
      <p><strong>VaR ($):</strong> ${varDollars.toFixed(2)}</p>
      <p><strong>VaR (%):</strong> {(varPercent * 100).toFixed(2)}%</p>
      <p><strong>Volatility (%):</strong> {(volatilityPercent * 100).toFixed(2)}%</p>
    </div>
  );
};

export default VaRSummary;
