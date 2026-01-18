import React, { useEffect, useState } from "react";

function App() {
  // const [backendStatus, setBackendStatus] = useState("Loading...");
  const [varResult, setVarResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  // const API_BASE_URL = "https://var-backend-uyyz.onrender.com";
  // const API_BASE_URL = "http://127.0.0.1:8000";

  const calculateVaR = () => {
    setLoading(true);
    setError(null);
    setVarResult(null);

    const requestBody = {
      dataset_name: "portfolio_prices_10.csv",
      confidence_level: 0.01,
      cov_window_days: 252,
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
    })
    .catch((err) => {
      setError(err.message);
    })
    .finally(() => {
      setLoading(false);
    });
  };

  // useEffect(() => {
  //   // fetch("http://127.0.0.1:8000/health")
  //   fetch("https://var-backend-uyyz.onrender.com/health")
  //     .then((res) => res.json())
  //     .then((data) => setBackendStatus(data.status))
  //     .catch(() => setBackendStatus("Error connecting to backend"));
  // }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>VaR Frontend</h1>

      <button onClick={calculateVaR} disabled={loading}>
        {loading ? "Calculating..." : "Calculated Variance-Covariance VaR"}
      </button>

      {error && (
        <p style={{ color: "red" }}>
          <strong>Error:</strong> {error}
        </p>
      )}

      {varResult && (
        <div style={{ marginTop: 20 }}>
          <h2>Results:</h2>
          <p><strong>VaR:</strong> {(varResult.var * 100)?.toFixed(2) ?? "N/A"}%</p>
          <p><strong>Portfolio Volatility:</strong> {(varResult.portfolio_volatility * 100)?.toFixed(2) ?? "N/A"}%</p>
          <p><strong>Portfolio Mean Return:</strong> {(varResult.portfolio_mean_return * 100)?.toFixed(2) ?? "N/A"}%</p>
        </div>
      )}

      {/* {varResult && (
        <div style={{ marginTop: 20 }}>
          <h2>Results:</h2>
          <p>
            <strong>VaR:</strong> {varResult.var.toFixed(6)}
          </p>
          <p>
            <strong>Portfolio Volatility:</strong> {varResult.portfolio_volatility.toFixed(6)}
          </p>
          <p>
            <strong>Portfolio Mean Return:</strong> {varResult.portfolio_mean_return.toFixed(6)}
          </p>
        </div>    
      )} */}
    </div>
  );
}

//   return (
//     <div>
//       <h1>VaR Frontend</h1>
//       <p>Backend status: {backendStatus}</p>
//     </div>
//   );
// }

export default App;
