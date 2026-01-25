import React, { useEffect, useState } from "react";
import FileSelect from "./components/FileSelect";
import PositionsTable from "./components/PositionsTable";
// import VaRSummary from "./components/VaRSummary";
// import CorrelationMatrix from "./components/CorrelationMatrix";
import VaRMethodSelect from "./components/VaRMethodSelect";
import VaRConfigPanel from "./components/VaRConfigPanel";
import VaRResultPanel from "./components/VaRResultPanel";

function App() {
  const [datasetName, setDatasetName] = useState(null);
  const [datasetSource, setDatasetSource] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [positions, setPositions] = useState({});
  const [assets, setAssets] = useState([]);
  const [varResult, setVarResult] = useState(null);
  const [varMethod, setVarMethod] = useState("parametric");

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const endpointByMethod = {
    parametric: "/parametric/calculate",
    histsim: "/histsim/calculate",
    montecarlo: "/montecarlo/calculate",
  };

  const [varConfig, setVarConfig] = useState({
    confidenceLevel: 0.01,
    covWindowDays: 252,
    histDataWindowDays: 252,
  });

  /* Inspect dataset when loaded or changed */
  useEffect(() => {
    if (!datasetName) return;

    fetch(`${API_BASE_URL}/parametric/inspect`, {
    // fetch(`${API_BASE_URL}/var-covar/inspect`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dataset_name: datasetName }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to inspect dataset");
        return res.json();
      })
      .then((data) => {
        setAssets(data.assets);
        // Default all positions to 100 for each asset
        setPositions(Object.fromEntries(data.assets.map((a) => [a, 100])));
        setVarResult(null);  // Clear previous results on dataset change
        setError(null);
      })
      .catch(() => setError("Failed to inspect dataset"));
  }, [datasetName]);

  /* Calculate VaR based on current positions */
  const calculateVaR = () => {
    if (!datasetName) {
      setError("Please load a dataset first.");
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`${API_BASE_URL}${endpointByMethod[varMethod]}`, {
    // fetch(`${API_BASE_URL}/histsim/calculate`, {
    // fetch(`${API_BASE_URL}/parametric/calculate`, {
    // fetch(`${API_BASE_URL}/var-covar/calculate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dataset_name: datasetName,
        confidence_level: varConfig.confidenceLevel,
        positions,
        ...(varMethod === "parametric" && { cov_window_days: varConfig.covWindowDays }),
        ...(varMethod === "histsim" && { hist_data_window_days: varConfig.histDataWindowDays }),
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("VaR calculation failed");
        return res.json();
      })
      .then((data) => {
        console.log(data)
        setVarResult({
          portfolioValue: data.portfolio_value,
          varDollars: data.var_absolute,
          varPercent: data.var_percent,
          volatilityPercent: data.volatility_percent,
          correlation_matrix: data.correlation_matrix,
        });
        setError(null);
      })
      .catch(() => setError("VaR calculation failed"))
      .finally(() => setLoading(false));
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>VaR</h1>

      <FileSelect
        apiBaseUrl={API_BASE_URL}
        onDatasetLoaded={(name, source) => {
          setDatasetName(name);
          setDatasetSource(source);
        }}
      />

      {datasetName && datasetSource && (
        <p>
          Loaded dataset: <strong>{datasetName}</strong> (source: {datasetSource})
        </p>
      )}

      <VaRMethodSelect
        value={varMethod}
        onChange={(method) => {
          setVarMethod(method);
          setVarResult(null);
        }}
      />

      <VaRConfigPanel
        varMethod={varMethod}
        config={varConfig}
        onChange={(newConfig) => {
          setVarConfig(newConfig);
          setVarResult(null);
        }}
      />

      {/* <FileSelect apiBaseUrl={API_BASE_URL} onDatasetLoaded={setDatasetName} /> */}

      {assets.length > 0 && datasetName && (
        <PositionsTable
          assets={assets}
          positions={positions}
          onHoldingChange={(asset, value) =>
            setPositions((prev) => ({ ...prev, [asset]: value }))
          }
        />
      )}

      <button onClick={calculateVaR} disabled={loading || assets.length === 0}>
        {loading ? "Calculating…" : "Calculate VaR"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <VaRResultPanel
        varResult={varResult}
        varMethod={varMethod}
        assets={assets}
      />

      {/* {varResult && (
        <div style={{ display: "flex", gap: 24, marginTop: 24 }}>
          <VaRSummary {...varResult} />
          <CorrelationMatrix corrMatrix={varResult.correlation_matrix} tickers={assets} />
        </div>
      )} */}
    </div>
  );
}

export default App;
