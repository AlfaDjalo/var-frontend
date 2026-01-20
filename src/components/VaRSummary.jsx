// src/components/VaRSummary.jsx
import React from "react";

const VaRSummary = ({
  portfolioValue,
  varDollars,
  varPercent,
  volatilityPercent,
}) => {
  console.log(portfolioValue);
  console.log(varDollars);
  console.log(varPercent);
  console.log(volatilityPercent);
  if (
    portfolioValue == null ||
    varDollars == null ||
    varPercent == null ||
    volatilityPercent == null
  ) {
    return <div>No VaR results available.</div>;
  }

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
