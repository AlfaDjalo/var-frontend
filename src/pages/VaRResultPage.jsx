import React, { useEffect } from "react";
import { useApp } from "../context/AppContext";
import { runVaR } from "../services/runVaR";

import VaRResultPanel from "../components/VaRResultPanel";
// import PnLHistogram from "../components/PnLHistogram";
import "../styles/VaRResultsPage.css";

function VaRResultsPage() {
  const { state, dispatch } = useApp();

  // const result = state.var.result;
  const { result } = state.var;
  const { loading, error } = state.ui;

  useEffect(() => {
    if (!result) {
      runVaR(state, dispatch);
    }
  }, []);

  if (loading) {
    return (
      <div className="bb-container">
        <h2>Running VaR...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bb-container">
        <h2 style={{ color: "red" }}>{error}</h2>
      </div>
    );
  }
  
  if (!result) {
    return (
      <div className="bb-container">
        <h2>No results</h2>
      </div>
    );
  }

  const methodLabel = {
    parametric: "Parametric VaR",
    histsim: "Historical Simulation VaR",
    montecarlo: "Monte Carlo VaR",
  }[state.var.method];

  return (
    <div className="bb-container">

      {/* HEADER */}
      <div className="bb-header">
        <div>
          <h1>VaR Results</h1>
          <div className="bb-subtitle">
            Results for {methodLabel}
          </div>
        </div>
      </div>

      {/* METRICS STRIP */}
      <div className="bb-metrics-strip">
        <VaRResultPanel
          varResult={result}
          varMethod={state.var.method}
          assets={state.data.assets}
        />
      </div>

      {/* <div className="bb-grid">

        <div className="bb-panel bb-chart-panel">
          <div className="bb-panel-title">
            PnL Distribution
          </div>

          {result.diagnostics?.pnls && (
            <PnLHistogram
              pnls={result.diagnostics.pnls}
              varDollar={result.varDollars}
            />
          )}
        </div>

        <div className="bb-panel">
          <div className="bb-panel-title">
            Diagnostics
          </div>

          <DiagnosticsBlock result={result} />
        </div>

      </div> */}
    </div>
  );
}

export default VaRResultsPage;


// /* -------- Diagnostics helper -------- */

// function DiagnosticsBlock({ result }) {
//   const d = result.diagnostics || {};

//   return (
//     <div className="bb-diagnostics">

//       <DiagRow
//         label="Model"
//         value={d.model || "-"}
//       />

//       <DiagRow
//         label="Confidence Level"
//         value={d.confidence_level
//           ? `${(1 - d.confidence_level) * 100}% tail`
//           : "-"}
//       />

//       <DiagRow
//         label="Simulations"
//         value={d.n_sims || "-"}
//       />

//       <DiagRow
//         label="Random Seed"
//         value={d.random_seed ?? "None"}
//       />

//     </div>
//   );
// }

// function DiagRow({ label, value }) {
//   return (
//     <div className="bb-diag-row">
//       <span>{label}</span>
//       <span>{value}</span>
//     </div>
//   );
// }
