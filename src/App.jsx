import React, { useEffect, useState } from "react";
import FileSelect from "./components/FileSelect";
import PositionsTable from "./components/PositionsTable";
import VaRSummary from "./components/VaRSummary";
import CorrelationMatrix from "./components/CorrelationMatrix";

function App() {
  const [datasetName, setDatasetName] = useState(null);
  const [assets, setAssets] = useState([]);
  const [positions, setPositions] = useState({});
  const [varResult, setVarResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  /* Inspect dataset when loaded */
  useEffect(() => {
    if (!datasetName) return;

    fetch(`${API_BASE_URL}/var-covar/inspect`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dataset_name: datasetName }),
    })
      .then((res) => res.json())
      .then((data) => {
        setAssets(data.assets);
        setPositions(Object.fromEntries(data.assets.map((a) => [a, 100])));
        setVarResult(null);
      })
      .catch(() => setError("Failed to inspect dataset"));
  }, [datasetName]);

  const calculateVaR = () => {
    if (!datasetName) {
      setError("Please load a dataset first.");
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`${API_BASE_URL}/var-covar/calculate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dataset_name: datasetName,
        confidence_level: 0.01,
        cov_window_days: 252,
        positions,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setVarResult({
          portfolioValue: data.portfolio_value,
          varDollars: data.var_dollars,
          varPercent: data.var_percent,
          volatilityPercent: data.volatility_percent,
          correlation_matrix: data.correlation_matrix,
        });
      })
      .catch(() => setError("VaR calculation failed"))
      .finally(() => setLoading(false));
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>VaR</h1>

      <FileSelect
        apiBaseUrl={API_BASE_URL}
        onDatasetLoaded={setDatasetName}
      />

      {assets.length > 0 && (
        <PositionsTable
          assets={assets}
          positions={positions}
          onHoldingChange={(a, v) =>
            setPositions((p) => ({ ...p, [a]: v }))
          }
        />
      )}

      <button onClick={calculateVaR} disabled={loading}>
        {loading ? "Calculating…" : "Calculate VaR"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {varResult && (
        <div style={{ display: "flex", gap: 24, marginTop: 24 }}>
          { console.log(varResult) }
          <VaRSummary {...varResult} />
          <CorrelationMatrix
            corrMatrix={varResult.correlation_matrix}
            tickers={assets}
          />
        </div>
      )}
    </div>
  );
}

export default App;
