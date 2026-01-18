import React, { useEffect, useState } from "react";
import { FileSelect } from "./components/FileSelect";
import PositionsTable from "./components/PositionsTable";
import VaRSummary from "./components/VaRSummary";
import CorrelationMatrix from "./components/CorrelationMatrix";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [varResult, setVarResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [assets, setAssets] = useState([]);
  const [positions, setPositions] = useState({});

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (!selectedFile) return;

    fetch(`${API_BASE_URL}/var-covar/inspect`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dataset_name: selectedFile.name }),
    })
      .then(res => res.json())
      .then(data => {
        setAssets(data.assets);

        // default $100 each
        const initialPositions = {};
        data.assets.forEach(a => {
          initialPositions[a] = 100;
        });
        setPositions(initialPositions);
      })
      .catch(err => setError(err.message));
  }, [selectedFile]);

  const handleHoldingChange = (asset, value) => {
    setPositions(prev => ({
      ...prev,
      [asset]: value
    }));
  };

  const calculateVaR = () => {
    if (!selectedFile) {
      setError("Please select a CSV file first.");
      return
    }

    setLoading(true);
    setError(null);
    setVarResult(null);

    const requestBody = {
      dataset_name: selectedFile.name,
      confidence_level: 0.01,
      cov_window_days: 252,
      positions,
    };

    fetch(`${API_BASE_URL}/var-covar/calculate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
    .then((res) => {
      if (!res.ok) throw new Error(`Server error: {res.status}`);
      return res.json();
    })
    .then((data) => {
      setVarResult(data);
      console.log(data)
    })
    .catch((err) => {
      setError(err.message);
    })
    .finally(() => {
      setLoading(false);
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>VaR Frontend</h1>

      <FileSelect
        selectedFile={selectedFile}
        handleFileSelect={(file) => {
          setSelectedFile(file);
          setError(null);
          setVarResult(null);
        }}
      />


      {assets.length > 0 && (
        <PositionsTable
          assets={assets}
          positions={positions}
          onHoldingChange={handleHoldingChange}
        />
      )}

      <button onClick={calculateVaR} disabled={loading || !selectedFile}>
        {loading ? "Calculating..." : "Calculated Variance-Covariance VaR"}
      </button>

      {error && (
        <p style={{ color: "red" }}>
          <strong>Error:</strong> {error}
        </p>
      )}

      {varResult && (
        <div
          style={{
            display: "flex",
            gap: "24px",
            alignItems: "flex-start",
            marginTop: "24px",
          }}
        >
          {/* Left: VaR numbers */}
          <div style={{ flex: "0 0 300px" }}>
            <VaRSummary
              portfolioValue={varResult.portfolio_value}
              varDollars={varResult.var_dollars}
              varPercent={varResult.var_percent}
              volatilityPercent={varResult.volatility_percent}
            />
          </div>

          {/* Right: correlation matrix */}
          <div style={{ flex: 1 }}>
            <CorrelationMatrix corrMatrix={varResult.correlation_matrix} />
          </div>
        </div>
      )}

      {/* {varResult && (
        <div style={{ marginTop: 20 }}>
          <h2>Results:</h2>
          <p><strong>Portfolio Value ($):</strong> ${varResult.portfolio_value?.toFixed(2) ?? "N/A"}</p>
          <p><strong>VaR ($):</strong> ${varResult.var_dollars?.toFixed(2) ?? "N/A"}</p>
          <p><strong>VaR (%):</strong> {(varResult.var_percent * 100)?.toFixed(2) ?? "N/A"}%</p>
          <p><strong>Volatility:</strong> {(varResult.volatility_percent * 100)?.toFixed(2) ?? "N/A"}%</p>
        </div>
      )} */}

    </div>
  );
}

export default App;
