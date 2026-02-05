import React from "react";
import PnLHistogram from "./PnLHistogram";
import "../styles/varResults.css";

function StatCard({ label, value }) {
  return (
    <div className="var-card">
      <div className="var-card-label">{label}</div>
      <div className="var-card-value">{value}</div>
    </div>
  );
}

function DiagRow({ label, value }) {
  return (
    <div className="bb-diag-row">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  )
}

function DiagnosticsBlock({ diagnostics }) {
  if (!diagnostics) return null;

  return (
    <div className="bb-diagnostics">
      <DiagRow label="Model" value={diagnostics.model || "-"} />

      <DiagRow
        label="Confidence Level"
        value={
          diagnostics.confidence_level
            ? `${(1 - diagnostics.confidence_level) * 100}% tail`
            : "-"
        }
      />

      <DiagRow label="Simulations" value={diagnostics.n_sims || "-"} />

      <DiagRow
        label="Random Seed"
        value={diagnostics.random_seed ?? "None"}
      />
    </div>
  );
}

function VaRResultPanel({ varResult }) {
  const pnls = varResult.diagnostics?.pnls ?? [];

  return (
    <div className="var-results-wrapper">

      <div className="var-stats-row">
        <StatCard
          label="Portfolio Value"
          value={`$${varResult.portfolioValue.toFixed(2)}`}
        />

        <StatCard
          label="VaR ($)"
          value={`$${varResult.varDollars.toFixed(2)}`}
        />

        <StatCard
          label="VaR (%)"
          value={`${(varResult.varPercent * 100).toFixed(2)}%`}
        />
      </div>

      {pnls.length > 0 && (
        <PnLHistogram
          pnls={pnls}
          varDollars={varResult.varDollars}
        />
      )}

      <div className="bb-panel">
        <div className="bb-panel-title">
          Diagnostics
        </div>

        <DiagnosticsBlock
          diagnostics={varResult.diagnostics}
        />
      </div>
    </div>
  );
}

export default VaRResultPanel;
