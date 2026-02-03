import React from "react";
import VaRResultPanel from "../components/VaRResultPanel";

export default function VaRResultPage({ varResult, loading, error, calculateVaR }) {
  return (
    <div>
      <button onClick={calculateVaR} disabled={loading}>
        {loading ? "Calculating…" : "Calculate VaR"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <VaRResultPanel varResult={varResult} />
    </div>
  );
}
