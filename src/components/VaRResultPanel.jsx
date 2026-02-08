import React from "react";
import PnLHistogram from "./PnLHistogram";
import "../styles/varResults.css";


/* -------------------- */
/* Stat Cards */
/* -------------------- */

function StatCard({ label, value }) {
  return (
    <div className="var-card">
      <div className="var-card-label">{label}</div>
      <div className="var-card-value">{value}</div>
    </div>
  );
}


/* -------------------- */
/* Helpers */
/* -------------------- */

const formatValue = (value) => {
  if (value === null || value === undefined) return "-";

  if (typeof value === "number") {
    if (Math.abs(value) < 1) return value.toFixed(4);
    return value.toLocaleString(undefined, { maximumFractionDigits: 4 });
  }

  if (typeof value === "boolean") return value ? "Yes" : "No";

  if (typeof value === "string") return value;

  return String(value);
};

const shouldHideKey = (key) => {
  if (typeof key !== "string") return false;

  const k = key.toLowerCase();
  return k.includes("pnl") || k.includes("matrix");
};


/* -------------------- */
/* Generic Renderer */
/* -------------------- */

function KeyValueTable({ data }) {
  if (!data || typeof data !== "object") return null;

  return (
    <div className="bb-diag-table">
      {Object.entries(data)
        .filter(([key]) => !shouldHideKey(key))
        .map(([key, value]) => (
          <div className="bb-diag-row" key={key}>
            <span className="bb-diag-key">{key}</span>

            {typeof value === "object" && value !== null ? (
              <div className="bb-diag-nested">
                <KeyValueTable data={value} />
              </div>
            ) : (
              <span className="bb-diag-value">
                {formatValue(value)}
              </span>
            )}
          </div>
        ))}
    </div>
  )
}

// function DiagRow({ label, value }) {
//   return (
//     <div className="bb-diag-row">
//       <span>{label}</span>
//       <span>{value}</span>
//     </div>
//   )
// }

/* -------------------- */
/* Diagnostics Section */
/* -------------------- */

function DiagnosticsBlock({ diagnostics }) {
  if (!diagnostics) return null;

  return (
    <div className="bb-diagnostics">
      {Object.entries(diagnostics)
        .filter(([key]) => key !== "pnls")
        .map(([section, content]) => (
          <div className="bb-panel" key={section}>
            <div className="bb-panel-title">{section}</div>

            <KeyValueTable data={content} />
          </div>
        ))
      }
    </div>
  );
}




      {/* <DiagRow label="Model" value={diagnostics.model || "-"} />

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
      /> */}
//     </div>
//   );
// }

function VaRResultPanel({ varResult }) {
  if (!varResult) return null;

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

        {console.log(varResult.diagnostics)}
        <DiagnosticsBlock
          diagnostics={varResult.diagnostics}
        />
      </div>
    </div>
  );
}

export default VaRResultPanel;
