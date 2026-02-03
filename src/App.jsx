import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";

import FileSelectPage from "./pages/FileSelectPage";
import VaRSettingsPage from "./pages/VaRSettingsPage";
import PortfolioPage from "./pages/PortfolioPage";
import VaRResultPage from "./pages/VaRResultPage";

function App() {
  // Shared state for app (lifted up)
  const [datasetName, setDatasetName] = useState(null);
  const [datasetSource, setDatasetSource] = useState(null);
  const [assets, setAssets] = useState([]);
  const [spotPrices, setSpotPrices] = useState({});
  const [positions, setPositions] = useState({});
  const [varResult, setVarResult] = useState(null);
  const [varMethod, setVarMethod] = useState("parametric");
  const [varConfig, setVarConfig] = useState({
    confidenceLevel: 0.01,
    covWindowDays: 252,
    histDataWindowDays: 252,
    parameterEstimationWindowDays: 252,
  });
  const [asofDate, setAsofDate] = useState("2026-01-25");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const endpointByMethod = {
    parametric: "/parametric/calculate",
    histsim: "/histsim/calculate",
    montecarlo: "/montecarlo/calculate",
  };

  // Handle dataset loading effect (reset positions etc)
  useEffect(() => {
    if (!datasetName) return;

    fetch(`${API_BASE_URL}/parametric/inspect`, {
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
        setSpotPrices(data.spot_prices || {});
        // Initialize positions: $100 default per asset
        const initialPositions = {};
        data.assets.forEach((asset) => {
          const spot = data.spot_prices?.[asset] ?? 0;
          const marketValue = 100;
          const quantity = spot > 0 ? marketValue / spot : 0;
          initialPositions[asset] = { quantity, marketValue };
        });
        setPositions(initialPositions);
        setVarResult(null);
        setError(null);
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

    const productsArray = Object.entries(positions).map(([ticker, pos], index) => ({
      product_id: `${ticker}_${index}`,
      product_type: "stock",
      ticker: ticker,
      quantity: pos.quantity,
    }));

    const payload = {
      dataset_name: datasetName,
      confidence_level: varConfig.confidenceLevel,
      estimation_window_days:
        varMethod === "histsim"
          ? varConfig.histDataWindowDays
          : varMethod === "parametric"
          ? varConfig.covWindowDays
          : varConfig.parameterEstimationWindowDays,
      asof_date: asofDate,
      products: productsArray,
    };

    fetch(`${API_BASE_URL}${endpointByMethod[varMethod]}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("VaR calculation failed");
        return res.json();
      })
      .then((data) => {
        setVarResult({
          portfolioValue: data.portfolio_value,
          varDollars: data.var_dollar || data.var_absolute,
          varPercent: data.var_percent,
          volatilityPercent: data.volatility_percent,
          correlation_matrix: data.correlation_matrix,
        });
      })
      .catch(() => setError("VaR calculation failed"))
      .finally(() => setLoading(false));
  };

  return (
    <Router>
      <div style={{ padding: 20 }}>
        <h1>VaR App</h1>
        <nav style={{ marginBottom: 20 }}>
          <NavLink to="/" style={{ marginRight: 10 }}>
            Load Data
          </NavLink>
          <NavLink to="/settings" style={{ marginRight: 10 }}>
            VaR Settings
          </NavLink>
          <NavLink to="/portfolio" style={{ marginRight: 10 }}>
            Portfolio
          </NavLink>
          <NavLink to="/results" style={{ marginRight: 10 }}>
            VaR Results
          </NavLink>
        </nav>

        <Routes>
          <Route
            path="/"
            element={
              <FileSelectPage
                datasetName={datasetName}
                setDatasetName={setDatasetName}
                setDatasetSource={setDatasetSource}
                setError={setError}
              />
            }
          />
          <Route
            path="/settings"
            element={
              <VaRSettingsPage
                varMethod={varMethod}
                setVarMethod={setVarMethod}
                varConfig={varConfig}
                setVarConfig={setVarConfig}
                setVarResult={setVarResult}
              />
            }
          />
          <Route
            path="/portfolio"
            element={
              <PortfolioPage
                assets={assets}
                positions={positions}
                setPositions={setPositions}
                spotPrices={spotPrices}
              />
            }
          />
          <Route
            path="/results"
            element={
              <VaRResultPage
                varResult={varResult}
                loading={loading}
                error={error}
                calculateVaR={calculateVaR}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
